import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { carService } from '../services/carService';
import CarForm from '../components/cars/CarForm';

export default function EditCarPage() {
    const { id } = useParams<{ id: string }>();

    const { data: car, isLoading, error } = useQuery({
        queryKey: ['car', id],
        queryFn: () => carService.getCar(id!),
        enabled: !!id
    });

    if (isLoading) return <div>Loading car...</div>;
    if (error) return <div>Error loading car</div>;
    if (!car) return <div>Car not found</div>;

    return <CarForm initialData={car} isEdit={true} />;
}
