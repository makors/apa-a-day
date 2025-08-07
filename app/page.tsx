import DailyChallenge from "@/components/challenge/DailyChallenge";
import ProgressSidebar from "@/components/ProgressSidebar";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      <div>
        <DailyChallenge />
      </div>
      <div>
        <ProgressSidebar />
      </div>
    </div>
  );
}
