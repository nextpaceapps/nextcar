import { getFeaturedVehicles, getPublishedVehicles } from '../lib/data/vehicles';
import VehicleCard from '../components/VehicleCard';
import Link from 'next/link';

export const revalidate = 60;

export default async function HomePage() {
  const [featured, latest] = await Promise.all([
    getFeaturedVehicles(6),
    getPublishedVehicles(7),
  ]);

  const latestNonFeatured = latest
    .filter(v => !v.featured)
    .slice(0, 4);

  const hasFeatured = featured.length > 0;
  const hasLatest = latestNonFeatured.length > 0;

  return (
    <main className="max-w-4xl mx-auto p-6 lg:p-12 flex-grow w-full">
      {/* Hero */}
      <section className="mb-16">
        <h1 className="text-4xl lg:text-5xl font-display font-bold leading-tight uppercase tracking-tighter dark:text-white">
          Premium Curated Fleet
        </h1>
        <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
          Hand-picked vehicles ready for leasing or credit from 2.9%.
          Browse our selection or search for the perfect match.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/vehicles"
            className="inline-flex items-center gap-2 bg-primary dark:bg-white dark:text-primary text-white px-8 py-4 rounded-full font-bold hover:-translate-y-1 transition-transform active:scale-95 shadow-xl shadow-primary/20 dark:shadow-white/10"
          >
            View All Inventory
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* Featured Vehicles */}
      {hasFeatured && (
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Featured Vehicles
            </h2>
          </div>
          <div className="space-y-32">
            {featured.map((vehicle, i) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} priority={i < 2} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Arrivals */}
      {hasLatest && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Latest Arrivals
            </h2>
            <Link
              href="/vehicles"
              className="text-xs font-bold uppercase tracking-[0.15em] text-primary dark:text-white hover:opacity-70 transition-opacity flex items-center gap-1"
            >
              See all
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="space-y-32">
            {latestNonFeatured.map((vehicle, i) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} priority={i < 2} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {!hasFeatured && !hasLatest && (
        <div className="flex items-center justify-center py-20">
          <div className="text-slate-400 text-lg">
            No vehicles in inventory yet. Check back soon.
          </div>
        </div>
      )}
    </main>
  );
}
