import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { opportunityService } from '../services/opportunityService';
import OpportunityForm from '../components/opportunities/OpportunityForm';

export default function EditOpportunityPage() {
    const { id } = useParams<{ id: string }>();

    const { data: opportunity, isLoading, error } = useQuery({
        queryKey: ['opportunity', id],
        queryFn: () => opportunityService.getOpportunity(id!),
        enabled: !!id
    });

    if (isLoading) return <div>Loading opportunity...</div>;
    if (error) return <div>Error loading opportunity</div>;
    if (!opportunity) return <div>Opportunity not found</div>;

    return <OpportunityForm initialData={opportunity} isEdit={true} />;
}
