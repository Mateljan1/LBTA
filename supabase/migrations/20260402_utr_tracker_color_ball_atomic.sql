-- Atomic Color Ball week write to avoid partial attendance/badge updates.
-- Applies attendance upsert + coach badge replacement in one DB transaction.

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
  SELECT
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
