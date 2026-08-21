import SceneExplorer from '@/components/SceneExplorer';
import UpgradeDashboard from '@/components/UpgradeDashboard';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SceneExplorer />
      <UpgradeDashboard />
    </main>
  );
}
