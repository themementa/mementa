CREATE TABLE IF NOT EXISTS daily_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_daily_quotes_date ON daily_quotes(date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_quotes_quote_id ON daily_quotes(quote_id);



