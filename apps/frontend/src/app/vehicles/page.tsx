import { getPublishedVehicles } from '../../lib/data/vehicles';
import CarCard from '../../components/CarCard';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Inventory | Nextcar',
    description: 'Browse our premium curated fleet of used cars ready for leasing or credit from 2.9%.',
    openGraph: {
        title: 'Inventory | Nextcar',
        description: 'Browse our premium curated fleet of used cars ready for leasing or credit from 2.9%.',
        type: 'website',
    },
    twitter: {
        card: 'summary',
        title: 'Inventory | Nextcar',
        description: 'Browse our premium curated fleet of used cars ready for leasing or credit from 2.9%.',
    }
};

export default async function VehiclesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const query = await searchParams;
    const q = typeof query.q === 'string' ? query.q.toLowerCase() : '';
    const parsedLimit = typeof query.limit === 'string' ? parseInt(query.limit, 10) : 20;
    const currentLimit = isNaN(parsedLimit) || parsedLimit < 1 ? 20 : parsedLimit;

    // We fetch currentLimit + 1 to know if there are more inventory items
    const fetchLimit = currentLimit + 1;
    const allCarsFetched = await getPublishedVehicles(fetchLimit);

    const hasMore = allCarsFetched.length > currentLimit;
    const cars = hasMore ? allCarsFetched.slice(0, currentLimit) : allCarsFetched;

    const filteredCars = cars.filter((car) => {
        if (!q) return true;
        const title = `${car.make} ${car.model}`.toLowerCase();
        const desc = (car.description || '').toLowerCase();
        return title.includes(q) || desc.includes(q);
    });

    return (
        <>
            <main className="max-w-4xl mx-auto p-6 lg:p-12 flex-grow w-full">
                <div className="space-y-32">
                    {filteredCars.length === 0 ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-slate-400 text-lg">
                                {q ? 'No cars match your search.' : 'No cars in inventory yet.'}
                            </div>
                        </div>
                    ) : (
                        filteredCars.map((car, i) => (
                            <CarCard key={car.id} car={car} priority={i < 4} />
                        ))
                    )}
                </div>

                {hasMore && (
                    <div className="mt-16 text-center">
                        <Link
                            href={`/vehicles?limit=${currentLimit + 20}${q ? `&q=${q}` : ''}`}
                            className="inline-block bg-primary text-white dark:bg-white dark:text-primary px-8 py-4 rounded-full font-bold hover:-translate-y-1 transition-transform active:scale-95 shadow-xl shadow-primary/20"
                            scroll={false}
                        >
                            Load More
                        </Link>
                    </div>
                )}
            </main>
        </>
    );
}
