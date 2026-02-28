'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useTranslations } from 'next-intl';

const carVerticalRequestSchema = z.object({
  email: z.string().min(1).email(),
  name: z.string().optional(),
});

type CarVerticalRequestFormProps = {
  vehicleId: string;
  vehicleContext: {
    make: string;
    model: string;
    year: number;
    vin?: string | null;
  };
};

export default function CarVerticalRequestForm({
  vehicleId,
  vehicleContext,
}: CarVerticalRequestFormProps) {
  const t = useTranslations('carVertical');
  const tCommon = useTranslations('common');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string }>({});

  const vehicleLabel = `${vehicleContext.year} ${vehicleContext.make} ${vehicleContext.model}`;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const raw = {
      email: (formData.get('email') as string)?.trim() || '',
      name: (formData.get('name') as string)?.trim() || undefined,
    };

    const parseResult = carVerticalRequestSchema.safeParse(raw);
    if (!parseResult.success) {
      const first = parseResult.error.issues[0];
      const path = first.path[0] as string;
      setFieldErrors(path === 'email' ? { email: first.message } : {});
      setErrorMessage(first.message);
      setStatus('error');
      return;
    }

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'carvertical',
          email: parseResult.data.email,
          name: parseResult.data.name || undefined,
          vehicleId,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setStatus('success');
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus('error');
        setErrorMessage(result.error || t('requestReceivedMessage'));
      }
    } catch {
      setStatus('error');
      setErrorMessage(t('requestReceivedMessage'));
    }
  }

  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (!value) return;
    const parsed = carVerticalRequestSchema.shape.email.safeParse(value);
    if (!parsed.success) {
      setFieldErrors((prev) => ({ ...prev, email: t('emailInvalid') }));
    } else {
      setFieldErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 p-6 rounded-2xl border border-green-200 dark:border-green-800 text-center animate-fade-in">
        <span className="material-symbols-outlined text-4xl mb-4 text-green-500">check_circle</span>
        <h3 className="text-xl font-bold mb-2">{t('requestReceived')}</h3>
        <p className="mb-1">{t('requestReceivedMessage')}</p>
        <p className="text-sm opacity-90">{t('respondWithinDay')}</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm font-bold uppercase tracking-widest hover:underline"
        >
          {t('requestAnother')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-slate-600 dark:text-slate-400 text-sm">
        {t('requestReport')}{' '}
        <strong className="text-slate-800 dark:text-slate-200">{vehicleLabel}</strong>
        {vehicleContext.vin && (
          <span className="block mt-1 text-slate-500 dark:text-slate-500 font-mono text-xs">
            VIN: {vehicleContext.vin}
          </span>
        )}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {status === 'error' && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm border border-red-200 dark:border-red-800 flex items-center justify-between gap-2">
            <span>{errorMessage}</span>
            <button
              type="button"
              onClick={() => {
                setStatus('idle');
                setErrorMessage('');
                setFieldErrors({});
              }}
              className="text-red-700 dark:text-red-300 font-semibold text-xs uppercase hover:underline"
            >
              {tCommon('retry')}
            </button>
          </div>
        )}

        <div className="space-y-1">
          <label
            htmlFor="carvertical-email"
            className="text-sm font-bold uppercase text-slate-500 tracking-wider"
          >
            {t('emailRequired')}
          </label>
          <input
            type="email"
            id="carvertical-email"
            name="email"
            required
            disabled={status === 'submitting'}
            onBlur={handleEmailBlur}
            className={`w-full bg-white dark:bg-slate-800 border-2 p-3 rounded-xl focus:outline-none transition-colors disabled:opacity-70
              ${fieldErrors.email ? 'border-red-400 dark:border-red-600 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-primary dark:focus:border-white'}`}
            placeholder={t('placeholderEmail')}
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? 'carvertical-email-error' : undefined}
          />
          {fieldErrors.email && (
            <p id="carvertical-email-error" className="text-red-600 dark:text-red-400 text-sm">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="carvertical-name"
            className="text-sm font-bold uppercase text-slate-500 tracking-wider"
          >
            {t('nameOptional')}
          </label>
          <input
            type="text"
            id="carvertical-name"
            name="name"
            disabled={status === 'submitting'}
            className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 p-3 rounded-xl focus:border-primary dark:focus:border-white focus:outline-none transition-colors disabled:opacity-70"
            placeholder={t('placeholderName')}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full bg-primary dark:bg-white text-white dark:text-primary py-3 rounded-xl font-bold uppercase tracking-widest text-sm hover:-translate-y-0.5 transition-transform active:scale-[0.98] shadow-lg shadow-primary/20 dark:shadow-white/10 disabled:opacity-70 disabled:hover:transform-none flex items-center justify-center gap-2"
        >
          {status === 'submitting' ? (
            <>
              <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
              {t('sending')}
            </>
          ) : (
            t('requestCarVerticalReport')
          )}
        </button>
      </form>
    </div>
  );
}
