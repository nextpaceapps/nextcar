import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { vehicleService } from '../services/vehicleService';
import VehicleForm from '../components/vehicles/VehicleForm';

export default function EditVehiclePage() {
    const { id } = useParams<{ id: string }>();

    const { data: vehicle, isLoading, error } = useQuery({
        queryKey: ['vehicle', id],
        queryFn: () => vehicleService.getVehicle(id!),
        enabled: !!id
    });

    if (isLoading) return <div>Loading vehicle...</div>;
    if (error) return <div>Error loading vehicle</div>;
    if (!vehicle) return <div>Vehicle not found</div>;

    return <VehicleForm initialData={vehicle} isEdit={true} />;
}
