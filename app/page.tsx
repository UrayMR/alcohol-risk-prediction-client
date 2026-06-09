import PredictForm from "@/components/PredictForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-linen">
      <nav className="px-20 py-5 flex items-center justify-between border-b border-hole/10">
        <span className="font-black tracking-widest text-sm text-hole">ALCOHOL RISK</span>
      </nav>
      <PredictForm />
    </main>
  );
}