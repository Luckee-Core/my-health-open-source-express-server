export const SPEECH_THERAPY_CONSUMPTION_TYPES = ['ice_cube'] as const;

export type SpeechTherapyConsumptionType =
  (typeof SPEECH_THERAPY_CONSUMPTION_TYPES)[number];

export type SpeechTherapyConsumption = {
  id: string;
  consumption_type: SpeechTherapyConsumptionType;
  log_date: string;
  quantity: number;
  created_at: string;
  updated_at: string;
};

export type IncrementSpeechTherapyConsumptionInput = {
  consumption_type: SpeechTherapyConsumptionType;
  log_date: string;
  delta: number;
};
