-- Atomic UTR match scope replacement.
-- Replaces one import scope (week + division + date) inside a transaction
-- to prevent duplicate imports from repeated admin pastes.

CREATE OR REPLACE FUNCTION public.replace_utr_matches_scope(
  p_week INTEGER,
  p_division TEXT,
  p_date DATE,
  p_rows JSONB
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

  IF p_division NOT IN ('sat_utr_singles', 'sun_singles', 'sun_doubles') THEN
    RAISE EXCEPTION 'Invalid division: %', p_division;
  END IF;

  IF jsonb_typeof(p_rows) IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION 'p_rows must be a JSON array';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM jsonb_array_elements(p_rows) AS row_data
    WHERE (row_data->>'week')::INTEGER <> p_week
      OR row_data->>'division' <> p_division
      OR (row_data->>'date')::DATE <> p_date
  ) THEN
    RAISE EXCEPTION 'All rows must match scope week/division/date';
  END IF;

  DELETE FROM matches
  WHERE week = p_week
    AND division = p_division
    AND date = p_date;

  INSERT INTO matches (
    week,
    date,
    division,
    is_doubles,
    player1_id,
    player1_name,
    player1_utr,
    player1_provisional,
    player2_id,
    player2_name,
    player2_utr,
    player2_provisional,
    player3_id,
    player3_name,
    player3_utr,
    player3_provisional,
    player4_id,
    player4_name,
    player4_utr,
    player4_provisional,
    score,
    winner_id,
    winning_team
  )
  SELECT
    (row_data->>'week')::INTEGER AS week,
    (row_data->>'date')::DATE AS date,
    row_data->>'division' AS division,
    COALESCE((row_data->>'is_doubles')::BOOLEAN, false) AS is_doubles,
    NULLIF(row_data->>'player1_id', '')::UUID AS player1_id,
    row_data->>'player1_name' AS player1_name,
    (row_data->>'player1_utr')::NUMERIC(4,2) AS player1_utr,
    COALESCE((row_data->>'player1_provisional')::BOOLEAN, false) AS player1_provisional,
    NULLIF(row_data->>'player2_id', '')::UUID AS player2_id,
    row_data->>'player2_name' AS player2_name,
    (row_data->>'player2_utr')::NUMERIC(4,2) AS player2_utr,
    COALESCE((row_data->>'player2_provisional')::BOOLEAN, false) AS player2_provisional,
    NULLIF(row_data->>'player3_id', '')::UUID AS player3_id,
    NULLIF(row_data->>'player3_name', '') AS player3_name,
    NULLIF(row_data->>'player3_utr', '')::NUMERIC(4,2) AS player3_utr,
    COALESCE((row_data->>'player3_provisional')::BOOLEAN, false) AS player3_provisional,
    NULLIF(row_data->>'player4_id', '')::UUID AS player4_id,
    NULLIF(row_data->>'player4_name', '') AS player4_name,
    NULLIF(row_data->>'player4_utr', '')::NUMERIC(4,2) AS player4_utr,
    COALESCE((row_data->>'player4_provisional')::BOOLEAN, false) AS player4_provisional,
    row_data->>'score' AS score,
    NULLIF(row_data->>'winner_id', '')::UUID AS winner_id,
    NULLIF(row_data->>'winning_team', '')::INTEGER AS winning_team
  FROM jsonb_array_elements(p_rows) AS row_data;
END;
$$;
