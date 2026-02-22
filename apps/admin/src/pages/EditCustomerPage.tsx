import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { customerService } from '../services/customerService';
import CustomerForm from '../components/customers/CustomerForm';

export default function EditCustomerPage() {
    const { id } = useParams<{ id: string }>();

    const { data: customer, isLoading, error } = useQuery({
        queryKey: ['customer', id],
        queryFn: () => customerService.getCustomer(id!),
        enabled: !!id
    });

    if (isLoading) return <div>Loading customer...</div>;
    if (error) return <div>Error loading customer</div>;
    if (!customer) return <div>Customer not found</div>;

    return <CustomerForm initialData={customer} isEdit={true} />;
}
