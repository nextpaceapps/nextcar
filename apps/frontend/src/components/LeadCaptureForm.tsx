'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface LeadCaptureFormProps {
  vehicleId?: string;
  intent?: string;
}

export default function LeadCaptureForm({ vehicleId, intent }: LeadCaptureFormProps) {
  const t = useTranslations('leadForm');
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
      setErrorMessage(t('errorNameEmailOrPhone'));
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
        setErrorMessage(result.error || t('errorSubmitFailed'));
      }
    } catch {
      setStatus('error');
      setErrorMessage(t('errorUnexpected'));
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 text-green-800 p-6 rounded-2xl border border-green-200 text-center animate-fade-in">
        <span className="material-symbols-outlined text-4xl mb-4 text-green-500">check_circle</span>
        <h3 className="text-xl font-bold mb-2">{t('successTitle')}</h3>
        <p>{t('successMessage')}</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm font-bold uppercase tracking-widest hover:underline"
        >
          {t('sendAnother')}
        </button>
      </div>
    );
  }

  const getTitle = () => {
    if (!vehicleId) return t('letsTalk');
    if (intent === 'test-drive') return t('scheduleTestDrive');
    return t('contactAboutVehicle');
  };

  const getMessagePlaceholder = () => {
    if (!vehicleId) return t('placeholderMessageGeneral');
    if (intent === 'test-drive') return t('placeholderMessageTestDrive');
    return t('placeholderMessageVehicle');
  };

  return (
    <div
      className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mt-12 mb-8"
      id="inquiry-form"
    >
      <h3 className="text-2xl font-bold font-display uppercase tracking-tight text-slate-800 mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">
          {intent === 'test-drive' ? 'drive_eta' : 'mail'}
        </span>
        {getTitle()}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {status === 'error' && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-200">
            {errorMessage}
          </div>
        )}

        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-bold uppercase text-slate-500 tracking-wider">
            {t('nameRequired')}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            disabled={status === 'submitting'}
            className="w-full bg-white border-2 border-slate-200 p-3 rounded-xl focus:border-primary focus:outline-none transition-colors"
            placeholder={t('placeholderName')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-bold uppercase text-slate-500 tracking-wider">
              {t('email')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              disabled={status === 'submitting'}
              className="w-full bg-white border-2 border-slate-200 p-3 rounded-xl focus:border-primary focus:outline-none transition-colors"
              placeholder={t('placeholderEmail')}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="phone" className="text-sm font-bold uppercase text-slate-500 tracking-wider">
              {t('phone')}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              disabled={status === 'submitting'}
              className="w-full bg-white border-2 border-slate-200 p-3 rounded-xl focus:border-primary focus:outline-none transition-colors"
              placeholder={t('placeholderPhone')}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="message" className="text-sm font-bold uppercase text-slate-500 tracking-wider">
            {t('message')}
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            disabled={status === 'submitting'}
            className="w-full bg-white border-2 border-slate-200 p-3 rounded-xl focus:border-primary focus:outline-none transition-colors"
            placeholder={getMessagePlaceholder()}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full bg-primary text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:-translate-y-1 transition-transform active:scale-95 shadow-xl shadow-primary/20 disabled:opacity-70 disabled:hover:transform-none mt-2 flex items-center justify-center gap-2"
        >
          {status === 'submitting' ? (
            <>
              <span className="material-symbols-outlined animate-spin hidden md:block">
                progress_activity
              </span>
              {t('sending')}
            </>
          ) : (
            t('sendInquiry')
          )}
        </button>
        <p className="text-xs text-slate-500 text-center mt-2">{t('privacyNote')}</p>
      </form>
    </div>
  );
}
