-- Fill quotes table from daily_quotes table
-- This script copies quote text from daily_quotes to quotes table
-- Only inserts rows where cleaned_text_zh_tw is not null
-- Uses ON CONFLICT DO NOTHING to prevent duplicates

INSERT INTO quotes (original_text, cleaned_text_zh_tw)
SELECT original_text, cleaned_text_zh_tw
FROM daily_quotes
WHERE cleaned_text_zh_tw IS NOT NULL
ON CONFLICT DO NOTHING;

