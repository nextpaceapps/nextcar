import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';

const ROLES = ['Admin', 'Editor', 'Viewer'] as const;

export default function UsersPage() {
    const queryClient = useQueryClient();

    const { data: users = [], isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: userService.getUsers,
    });

    const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const updateRoleMutation = useMutation({
        mutationFn: ({ uid, role }: { uid: string; role: 'Admin' | 'Editor' | 'Viewer' }) =>
            userService.updateUserRole(uid, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setUpdateMessage({ type: 'success', text: 'Role updated successfully' });
            setTimeout(() => setUpdateMessage(null), 3000);
        },
        onError: (err: any) => {
            const msg = err.response?.data?.error?.message || err.message || 'Failed to update role';
            setUpdateMessage({ type: 'error', text: msg });
            setTimeout(() => setUpdateMessage(null), 5000);
        }
    });

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading users…</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error loading users</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                {updateMessage && (
                    <div className={`px-4 py-2 rounded-md text-sm font-medium border animate-in fade-in slide-in-from-top-2 duration-300 ${updateMessage.type === 'success'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                        {updateMessage.type === 'success' ? '✅' : '❌'} {updateMessage.text}
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.uid} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                        {user.uid}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={user.role}
                                            onChange={(e) =>
                                                updateRoleMutation.mutate({
                                                    uid: user.uid,
                                                    role: e.target.value as 'Admin' | 'Editor' | 'Viewer',
                                                })
                                            }
                                            disabled={updateRoleMutation.isPending}
                                            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {ROLES.map(r => (
                                                <option key={r} value={r}>{r}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <strong>Note:</strong> To add a new user, create them in the{' '}
                <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline font-medium">
                    Firebase Console
                </a>{' '}
                (Authentication → Add User), then set their role here.
            </div>
        </div>
    );
}
