import { getPublishedVehicles } from '../../lib/data/vehicles';
import CarCard from '../../components/CarCard';

export default async function VehiclesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const query = await searchParams;
    const q = typeof query.q === 'string' ? query.q.toLowerCase() : '';
    const cars = await getPublishedVehicles();

    const filteredCars = cars.filter((car) => {
        if (!q) return true;
        const title = `${car.make} ${car.model}`.toLowerCase();
        const desc = (car.description || '').toLowerCase();
        return title.includes(q) || desc.includes(q);
    });

    return (
        <>
            <main className="max-w-4xl mx-auto p-6 lg:p-12 space-y-32 flex-grow w-full">
                {filteredCars.length === 0 ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-slate-400 text-lg">
                            {q ? 'No cars match your search.' : 'No cars in inventory yet.'}
                        </div>
                    </div>
                ) : (
                    filteredCars.map(car => (
                        <CarCard key={car.id} car={car} />
                    ))
                )}
            </main>
        </>
    );
}
