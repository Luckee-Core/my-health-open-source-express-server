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
