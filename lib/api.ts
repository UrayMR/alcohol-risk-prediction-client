const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface PredictInput {
  studytime: number;
  absences: number;
  failures: number;
  famrel: number;
  freetime: number;
  goout: number;
}

export interface CBRScores {
  Normal: number;
  Waspada: number;
  Bahaya: number;
}

export interface PredictResponse {
  code: number;
  message: string;
  data: {
    cbr_scores: CBRScores;
  };
}

export async function predictCBR(input: PredictInput): Promise<PredictResponse> {
  const res = await fetch(`${BASE_URL}/cbr/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Gagal menghubungi server");
  return res.json();
}