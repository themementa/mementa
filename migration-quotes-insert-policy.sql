ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_can_insert_own_quotes"
  ON public.quotes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

