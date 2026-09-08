-- My Health — LLM pricing, exchange registry, and therapy photo-import AI audit
-- Apply with psql: psql "$DATABASE_URL" -f migrations/006_ai_audit_and_costs.sql

CREATE TABLE IF NOT EXISTS public.llm_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  model TEXT NOT NULL UNIQUE,
  input_cost_per_million_usd NUMERIC(12, 6) NOT NULL,
  output_cost_per_million_usd NUMERIC(12, 6) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.llm_models (provider, model, input_cost_per_million_usd, output_cost_per_million_usd)
VALUES ('anthropic', 'claude-sonnet-4-20250514', 3.000000, 15.000000)
ON CONFLICT (model) DO UPDATE
SET
  provider = EXCLUDED.provider,
  input_cost_per_million_usd = EXCLUDED.input_cost_per_million_usd,
  output_cost_per_million_usd = EXCLUDED.output_cost_per_million_usd,
  updated_at = now();

CREATE TABLE IF NOT EXISTS public.exchange_table_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  logical_key TEXT NOT NULL,
  table_name TEXT NOT NULL,
  occurred_at_column TEXT NOT NULL DEFAULT 'created_at',
  input_tokens_column TEXT NOT NULL DEFAULT 'input_tokens',
  output_tokens_column TEXT NOT NULL DEFAULT 'output_tokens',
  model_column TEXT DEFAULT 'model_used',
  enabled BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_exchange_table_registry_logical_key
  ON public.exchange_table_registry (logical_key);

CREATE INDEX IF NOT EXISTS idx_exchange_table_registry_enabled
  ON public.exchange_table_registry (enabled, sort_order);

INSERT INTO public.exchange_table_registry (logical_key, table_name, sort_order, notes)
SELECT
  'therapy_exercise_import',
  'therapy_exercise_import_ai_exchanges',
  10,
  'Speech therapy homework photo import'
WHERE NOT EXISTS (
  SELECT 1 FROM public.exchange_table_registry WHERE logical_key = 'therapy_exercise_import'
);

CREATE TABLE IF NOT EXISTS public.therapy_exercise_import_ai_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  import_id UUID REFERENCES public.therapy_exercise_imports(id) ON DELETE SET NULL,
  provider TEXT NOT NULL DEFAULT 'anthropic',
  model TEXT NOT NULL,
  mime_type TEXT,
  filename TEXT,
  system_prompt TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed', 'failed')),
  exchange_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.therapy_exercise_import_ai_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.therapy_exercise_import_ai_requests(id) ON DELETE CASCADE,
  model TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'error')),
  raw_response TEXT,
  parsed_response_json JSONB,
  error_message TEXT,
  usage_input_tokens INTEGER,
  usage_output_tokens INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.therapy_exercise_import_ai_exchanges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.therapy_exercise_import_ai_requests(id) ON DELETE CASCADE,
  response_id UUID REFERENCES public.therapy_exercise_import_ai_responses(id) ON DELETE SET NULL,
  import_id UUID REFERENCES public.therapy_exercise_imports(id) ON DELETE SET NULL,
  input_tokens INTEGER,
  output_tokens INTEGER,
  total_tokens INTEGER,
  model_used TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.therapy_exercise_import_ai_requests
  DROP CONSTRAINT IF EXISTS fk_teiar_exchange;
ALTER TABLE public.therapy_exercise_import_ai_requests
  ADD CONSTRAINT fk_teiar_exchange
  FOREIGN KEY (exchange_id) REFERENCES public.therapy_exercise_import_ai_exchanges(id) ON DELETE SET NULL;

ALTER TABLE public.therapy_exercise_imports
  ADD COLUMN IF NOT EXISTS exchange_id UUID;

ALTER TABLE public.therapy_exercise_imports
  DROP CONSTRAINT IF EXISTS fk_tei_exchange;
ALTER TABLE public.therapy_exercise_imports
  ADD CONSTRAINT fk_tei_exchange
  FOREIGN KEY (exchange_id) REFERENCES public.therapy_exercise_import_ai_exchanges(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_teiae_created
  ON public.therapy_exercise_import_ai_exchanges (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_teiae_status
  ON public.therapy_exercise_import_ai_exchanges (status);

CREATE INDEX IF NOT EXISTS idx_teiar_exchange_id
  ON public.therapy_exercise_import_ai_requests (exchange_id);
