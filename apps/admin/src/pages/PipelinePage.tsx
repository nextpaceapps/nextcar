import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DndContext, DragOverlay, useDroppable, useDraggable, type DragEndEvent, type DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { opportunityService } from '../services/opportunityService';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import type { Opportunity, OpportunityStage } from '@nextcar/shared';
import { OPPORTUNITY_STAGES } from '@nextcar/shared';

const STAGE_COLORS: Record<string, { bg: string; border: string; header: string }> = {
    new: { bg: 'bg-blue-50', border: 'border-blue-200', header: 'bg-blue-600' },
    contacted: { bg: 'bg-yellow-50', border: 'border-yellow-200', header: 'bg-yellow-500' },
    negotiation: { bg: 'bg-purple-50', border: 'border-purple-200', header: 'bg-purple-600' },
    won: { bg: 'bg-green-50', border: 'border-green-200', header: 'bg-green-600' },
    lost: { bg: 'bg-red-50', border: 'border-red-200', header: 'bg-red-500' },
};

export default function PipelinePage() {
    const { role } = useAuth();
    const canWrite = role === 'Admin' || role === 'Editor';
    const queryClient = useQueryClient();
    const [activeOpp, setActiveOpp] = useState<Opportunity | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );

    const { data: opportunities = [], isLoading, error } = useQuery({
        queryKey: ['opportunities'],
        queryFn: opportunityService.getOpportunities,
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, stage }: { id: string; stage: OpportunityStage }) =>
            opportunityService.updateOpportunity(id, { stage }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['opportunities'] }),
    });

    const handleDragStart = (event: DragStartEvent) => {
        const opp = opportunities.find(o => o.id === event.active.id);
        setActiveOpp(opp || null);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveOpp(null);
        const { active, over } = event;
        if (!over) return;

        const oppId = active.id as string;
        const newStage = over.id as string;
        const opp = opportunities.find(o => o.id === oppId);

        if (opp && opp.stage !== newStage && (OPPORTUNITY_STAGES as readonly string[]).includes(newStage)) {
            updateMutation.mutate({ id: oppId, stage: newStage as OpportunityStage });
        }
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading pipeline…</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error loading pipeline</div>;

    const oppsByStage = Object.fromEntries(
        OPPORTUNITY_STAGES.map(s => [s, opportunities.filter(o => o.stage === s)])
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Pipeline</h1>
                {canWrite && (
                    <Link
                        to="/opportunities/new"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium shadow-sm transition-colors"
                    >
                        + Add Opportunity
                    </Link>
                )}
            </div>

            {canWrite ? (
                <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: '70vh' }}>
                        {OPPORTUNITY_STAGES.map(stage => (
                            <StageColumn key={stage} stage={stage} opportunities={oppsByStage[stage]} canWrite={canWrite} />
                        ))}
                    </div>

                    <DragOverlay>
                        {activeOpp ? <OpportunityCardContent opportunity={activeOpp} isDragging canWrite={canWrite} /> : null}
                    </DragOverlay>
                </DndContext>
            ) : (
                <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: '70vh' }}>
                    {OPPORTUNITY_STAGES.map(stage => (
                        <StageColumn key={stage} stage={stage} opportunities={oppsByStage[stage]} canWrite={canWrite} />
                    ))}
                </div>
            )}
        </div>
    );
}

function StageColumn({ stage, opportunities, canWrite }: { stage: string; opportunities: Opportunity[]; canWrite: boolean }) {
    const { setNodeRef, isOver } = useDroppable({ id: stage, disabled: !canWrite });
    const colors = STAGE_COLORS[stage] || STAGE_COLORS.new;

    return (
        <div
            ref={setNodeRef}
            className={`flex-shrink-0 w-64 rounded-lg border ${colors.border} ${isOver ? 'ring-2 ring-blue-400' : ''} flex flex-col`}
        >
            <div className={`${colors.header} text-white px-3 py-2 rounded-t-lg font-semibold text-sm flex justify-between items-center`}>
                <span>{stage.charAt(0).toUpperCase() + stage.slice(1)}</span>
                <span className="bg-white/20 rounded-full px-2 py-0.5 text-xs">{opportunities.length}</span>
            </div>
            <div className={`${colors.bg} flex-1 p-2 space-y-2 rounded-b-lg min-h-[100px]`}>
                {opportunities.map(opp => (
                    <DraggableCard key={opp.id} opportunity={opp} canWrite={canWrite} />
                ))}
            </div>
        </div>
    );
}

function DraggableCard({ opportunity, canWrite }: { opportunity: Opportunity; canWrite: boolean }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: opportunity.id!,
        disabled: !canWrite,
    });

    const style = transform
        ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
        : undefined;

    return (
        <div ref={setNodeRef} style={style} {...(canWrite ? listeners : {})} {...(canWrite ? attributes : {})}>
            <OpportunityCardContent opportunity={opportunity} isDragging={isDragging} canWrite={canWrite} />
        </div>
    );
}

function OpportunityCardContent({ opportunity, isDragging, canWrite }: { opportunity: Opportunity; isDragging?: boolean; canWrite: boolean }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isOverdue = opportunity.nextActionDate
        ? new Date(opportunity.nextActionDate) < today
        : false;

    return (
        <div
            className={`bg-white rounded-lg p-3 shadow-sm border text-sm transition-shadow
                ${canWrite ? 'cursor-grab active:cursor-grabbing' : ''}
                ${isDragging ? 'opacity-50 shadow-lg' : 'hover:shadow-md'}
                ${isOverdue ? 'border-red-400 ring-1 ring-red-200' : 'border-gray-200'}
            `}
        >
            <div className="font-medium text-gray-900 truncate">
                {opportunity.customerName || 'Unknown'}
            </div>
            {opportunity.vehicleName && (
                <div className="text-gray-500 text-xs truncate mt-0.5">
                    🚗 {opportunity.vehicleName}
                </div>
            )}
            <div className="flex justify-between items-center mt-2">
                {opportunity.expectedValue ? (
                    <span className="text-green-700 font-semibold text-xs">
                        ${opportunity.expectedValue.toLocaleString()}
                    </span>
                ) : (
                    <span className="text-gray-400 text-xs">No value</span>
                )}
                <Link
                    to={`/opportunities/${opportunity.id}/edit`}
                    className="text-blue-600 hover:text-blue-800 text-xs"
                    onClick={(e) => e.stopPropagation()}
                >
                    {canWrite ? 'Edit' : 'View'}
                </Link>
            </div>
            {opportunity.nextActionDate && (
                <div className={`text-xs mt-1.5 flex items-center gap-1 ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-400'}`}>
                    📅 {opportunity.nextActionDate}
                    {isOverdue && <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-[10px] font-bold">OVERDUE</span>}
                </div>
            )}
        </div>
    );
}
