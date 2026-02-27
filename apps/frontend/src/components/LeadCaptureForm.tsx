'use client';

import { useState } from 'react';

interface LeadCaptureFormProps {
    vehicleId?: string;
}

export default function LeadCaptureForm({ vehicleId }: LeadCaptureFormProps) {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name') as string,
            phone: formData.get('phone') as string,
            email: formData.get('email') as string,
            message: formData.get('message') as string,
            vehicleId,
        };

        if (!data.name || (!data.email && !data.phone)) {
            setStatus('error');
            setErrorMessage('Please provide your name and either an email or phone number.');
            return;
        }

        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (res.ok && result.success) {
                setStatus('success');
                (e.target as HTMLFormElement).reset();
            } else {
                setStatus('error');
                setErrorMessage(result.error || 'Failed to submit inquiry. Please try again.');
            }
        } catch {
            setStatus('error');
            setErrorMessage('An unexpected error occurred. Please try again.');
        }
    }

    if (status === 'success') {
        return (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 p-6 rounded-2xl border border-green-200 dark:border-green-800 text-center animate-fade-in">
                <span className="material-symbols-outlined text-4xl mb-4 text-green-500">check_circle</span>
                <h3 className="text-xl font-bold mb-2">Inquiry Received!</h3>
                <p>Thanks for your interest. Our sales team will be in touch with you shortly.</p>
                <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 text-sm font-bold uppercase tracking-widest hover:underline"
                >
                    Send another inquiry
                </button>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 mt-12 mb-8" id="inquiry-form">
            <h3 className="text-2xl font-bold font-display uppercase tracking-tight text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary dark:text-white">mail</span>
                {vehicleId ? 'Interested in this vehicle?' : "Let's talk"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {status === 'error' && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm border border-red-200 dark:border-red-800">
                        {errorMessage}
                    </div>
                )}

                <div className="space-y-1">
                    <label htmlFor="name" className="text-sm font-bold uppercase text-slate-500 tracking-wider">Name *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        disabled={status === 'submitting'}
                        className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 p-3 rounded-xl focus:border-primary dark:focus:border-white focus:outline-none transition-colors"
                        placeholder="John Doe"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label htmlFor="email" className="text-sm font-bold uppercase text-slate-500 tracking-wider">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            disabled={status === 'submitting'}
                            className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 p-3 rounded-xl focus:border-primary dark:focus:border-white focus:outline-none transition-colors"
                            placeholder="john@example.com"
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="phone" className="text-sm font-bold uppercase text-slate-500 tracking-wider">Phone</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            disabled={status === 'submitting'}
                            className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 p-3 rounded-xl focus:border-primary dark:focus:border-white focus:outline-none transition-colors"
                            placeholder="(555) 123-4567"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label htmlFor="message" className="text-sm font-bold uppercase text-slate-500 tracking-wider">Message</label>
                    <textarea
                        id="message"
                        name="message"
                        rows={4}
                        disabled={status === 'submitting'}
                        className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 p-3 rounded-xl focus:border-primary dark:focus:border-white focus:outline-none transition-colors"
                        placeholder={vehicleId ? "I'm interested in the vehicle. Is it still available?" : "How can we help you?"}
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full bg-primary dark:bg-white text-white dark:text-primary py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:-translate-y-1 transition-transform active:scale-95 shadow-xl shadow-primary/20 dark:shadow-white/10 disabled:opacity-70 disabled:hover:transform-none mt-2 flex items-center justify-center gap-2"
                >
                    {status === 'submitting' ? (
                        <>
                            <span className="material-symbols-outlined animate-spin hidden md:block">progress_activity</span>
                            Sending...
                        </>
                    ) : (
                        'Send Inquiry'
                    )}
                </button>
                <p className="text-xs text-slate-500 text-center mt-2">
                    We will never share your personal information.
                </p>
            </form>
        </div>
    );
}
