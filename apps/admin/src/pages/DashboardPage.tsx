import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { carService } from '../services/carService';
import { opportunityService } from '../services/opportunityService';
import { customerService } from '../services/customerService';
import type { Car, Opportunity, Customer } from '@nextcar/shared';

interface DashboardData {
    cars: Car[];
    opportunities: Opportunity[];
    customers: Customer[];
}

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchAll() {
            try {
                const [cars, opportunities, customers] = await Promise.all([
                    carService.getCars(),
                    opportunityService.getOpportunities(),
                    customerService.getCustomers(),
                ]);
                setData({ cars, opportunities, customers });
            } catch (err: any) {
                setError(err.message || 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        }
        fetchAll();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-gray-500 text-lg">Loading dashboard…</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                {error}
            </div>
        );
    }

    if (!data) return null;

    const { cars, opportunities, customers } = data;

    // --- Vehicle counts by status ---
    const vehicleStatuses = ['draft', 'published', 'sold', 'archived'] as const;
    const vehicleCounts = Object.fromEntries(
        vehicleStatuses.map(s => [s, cars.filter(c => c.status === s).length])
    ) as Record<string, number>;

    // --- Opportunity counts by stage ---
    const stages = ['new', 'contacted', 'negotiation', 'won', 'lost'] as const;
    const stageCounts = Object.fromEntries(
        stages.map(s => [s, opportunities.filter(o => o.stage === s).length])
    ) as Record<string, number>;

    // --- Pipeline value (non-won/lost) ---
    const pipelineOpps = opportunities.filter(o => o.stage !== 'won' && o.stage !== 'lost');
    const pipelineValue = pipelineOpps.reduce((sum, o) => sum + (o.expectedValue || 0), 0);

    // --- Recent opportunities (last 10) ---
    const recentOpps = [...opportunities]
        .sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
        })
        .slice(0, 10);

    const stageColors: Record<string, string> = {
        new: 'bg-blue-100 text-blue-800',
        contacted: 'bg-yellow-100 text-yellow-800',
        negotiation: 'bg-purple-100 text-purple-800',
        won: 'bg-green-100 text-green-800',
        lost: 'bg-red-100 text-red-800',
    };

    const statusColors: Record<string, string> = {
        draft: 'bg-gray-100 text-gray-800',
        published: 'bg-green-100 text-green-800',
        sold: 'bg-blue-100 text-blue-800',
        archived: 'bg-yellow-100 text-yellow-800',
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard label="Total Vehicles" value={cars.length} icon="🚗" />
                <StatCard label="Total Customers" value={customers.length} icon="👤" />
                <StatCard
                    label="Pipeline Value"
                    value={`$${pipelineValue.toLocaleString()}`}
                    icon="💰"
                    subtitle={`${pipelineOpps.length} active opportunities`}
                />
            </div>

            {/* Vehicle Counts by Status */}
            <section>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold text-gray-800">Inventory by Status</h2>
                    <Link to="/cars" className="text-sm text-blue-600 hover:underline">View All →</Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {vehicleStatuses.map(status => (
                        <div key={status} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[status]}`}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                            <div className="text-3xl font-bold mt-2">{vehicleCounts[status]}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Opportunity Counts by Stage */}
            <section>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold text-gray-800">Pipeline by Stage</h2>
                    <Link to="/opportunities" className="text-sm text-blue-600 hover:underline">View All →</Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {stages.map(stage => (
                        <div key={stage} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stageColors[stage]}`}>
                                {stage.charAt(0).toUpperCase() + stage.slice(1)}
                            </span>
                            <div className="text-3xl font-bold mt-2">{stageCounts[stage]}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Recent Opportunities Table */}
            <section>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold text-gray-800">Recent Opportunities</h2>
                    <Link to="/opportunities" className="text-sm text-blue-600 hover:underline">View All →</Link>
                </div>
                {recentOpps.length === 0 ? (
                    <div className="text-gray-400 py-8 text-center bg-white border border-gray-200 rounded-lg">
                        No opportunities yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {recentOpps.map(opp => (
                                    <tr key={opp.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                            {opp.customerName || '—'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {opp.vehicleName || '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stageColors[opp.stage] || ''}`}>
                                                {opp.stage.charAt(0).toUpperCase() + opp.stage.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {opp.expectedValue ? `$${opp.expectedValue.toLocaleString()}` : '—'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {opp.createdAt ? new Date(opp.createdAt).toLocaleDateString() : '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

function StatCard({ label, value, icon, subtitle }: { label: string; value: string | number; icon: string; subtitle?: string }) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <div className="flex items-center gap-3">
                <span className="text-2xl">{icon}</span>
                <div>
                    <div className="text-sm text-gray-500 font-medium">{label}</div>
                    <div className="text-2xl font-bold text-gray-900">{value}</div>
                    {subtitle && <div className="text-xs text-gray-400 mt-0.5">{subtitle}</div>}
                </div>
            </div>
        </div>
    );
}
