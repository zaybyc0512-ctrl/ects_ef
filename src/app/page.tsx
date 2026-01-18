import { Suspense } from 'react';
import Comparator from '../components/Comparator';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 py-8">
      <div className="container mx-auto px-4">
        <Suspense fallback={<div className="text-center text-slate-400 py-20">Loading Simulator...</div>}>
          <Comparator />
        </Suspense>
      </div>
    </main>
  );
}
