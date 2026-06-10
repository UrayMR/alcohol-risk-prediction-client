const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface PredictInput {
  studytime: number;
  absences: number;
  failures: number;
  famrel: number;
  freetime: number;
  goout: number;
}

export interface Scores {
  Normal: number;
  Waspada: number;
  Bahaya: number;
}

export interface RSTConfidence {
  status: string;
  region: string;
  probabilities: Scores;
  discretized_input: Record<string, string>;
}

export interface DetailScores {
  final_scores: Scores;
  rst_confidence: RSTConfidence;
  cbr_similarity: Scores;
}

// Kontrak data utama yang dikirim dari objek "data" di backend
export interface ResponseData {
  prediction: string;
  confidence_percentage: number;
  detail_scores: DetailScores;
}

// Pembungkus respons global API FastAPI kelompokmu
export interface PredictResponse {
  success: boolean;
  message: string;
  data: ResponseData;
}

// Interface khusus untuk parameter input fase Retain
export interface RetainInput extends PredictInput {
  final_decision: string;
}

export interface RetainResponse {
  code: number;
  data: Record<string, unknown>;
  message: string;
}

/**
 * Meminta hasil prediksi klasifikasi tingkat risiko konsumsi alkohol
 * menggunakan metode integrasi hybrid CBR + RST.
 */
export async function predictCBR(
  input: PredictInput,
): Promise<PredictResponse> {
  // Menyesuaikan routing path agar mengarah langsung ke /api/predict atau /predict sesuai route prefix backend
  const res = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok)
    throw new Error("Gagal menghubungi server untuk melakukan prediksi");
  return res.json();
}

/**
 * Menyimpan kasus baru siswa yang sudah dikonfirmasi/direvisi oleh pakar
 * ke dalam basis kasus (dataset_cbr.csv).
 */
export async function retainCBR(input: RetainInput): Promise<RetainResponse> {
  const res = await fetch(`${BASE_URL}/retain`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok)
    throw new Error("Gagal menghubungi server untuk menyimpan kasus baru");
  return res.json();
}
