-- Follow-up atomic and dedupe hardening:
-- 1) Atomic players batch write in one DB function call.
-- 2) Deduplicate coach_badges within a Color Ball week payload.

CREATE OR REPLACE FUNCTION public.upsert_players_batch(
  p_players JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF jsonb_typeof(p_players) IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION 'p_players must be a JSON array';
  END IF;

  INSERT INTO players (
    id,
    name,
    utr,
    divisions,
    color_ball_stage,
    is_color_ball,
    social_opt_in,
    season_registration,
    is_drop_in,
    provisional_utr,
    joined_week
  )
  SELECT
    COALESCE(NULLIF(entry->>'id', '')::UUID, gen_random_uuid()) AS id,
    TRIM(entry->>'name') AS name,
    CASE
      WHEN entry ? 'utr' AND entry->>'utr' <> '' THEN (entry->>'utr')::NUMERIC
      ELSE NULL
    END AS utr,
    COALESCE(
      ARRAY(
        SELECT jsonb_array_elements_text(COALESCE(entry->'divisions', '[]'::JSONB))
      ),
      '{}'::TEXT[]
    ) AS divisions,
    CASE
      WHEN entry ? 'color_ball_stage' AND entry->>'color_ball_stage' <> '' THEN entry->>'color_ball_stage'
      ELSE NULL
    END AS color_ball_stage,
    COALESCE((entry->>'is_color_ball')::BOOLEAN, false) AS is_color_ball,
    COALESCE((entry->>'social_opt_in')::BOOLEAN, false) AS social_opt_in,
    COALESCE((entry->>'season_registration')::BOOLEAN, true) AS season_registration,
    COALESCE((entry->>'is_drop_in')::BOOLEAN, false) AS is_drop_in,
    COALESCE((entry->>'provisional_utr')::BOOLEAN, false) AS provisional_utr,
    COALESCE((entry->>'joined_week')::INTEGER, 1) AS joined_week
  FROM jsonb_array_elements(p_players) AS entry
  ON CONFLICT (id)
  DO UPDATE SET
    name = EXCLUDED.name,
    utr = EXCLUDED.utr,
    divisions = EXCLUDED.divisions,
    color_ball_stage = EXCLUDED.color_ball_stage,
    is_color_ball = EXCLUDED.is_color_ball,
    social_opt_in = EXCLUDED.social_opt_in,
    season_registration = EXCLUDED.season_registration,
    is_drop_in = EXCLUDED.is_drop_in,
    provisional_utr = EXCLUDED.provisional_utr,
    joined_week = EXCLUDED.joined_week;
END;
$$;

CREATE OR REPLACE FUNCTION public.upsert_color_ball_week(
  p_week INTEGER,
  p_entries JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_week < 1 OR p_week > 8 THEN
    RAISE EXCEPTION 'Invalid week: %', p_week;
  END IF;

  IF jsonb_typeof(p_entries) IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION 'p_entries must be a JSON array';
  END IF;

  INSERT INTO color_ball_attendance (
    player_id,
    week,
    attended,
    completed_match,
    matches_played
  )
  SELECT
    (entry->>'player_id')::UUID AS player_id,
    p_week AS week,
    COALESCE((entry->>'attended')::BOOLEAN, false) AS attended,
    COALESCE((entry->>'completed_match')::BOOLEAN, false) AS completed_match,
    COALESCE((entry->>'matches_played')::INTEGER, 0) AS matches_played
  FROM jsonb_array_elements(p_entries) AS entry
  ON CONFLICT (player_id, week)
  DO UPDATE SET
    attended = EXCLUDED.attended,
    completed_match = EXCLUDED.completed_match,
    matches_played = EXCLUDED.matches_played;

  DELETE FROM color_ball_badges
  WHERE awarded_week = p_week
    AND awarded_by = 'coach';

  INSERT INTO color_ball_badges (
    player_id,
    badge_id,
    awarded_week,
    awarded_by
  )
  SELECT DISTINCT
    (entry->>'player_id')::UUID AS player_id,
    TRIM(badge_id) AS badge_id,
    p_week AS awarded_week,
    'coach' AS awarded_by
  FROM jsonb_array_elements(p_entries) AS entry
  CROSS JOIN LATERAL jsonb_array_elements_text(
    COALESCE(entry->'coach_badges', '[]'::JSONB)
  ) AS badge_id
  WHERE TRIM(badge_id) <> ''
  ON CONFLICT (player_id, badge_id)
  DO UPDATE SET
    awarded_week = EXCLUDED.awarded_week,
    awarded_by = EXCLUDED.awarded_by;
END;
$$;
