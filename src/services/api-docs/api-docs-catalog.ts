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

const buildOverviewGroup = (): ApiDocsGroup => ({
  name: "Overview",
  description: [
    "REST API for the open-source My Health app. Supabase stores hospitals, specialties, doctors, appointments, focus areas, and daily journal entries; this Express server exposes CRUD over HTTP for the Next.js dashboard or any client.",
    "Route layout: `/api/data/*` — REST entity CRUD (`GET/POST /`, `PATCH/DELETE /:id`); `GET /api-docs.json` — this catalog. There is no `GET /:id` single-entity fetch — list all rows and filter client-side, or use PATCH/DELETE with a known id.",
    "Typical flow: create hospitals and specialties → add doctors (linked to hospital + specialty) → schedule appointments → define focus areas → log daily entries against a focus area and date.",
    "Success JSON: `{ success: true, data }`. Error JSON: `{ success: false, error: string }`. DELETE returns `{ success: true, data: null }`. OSS default has no authentication — bind to localhost for trusted local dev. Requires `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` on Express.",
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
  ];

  return {
    version: "1.0.0",
    baseUrl,
    responseEnvelope: '{ "success": true, "data": T } | { "success": false, "error": string }',
    groups,
  };
};
