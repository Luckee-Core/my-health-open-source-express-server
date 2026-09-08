-- Seed Haiku 4.5 pricing (vision import uses this model)
INSERT INTO public.llm_models (provider, model, input_cost_per_million_usd, output_cost_per_million_usd)
VALUES ('anthropic', 'claude-haiku-4-5-20251001', 1.000000, 5.000000)
ON CONFLICT (model) DO UPDATE
SET
  provider = EXCLUDED.provider,
  input_cost_per_million_usd = EXCLUDED.input_cost_per_million_usd,
  output_cost_per_million_usd = EXCLUDED.output_cost_per_million_usd,
  updated_at = now();
