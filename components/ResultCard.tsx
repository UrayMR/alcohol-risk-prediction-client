interface Scores {
  Normal: number;
  Waspada: number;
  Bahaya: number;
}

interface RSTConfidence {
  region: string;
  probabilities: Scores;
  discretized_input: Record<string, string>;
}

interface DetailScores {
  final_scores: Scores;
  rst_confidence: RSTConfidence;
  cbr_similarity: Scores;
}

interface ResponseData {
  prediction: string;
  confidence_percentage: number;
  detail_scores: DetailScores;
}

interface Props {
  data: ResponseData;
}

const labelColor: Record<string, string> = {
  Normal: "text-green-400",
  Waspada: "text-yellow-400",
  Bahaya: "text-red-400",
};

function ScoreRow({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex items-center gap-4">
      <span className={`text-sm font-semibold w-20 ${labelColor[label]}`}>
        {label}
      </span>
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

function Section({
  title,
  scores,
  dim,
}: {
  title: string;
  scores: Scores;
  dim?: boolean;
}) {
  const entries = Object.entries(scores || {});
  const top = entries.sort((a, b) => b[1] - a[1])[0][0];

  return (
    <div
      className={`space-y-3 ${dim ? "opacity-40 select-none pointer-events-none" : ""}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] tracking-widest uppercase text-linen/40">
          {title}
        </p>
        {!dim && entries.length > 0 && (
          <span className={`text-xs font-bold ${labelColor[top]}`}>{top}</span>
        )}
      </div>

      {entries.map(([label, score]) => (
        <ScoreRow key={label} label={label} score={score} />
      ))}
    </div>
  );
}

export default function ResultCard({ data }: Props) {
  const { prediction, confidence_percentage, detail_scores } = data;
  const cbrScores = detail_scores.cbr_similarity;
  const rstScores = detail_scores.rst_confidence.probabilities;
  const finalScores = detail_scores.final_scores;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-linen/40 text-xs tracking-widest uppercase mb-1">
          Hasil Prediksi
        </p>
        <h2
          className={`text-4xl font-black ${labelColor[prediction] || "text-linen"}`}
        >
          {prediction}
        </h2>
        <p className="text-linen/30 text-xs mt-1">
          Tingkat keyakinan: {confidence_percentage}%
        </p>
      </div>

      <div className="border-t border-linen/10 pt-6">
        <Section title="CBR Similarity" scores={cbrScores} />
      </div>

      <div className="border-t border-linen/10 pt-6">
        <Section
          title="RST Confidence (Probabilities)"
          scores={rstScores}
          dim={!rstScores}
        />
      </div>

      <div className="border-t border-linen/10 pt-6">
        <Section title="Final Score" scores={finalScores} dim={!finalScores} />
      </div>
    </div>
  );
}
