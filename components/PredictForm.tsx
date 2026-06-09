"use client";

import { useState } from "react";
import { predictCBR, PredictInput, PredictResponse } from "@/lib/api";
import ResultCard from "./ResultCard";

const fields: { key: keyof PredictInput; label: string; desc: string; min: number; max: number }[] = [
  { key: "studytime", label: "Study Time",   desc: "1 = <2 hrs, 4 = >10 hrs",          min: 1, max: 4  },
  { key: "absences",  label: "Absences",     desc: "Jumlah hari absen (0–75)",           min: 0, max: 75 },
  { key: "failures",  label: "Failures",     desc: "Jumlah kegagalan kelas (0–3)",       min: 0, max: 3  },
  { key: "famrel",    label: "Family Rel.",  desc: "Kualitas hubungan keluarga (1–5)",   min: 1, max: 5  },
  { key: "freetime",  label: "Free Time",    desc: "Waktu luang setelah sekolah (1–5)", min: 1, max: 5  },
  { key: "goout",     label: "Go Out",       desc: "Frekuensi keluar bersama teman (1–5)", min: 1, max: 5 },
];

export default function PredictForm() {
  const [form, setForm] = useState<PredictInput>({
    studytime: 2, absences: 0, failures: 0, famrel: 3, freetime: 3, goout: 3,
  });
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: keyof PredictInput, value: string) => {
    setForm((prev) => ({ ...prev, [key]: Number(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await predictCBR(form);
      setResult(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="flex h-[calc(100vh-57px)]">

      {/* LEFT PANEL */}
      <div className="w-1/2 flex flex-col justify-center px-20 py-12 overflow-y-auto">
        <p className="text-xs tracking-widest text-tangerine uppercase mb-3">Sistem Prediksi</p>
        <h1 className="text-6xl font-black text-hole leading-none mb-4">
          <br />ALCOHOL RISK<br />PREDICTION
        </h1>
        <p className="text-hole/50 text-sm leading-relaxed mb-10 max-w-sm">
          Masukkan data kebiasaan siswa untuk mendeteksi tingkat risiko konsumsi alkohol menggunakan metode CBR dan RST.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3 w-full max-w-md">
          {fields.map(({ key, label, desc, min, max }) => (
            <div key={key} className="flex items-center gap-6 bg-cotton rounded-xl px-5 py-3">
              <div className="flex-1">
                <p className="text-xs font-black text-hole uppercase tracking-widest">{label}</p>
                <p className="text-[10px] text-hole/40 mt-0.5">{desc}</p>
              </div>
              <input
                type="number"
                min={min}
                max={max}
                value={form[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-16 bg-linen rounded-lg px-3 py-2 text-hole text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-tangerine"
              />
            </div>
          ))}

          <div className="flex gap-3 pt-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-hole text-linen text-sm font-black tracking-widest uppercase py-4 rounded-xl hover:bg-tangerine transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Calculate"}
            </button>
            {result && (
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-4 border-2 border-hole/20 text-hole/50 text-sm font-bold rounded-xl hover:border-hole hover:text-hole transition-all"
              >
                Clear
              </button>
            )}
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}
        </form>
      </div>

      {/* RIGHT PANEL */}
      <div
        className={`w-1/2 flex flex-col justify-center px-20 py-12 transition-colors duration-500 overflow-y-auto
          ${result ? "bg-hole" : "bg-tangerine"}`}
      >
        {!result ? (
          <div>
            <p className="text-linen/30 text-xs tracking-widest uppercase mb-8">Awaiting Input</p>
            <div className="space-y-5">
              {["Normal", "Waspada", "Bahaya"].map((label) => (
                <div key={label}>
                  <div className="flex justify-between mb-2">
                    <span className="text-linen/40 text-sm font-bold">{label}</span>
                    <span className="text-linen/20 text-xs">—</span>
                  </div>
                  <div className="w-full bg-linen/10 rounded-full h-1.5" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <ResultCard data={result.data} />
        )}
      </div>

    </div>
  );
}