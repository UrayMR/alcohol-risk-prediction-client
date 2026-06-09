interface CBRScores {
  Normal: number;
  Waspada: number;
  Bahaya: number;
}

interface Props {
  data: {
    cbr_scores: CBRScores;
    rst_scores?: CBRScores;
    final_score?: CBRScores;
    prediction?: string;
  };
}

const labelColor: Record<string, string> = {
  Normal:  "text-green-400",
  Waspada: "text-yellow-400",
  Bahaya:  "text-red-400",
};

function ScoreRow({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex items-center gap-4">
      <span className={`text-sm font-semibold w-20 ${labelColor[label]}`}>{label}</span>
      <div className="flex-1 bg-linen/10 rounded-full h-2">
        <div
          className="h-2 rounded-full bg-tangerine transition-all duration-700"
          style={{ width: `${(score * 100).toFixed(1)}%` }}
        />
      </div>
      <span className="text-linen/60 text-xs w-12 text-right">
        {(score * 100).toFixed(1)}%
      </span>
    </div>
  );
}

function Section({ title, scores, dim }: { title: string; scores: CBRScores; dim?: boolean }) {
  const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  return (
    <div className={`space-y-3 ${dim ? "opacity-40 select-none pointer-events-none" : ""}`}>
      <div className="flex items-center justify-between">
        <p className="text-[10px] tracking-widest uppercase text-linen/40">{title}</p>
        {!dim && (
          <span className={`text-xs font-bold ${labelColor[top]}`}>{top}</span>
        )}
      </div>
      {Object.entries(scores).map(([label, score]) => (
        <ScoreRow key={label} label={label} score={score} />
      ))}
    </div>
  );
}

const placeholderScores: CBRScores = { Normal: 0, Waspada: 0, Bahaya: 0 };

export default function ResultCard({ data }: Props) {
  const topCBR = Object.entries(data.cbr_scores).sort((a, b) => b[1] - a[1])[0][0];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-linen/40 text-xs tracking-widest uppercase mb-1">Hasil Prediksi</p>
        <h2 className="text-4xl font-black text-linen">{topCBR}</h2>
        <p className="text-linen/30 text-xs mt-1">berdasarkan CBR Score tertinggi</p>
      </div>

      <Section title="CBR Score" scores={data.cbr_scores} />

      <div className="border-t border-linen/10 pt-6">
        <Section title="RST Score" scores={data.rst_scores ?? placeholderScores} dim={!data.rst_scores} />
      </div>

      <div className="border-t border-linen/10 pt-6">
        <Section title="Final Score" scores={data.final_score ?? placeholderScores} dim={!data.final_score} />
      </div>

      {!data.rst_scores && (
        <p className="text-linen/20 text-[10px] tracking-wide">
          * RST & Final Score menunggu integrasi endpoint /predict
        </p>
      )}
    </div>
  );
}