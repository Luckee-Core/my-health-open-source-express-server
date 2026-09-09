import { buildCrudEntityDocs } from "../../utils/api-docs";
import type { ApiDocsCatalog, ApiDocsGroup } from "./types";

const DEFAULT_PORT = 3009;
const ts = "2026-01-15T12:00:00.000Z";

const hospitalExample = {
  id: "uuid",
  name: "City General Hospital",
  address: "123 Main St",
  email: "info@citygeneral.example",
  phone: "555-0100",
  notes: null,
  created_at: ts,
  updated_at: ts,
};

const specialtyExample = {
  id: "uuid",
  name: "Cardiology",
  created_at: ts,
  updated_at: ts,
};

const doctorExample = {
  id: "uuid",
  name: "Dr. Jane Smith",
  hospital_id: "uuid",
  specialty_id: "uuid",
  notes: null,
  created_at: ts,
  updated_at: ts,
};

const appointmentExample = {
  id: "uuid",
  doctor_id: "uuid",
  scheduled_at: "2026-02-01T14:00:00.000Z",
  status: "scheduled",
  appointment_type: "Follow-up",
  reason: "Annual checkup",
  notes: null,
  completed_at: null,
  created_at: ts,
  updated_at: ts,
};

const focusAreaExample = {
  id: "uuid",
  name: "Sleep",
  description: "Track sleep quality and habits",
  created_at: ts,
  updated_at: ts,
};

const dailyEntryExample = {
  id: "uuid",
  entry_date: "2026-01-15",
  focus_area_id: "uuid",
  notes: "Slept 7 hours, felt rested",
  created_at: ts,
  updated_at: ts,
};

const medicalHistoryEventExample = {
  id: "uuid",
  event_date: "2020-06-15",
  title: "Endoscopic resection — skull base chondrosarcoma",
  category: "surgery",
  description: "Transnasal approach; most of tumor removed.",
  doctor_id: "uuid",
  appointment_id: null,
  focus_area_id: "uuid",
  created_at: ts,
  updated_at: ts,
};

const symptomLogExample = {
  id: "uuid",
  recorded_at: ts,
  name: "Voice fatigue",
  severity: 6,
  triggers: "prolonged talking",
  duration_minutes: null,
  notes: "Hoarse after 15 minutes of conversation",
  focus_area_id: "uuid",
  created_at: ts,
  updated_at: ts,
};

const researchNoteExample = {
  id: "uuid",
  title: "MRI skull base interpretation",
  category: "imaging",
  source_url: null,
  summary: "Incomplete study; concerning for chondrosarcoma recurrence",
  content: "Full pasted notes or report text…",
  focus_area_id: "uuid",
  created_at: ts,
  updated_at: ts,
};

const buildOverviewGroup = (): ApiDocsGroup => ({
  name: "Overview",
  description: [
    "REST API for the open-source My Health app. On-device Postgres stores hospitals, specialties, doctors, appointments, focus areas, daily journal entries, medical history events, symptom logs, and research notes; this Express server exposes CRUD over HTTP for the Next.js dashboard or any client.",
    "Route layout: `/api/data/*` — REST entity CRUD (`GET/POST /`, `PATCH/DELETE /:id`); `GET /api-docs.json` — this catalog. There is no `GET /:id` single-entity fetch — list all rows and filter client-side, or use PATCH/DELETE with a known id.",
    "Typical flow: create hospitals and specialties → add doctors (linked to hospital + specialty) → schedule appointments → define focus areas → log daily entries against a focus area and date.",
    "Success JSON: `{ success: true, data }`. Error JSON: `{ success: false, error: string }`. DELETE returns `{ success: true, data: null }`. OSS default has no authentication — bind to localhost for trusted local dev. Requires `DATABASE_URL` on Express.",
  ].join("\n\n"),
  endpoints: [],
});

const buildHealthGroup = (): ApiDocsGroup => ({
  name: "Health",
  description:
    "Liveness probe for load balancers and local dev. Returns plain JSON without the `{ success, data }` envelope.",
  endpoints: [
    {
      method: "GET",
      path: "/api/health",
      summary: "Health check",
      responses: [
        {
          status: 200,
          description: "Server is running (no success wrapper)",
          example: {
            status: "ok",
            message: "My Health Express Server is running",
            timestamp: ts,
            environment: "development",
          },
        },
      ],
    },
  ],
});

const buildEntityGroup = (
  name: string,
  description: string,
  basePath: string,
  entityName: string,
  entityExample: unknown,
  createBodyExample: unknown,
  patchBodyExample: unknown,
): ApiDocsGroup => ({
  name,
  description,
  endpoints: buildCrudEntityDocs({
    entityName,
    basePath,
    entityExample,
    createBodyExample,
    patchBodyExample,
    includeGetById: false,
  }),
});

/**
 * Builds the full API documentation catalog for My Health Express.
 */
export const buildApiDocsCatalog = (): ApiDocsCatalog => {
  const portFromEnv = Number(process.env.PORT);
  const port =
    Number.isFinite(portFromEnv) && portFromEnv > 0 ? portFromEnv : DEFAULT_PORT;
  const baseUrl =
    process.env.PUBLIC_API_URL?.trim().replace(/\/$/, "") ||
    `http://localhost:${port}`;

  const groups: ApiDocsGroup[] = [
    buildOverviewGroup(),
    buildHealthGroup(),
    buildEntityGroup(
      "Hospitals",
      "Healthcare facilities where doctors practice. Create hospitals before linking doctors.",
      "/api/data/hospitals",
      "hospital",
      hospitalExample,
      { name: "City General Hospital", address: "123 Main St" },
      { name: "City General Medical Center" },
    ),
    buildEntityGroup(
      "Specialties",
      "Medical specialties (cardiology, pediatrics, etc.). Referenced by doctors.",
      "/api/data/specialties",
      "specialty",
      specialtyExample,
      { name: "Cardiology" },
      { name: "Internal Medicine" },
    ),
    buildEntityGroup(
      "Doctors",
      "Providers linked to a hospital and specialty. Required for scheduling appointments.",
      "/api/data/doctors",
      "doctor",
      doctorExample,
      { name: "Dr. Jane Smith", hospital_id: "uuid", specialty_id: "uuid" },
      { name: "Dr. Jane Smith", notes: "Accepts new patients" },
    ),
    buildEntityGroup(
      "Appointments",
      "Scheduled visits with a doctor. Track status (scheduled, completed, cancelled) and completion time.",
      "/api/data/appointments",
      "appointment",
      appointmentExample,
      {
        doctor_id: "uuid",
        scheduled_at: "2026-02-01T14:00:00.000Z",
        status: "scheduled",
        reason: "Annual checkup",
      },
      { status: "completed", completed_at: ts },
    ),
    buildEntityGroup(
      "Focus areas",
      "Health themes for daily journaling (sleep, nutrition, exercise, etc.).",
      "/api/data/focus-areas",
      "focus area",
      focusAreaExample,
      { name: "Sleep", description: "Track sleep quality" },
      { description: "Sleep hygiene and duration" },
    ),
    buildEntityGroup(
      "Daily entries",
      "Journal notes for a calendar date and focus area. One row per date + focus area combination.",
      "/api/data/daily-entries",
      "daily entry",
      dailyEntryExample,
      { entry_date: "2026-01-15", focus_area_id: "uuid", notes: "Slept 7 hours" },
      { notes: "Updated journal note" },
    ),
    buildEntityGroup(
      "Medical history events",
      "Timeline of diagnoses, surgeries, imaging, and other significant health milestones.",
      "/api/data/medical-history-events",
      "medical history event",
      medicalHistoryEventExample,
      {
        event_date: "2020-06-15",
        title: "Endoscopic resection",
        category: "surgery",
        description: "Skull base chondrosarcoma",
      },
      { description: "Updated treatment notes" },
    ),
    buildEntityGroup(
      "Symptom logs",
      "Point-in-time symptom episodes with optional severity, triggers, and duration.",
      "/api/data/symptom-logs",
      "symptom log",
      symptomLogExample,
      { name: "Voice fatigue", severity: 6, triggers: "prolonged talking" },
      { severity: 7, notes: "Worse in the evening" },
    ),
    buildEntityGroup(
      "Research notes",
      "Articles, imaging interpretation, doctor prep questions, and pasted reference material.",
      "/api/data/research-notes",
      "research note",
      researchNoteExample,
      {
        title: "MRI skull base interpretation",
        category: "imaging",
        summary: "Concerning for recurrence",
        content: "Full notes…",
      },
      { summary: "Updated summary" },
    ),
    buildEntityGroup(
      "Allergies",
      "Allergy substances, reactions, and criticality.",
      "/api/data/allergies",
      "allergy",
      {
        id: "uuid",
        substance: "Codeine",
        reaction: "Anaphylaxis",
        criticality: "High",
        status: "active",
        notes: null,
        created_at: ts,
        updated_at: ts,
      },
      { substance: "Peanut", reaction: "Anaphylaxis", criticality: "High" },
      { status: "inactive" },
    ),
    buildEntityGroup(
      "Medications",
      "Active and stopped medications with instructions.",
      "/api/data/medications",
      "medication",
      {
        id: "uuid",
        name: "pantoprazole",
        instructions: "Take by mouth",
        started_on: null,
        status: "active",
        doctor_id: null,
        notes: null,
        created_at: ts,
        updated_at: ts,
      },
      { name: "ondansetron", instructions: "4 mg as needed" },
      { status: "stopped" },
    ),
    buildEntityGroup(
      "Conditions",
      "Problem list (active/resolved conditions).",
      "/api/data/conditions",
      "condition",
      {
        id: "uuid",
        name: "Bone cancer",
        status: "active",
        noted_on: "2020-12-10",
        diagnosed_on: null,
        focus_area_id: null,
        notes: null,
        created_at: ts,
        updated_at: ts,
      },
      { name: "Low blood phosphate", status: "active" },
      { status: "resolved" },
    ),
    buildEntityGroup(
      "Feed formulas",
      "Enteral formula catalog (brand, calories per 1000 mL, container label volumes).",
      "/api/data/feed-formulas",
      "feed formula",
      {
        id: "uuid",
        brand: "Nestle",
        name: "Isosource 1.5",
        calories_per_1000_ml: 1500,
        container_volume_ml: 1000,
        volume_fl_oz: 33.8,
        volume_qt: 1,
        volume_l: 1,
        is_active: true,
        notes: null,
        created_at: ts,
        updated_at: ts,
      },
      {
        brand: "Nestle",
        name: "Isosource 1.5",
        calories_per_1000_ml: 1500,
        container_volume_ml: 1000,
        volume_fl_oz: 33.8,
        volume_qt: 1,
        volume_l: 1,
      },
      { is_active: false },
    ),
    {
      name: "Feed logs",
      description:
        "Morning pump snapshots. PUT inserts the one-time is_start origin, or upserts the morning row for log_date (a morning may share a date with the start). Snapshots calories_per_1000_ml from the formula. Volume and calories are derived in the web app from consecutive totals.",
      endpoints: [
        {
          method: "GET",
          path: "/api/data/feed-logs",
          summary: "List pump snapshots newest first",
          responses: [
            {
              status: 200,
              description: "Log rows",
              example: {
                success: true,
                data: [
                  {
                    id: "uuid",
                    log_date: "2026-01-15",
                    formula_id: "uuid",
                    intermittent_rate_ml_per_hr: 50,
                    feed_left_ml: 400,
                    total_fed_ml: 1600,
                    pump_reset: false,
                    is_start: false,
                    calories_per_1000_ml: 1500,
                    notes: null,
                    created_at: ts,
                    updated_at: ts,
                  },
                ],
              },
            },
          ],
        },
        {
          method: "PUT",
          path: "/api/data/feed-logs",
          summary: "Insert the start snapshot once, or upsert a morning snapshot",
          requestBody: {
            contentType: "application/json",
            example: {
              log_date: "2026-01-15",
              formula_id: "uuid",
              intermittent_rate_ml_per_hr: 50,
              feed_left_ml: 400,
              total_fed_ml: 1600,
              pump_reset: false,
              is_start: true,
            },
          },
          responses: [
            {
              status: 200,
              description: "Saved snapshot",
              example: {
                success: true,
                data: {
                  id: "uuid",
                  log_date: "2026-01-15",
                  formula_id: "uuid",
                  intermittent_rate_ml_per_hr: 50,
                  feed_left_ml: 400,
                  total_fed_ml: 1600,
                  pump_reset: false,
                  is_start: false,
                  calories_per_1000_ml: 1500,
                  notes: null,
                  created_at: ts,
                  updated_at: ts,
                },
              },
            },
          ],
        },
        {
          method: "DELETE",
          path: "/api/data/feed-logs/:id",
          summary: "Delete a pump snapshot",
          responses: [
            {
              status: 200,
              description: "Deleted",
              example: { success: true, data: { id: "uuid" } },
            },
          ],
        },
      ],
    },
    buildEntityGroup(
      "Therapy exercises",
      "Speech therapy prescriptions. frequency is daily (homework remaining list) or session (therapy-visit only). is_active=false pauses logging.",
      "/api/data/therapy-exercises",
      "therapy exercise",
      {
        id: "uuid",
        discipline: "speech",
        name: "Straw phonation",
        instructions: "Hum through a straw for 5 seconds",
        tracking_kind: "timed_attempts",
        target_count: 10,
        unit_size: 5,
        frequency: "daily",
        is_active: true,
        sort_order: 0,
        source: "manual",
        import_id: null,
        created_at: ts,
        updated_at: ts,
      },
      {
        name: "Straw phonation",
        tracking_kind: "timed_attempts",
        target_count: 10,
        unit_size: 5,
        frequency: "daily",
      },
      { frequency: "session", is_active: true },
    ),
    {
      name: "Therapy exercise logs",
      description:
        "Daily progress per exercise. Use POST /increment to add or subtract reps/attempts. Use POST /skip to mark an exercise as not for today (e.g. waiting on nurse help).",
      endpoints: [
        {
          method: "GET",
          path: "/api/data/therapy-exercise-logs",
          summary: "List logs (optional ?log_date=YYYY-MM-DD)",
          responses: [
            {
              status: 200,
              description: "Log rows",
              example: {
                success: true,
                data: [
                  {
                    id: "uuid",
                    exercise_id: "uuid",
                    log_date: "2026-01-15",
                    completed_count: 3,
                    skipped: false,
                    notes: null,
                    created_at: ts,
                    updated_at: ts,
                  },
                ],
              },
            },
          ],
        },
        {
          method: "POST",
          path: "/api/data/therapy-exercise-logs/increment",
          summary: "Upsert today's log and apply delta (+1 / -1)",
          requestBody: {
            contentType: "application/json",
            example: { exercise_id: "uuid", log_date: "2026-01-15", delta: 1 },
          },
          responses: [
            {
              status: 200,
              description: "Updated log",
              example: {
                success: true,
                data: {
                  id: "uuid",
                  exercise_id: "uuid",
                  log_date: "2026-01-15",
                  completed_count: 4,
                  skipped: false,
                  notes: null,
                  created_at: ts,
                  updated_at: ts,
                },
              },
            },
          ],
        },
        {
          method: "POST",
          path: "/api/data/therapy-exercise-logs/skip",
          summary: "Mark or unmark an exercise as skipped for a given date",
          requestBody: {
            contentType: "application/json",
            example: { exercise_id: "uuid", log_date: "2026-01-15", skipped: true },
          },
          responses: [
            {
              status: 200,
              description: "Updated log",
              example: {
                success: true,
                data: {
                  id: "uuid",
                  exercise_id: "uuid",
                  log_date: "2026-01-15",
                  completed_count: 0,
                  skipped: true,
                  notes: null,
                  created_at: ts,
                  updated_at: ts,
                },
              },
            },
          ],
        },
      ],
    },
    {
      name: "Speech therapy consumption",
      description:
        "Daily consumption counts by type. The only type today is ice_cube. Use POST /increment to add or subtract quantity for a date.",
      endpoints: [
        {
          method: "GET",
          path: "/api/data/speech-therapy-consumption",
          summary: "List consumption rows newest first",
          responses: [
            {
              status: 200,
              description: "Consumption rows",
              example: {
                success: true,
                data: [
                  {
                    id: "uuid",
                    consumption_type: "ice_cube",
                    log_date: "2026-01-15",
                    quantity: 3,
                    created_at: ts,
                    updated_at: ts,
                  },
                ],
              },
            },
          ],
        },
        {
          method: "POST",
          path: "/api/data/speech-therapy-consumption/increment",
          summary: "Upsert today's row and apply delta (+1 / -1)",
          requestBody: {
            contentType: "application/json",
            example: {
              consumption_type: "ice_cube",
              log_date: "2026-01-15",
              delta: 1,
            },
          },
          responses: [
            {
              status: 200,
              description: "Updated consumption row",
              example: {
                success: true,
                data: {
                  id: "uuid",
                  consumption_type: "ice_cube",
                  log_date: "2026-01-15",
                  quantity: 4,
                  created_at: ts,
                  updated_at: ts,
                },
              },
            },
          ],
        },
      ],
    },
    {
      name: "Therapy exercise imports",
      description:
        "Photo import for speech therapy homework. Preview uploads an image (JPEG/PNG/WebP); commit saves edited exercises.",
      endpoints: [
        {
          method: "POST",
          path: "/api/data/therapy-exercise-imports/preview",
          summary: "Extract exercises from homework photo via vision AI",
          responses: [
            {
              status: 200,
              description: "Preview created",
              example: {
                success: true,
                data: {
                  previewId: "uuid",
                  exchangeId: "uuid",
                  exercises: [
                    {
                      name: "Straw phonation",
                      instructions: "10 attempts at 5 seconds",
                      tracking_kind: "timed_attempts",
                      target_count: 10,
                      unit_size: 5,
                    },
                  ],
                },
              },
            },
          ],
        },
        {
          method: "POST",
          path: "/api/data/therapy-exercise-imports/commit",
          summary: "Commit previewed exercises after user review",
          requestBody: {
            contentType: "application/json",
            example: {
              previewId: "uuid",
              exercises: [
                {
                  name: "Straw phonation",
                  instructions: "10 attempts at 5 seconds",
                  tracking_kind: "timed_attempts",
                  target_count: 10,
                  unit_size: 5,
                },
              ],
            },
          },
          responses: [
            {
              status: 200,
              description: "Exercises created",
              example: { success: true, data: { exercises: [] } },
            },
          ],
        },
      ],
    },
    {
      name: "Therapy exercise import AI exchanges",
      description:
        "Completed vision-import audit rows with token usage for the AI Costs page.",
      endpoints: [
        {
          method: "GET",
          path: "/api/data/therapy-exercise-import-ai-exchanges",
          summary: "List completed therapy photo-import AI exchanges",
          responses: [
            {
              status: 200,
              description: "Completed exchanges",
              example: {
                success: true,
                data: [
                  {
                    id: "uuid",
                    request_id: "uuid",
                    response_id: "uuid",
                    import_id: "uuid",
                    input_tokens: 1200,
                    output_tokens: 400,
                    total_tokens: 1600,
                    model_used: "claude-haiku-4-5-20251001",
                    status: "completed",
                    created_at: ts,
                    updated_at: ts,
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      name: "LLM models",
      description: "Pricing catalog used to estimate AI Costs from exchange token counts.",
      endpoints: [
        {
          method: "GET",
          path: "/api/data/llm-models",
          summary: "List LLM pricing rows",
          responses: [
            {
              status: 200,
              description: "Model pricing",
              example: {
                success: true,
                data: [
                  {
                    id: "uuid",
                    provider: "anthropic",
                    model: "claude-haiku-4-5-20251001",
                    input_cost_per_million_usd: "3.000000",
                    output_cost_per_million_usd: "15.000000",
                    created_at: ts,
                    updated_at: ts,
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      name: "Health imports",
      description:
        "C-CDA Health Summary import. Preview uploads a zip/XML (multipart field `file`); commit applies the server-stored draft by previewId. PDF bytes are ignored in v1.",
      endpoints: [
        {
          method: "POST",
          path: "/api/data/health-imports/preview",
          summary: "Parse C-CDA package and return summary + previewId",
          responses: [
            {
              status: 200,
              description: "Preview created",
              example: {
                success: true,
                data: {
                  previewId: "uuid",
                  contentSha256: "hex",
                  filename: "HealthSummary.zip",
                  documentCount: 8,
                  summary: { counts: { allergies: 3 }, samples: {} },
                },
              },
            },
          ],
        },
        {
          method: "POST",
          path: "/api/data/health-imports/commit",
          summary: "Commit a previewed import by previewId",
          requestBody: {
            contentType: "application/json",
            example: { previewId: "uuid" },
          },
          responses: [
            {
              status: 200,
              description: "Import committed",
              example: {
                success: true,
                data: { import: { id: "uuid", status: "committed" }, counts: { allergies: 3 } },
              },
            },
          ],
        },
        {
          method: "GET",
          path: "/api/data/health-imports",
          summary: "List import history",
          responses: [
            {
              status: 200,
              description: "Import rows",
              example: { success: true, data: [] },
            },
          ],
        },
      ],
    },
  ];

  return {
    version: "1.1.0",
    baseUrl,
    responseEnvelope: '{ "success": true, "data": T } | { "success": false, "error": string }',
    groups,
  };
};
