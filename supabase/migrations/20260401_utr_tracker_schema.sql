-- UTR Tracker schema – players, matches, Color Ball, season_config
-- Follows LBTA UTR Tracker Cursor Spec v3.1

-- 1. Players
CREATE TABLE IF NOT EXISTS players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  utr NUMERIC(4,2),
  divisions TEXT[] DEFAULT '{}'::TEXT[],
  -- Division IDs: 'sat_color_ball', 'sat_utr_singles', 'sun_singles', 'sun_doubles'
  color_ball_stage TEXT CHECK (color_ball_stage IN ('red', 'orange', 'green')) ,
  is_color_ball BOOLEAN DEFAULT false,
  social_opt_in BOOLEAN DEFAULT false,
  season_registration BOOLEAN DEFAULT true,
  is_drop_in BOOLEAN DEFAULT false,
  provisional_utr BOOLEAN DEFAULT false,
  -- If true, UTR is estimated (Beginner=2.0, Intermediate=3.5, Advanced=5.0)
  joined_week INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Matches (UTR divisions — supports singles AND doubles)
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  week INTEGER NOT NULL CHECK (week >= 1 AND week <= 8),
  date DATE NOT NULL,
  division TEXT NOT NULL CHECK (division IN ('sat_utr_singles', 'sun_singles', 'sun_doubles')),
  is_doubles BOOLEAN DEFAULT false,
  -- Singles: player1 vs player2. Doubles: player1+player3 vs player2+player4
  player1_id UUID REFERENCES players(id),
  player1_name TEXT NOT NULL,
  player1_utr NUMERIC(4,2) NOT NULL,
  player1_provisional BOOLEAN DEFAULT false,
  player2_id UUID REFERENCES players(id),
  player2_name TEXT NOT NULL,
  player2_utr NUMERIC(4,2) NOT NULL,
  player2_provisional BOOLEAN DEFAULT false,
  -- Doubles partners (NULL for singles)
  player3_id UUID REFERENCES players(id),
  player3_name TEXT,
  player3_utr NUMERIC(4,2),
  player3_provisional BOOLEAN DEFAULT false,
  player4_id UUID REFERENCES players(id),
  player4_name TEXT,
  player4_utr NUMERIC(4,2),
  player4_provisional BOOLEAN DEFAULT false,
  score TEXT NOT NULL,
  winner_id UUID REFERENCES players(id) NOT NULL,
  -- For doubles, winner_id = any player on winning team (used to determine winning side)
  winning_team INTEGER CHECK (winning_team IN (1, 2)),
  -- Team 1 = player1 + player3, Team 2 = player2 + player4
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_matches_week ON matches(week);
CREATE INDEX IF NOT EXISTS idx_matches_division ON matches(division);

-- 3. Color Ball Attendance (passport tracking)
CREATE TABLE IF NOT EXISTS color_ball_attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID REFERENCES players(id) NOT NULL,
  week INTEGER NOT NULL CHECK (week >= 1 AND week <= 8),
  attended BOOLEAN DEFAULT true,
  completed_match BOOLEAN DEFAULT false,
  matches_played INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(player_id, week)
);

-- 4. Color Ball Badges
CREATE TABLE IF NOT EXISTS color_ball_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID REFERENCES players(id) NOT NULL,
  badge_id TEXT NOT NULL,
  awarded_week INTEGER NOT NULL,
  awarded_by TEXT DEFAULT 'coach',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(player_id, badge_id)
);

-- 5. Season Config
CREATE TABLE IF NOT EXISTS season_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

-- Seed config if empty
INSERT INTO season_config (key, value)
SELECT 'multipliers', '{"1":2.0,"2":1.0,"3":1.0,"4":1.0,"5":1.25,"6":1.25,"7":1.5,"8":1.5}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM season_config WHERE key = 'multipliers');

INSERT INTO season_config (key, value)
SELECT 'tiers',
       '[{"name":"Baseline","min":0,"max":60,"color":"#9CA3AF","badge":"gray"},{"name":"Rally","min":61,"max":120,"color":"#2563EB","badge":"blue"},{"name":"Match Point","min":121,"max":180,"color":"#2D6A4F","badge":"teal"},{"name":"Championship","min":181,"max":9999,"color":"#D4A017","badge":"gold"}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM season_config WHERE key = 'tiers');

INSERT INTO season_config (key, value)
SELECT 'current_week', '1'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM season_config WHERE key = 'current_week');

INSERT INTO season_config (key, value)
SELECT 'total_weeks', '8'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM season_config WHERE key = 'total_weeks');

INSERT INTO season_config (key, value)
SELECT 'grand_finals_min_weeks', '5'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM season_config WHERE key = 'grand_finals_min_weeks');

-- 6. Row Level Security — public read, admin write
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE color_ball_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE color_ball_badges ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'players' AND policyname = 'Public read') THEN
    CREATE POLICY "Public read" ON players FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'players' AND policyname = 'Admin write') THEN
    CREATE POLICY "Admin write" ON players FOR ALL USING (auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'matches' AND policyname = 'Public read') THEN
    CREATE POLICY "Public read" ON matches FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'matches' AND policyname = 'Admin write') THEN
    CREATE POLICY "Admin write" ON matches FOR ALL USING (auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'color_ball_attendance' AND policyname = 'Public read') THEN
    CREATE POLICY "Public read" ON color_ball_attendance FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'color_ball_attendance' AND policyname = 'Admin write') THEN
    CREATE POLICY "Admin write" ON color_ball_attendance FOR ALL USING (auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'color_ball_badges' AND policyname = 'Public read') THEN
    CREATE POLICY "Public read" ON color_ball_badges FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'color_ball_badges' AND policyname = 'Admin write') THEN
    CREATE POLICY "Admin write" ON color_ball_badges FOR ALL USING (auth.role() = 'authenticated');
  END IF;
END
$$;

