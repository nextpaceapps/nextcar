import * as Sentry from '@sentry/react';
import { auth } from '../lib/firebase';

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (import.meta.env.DEV ? 'http://localhost:5001' : '');

export const getAuthHeaders = async () => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('Not authenticated');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

type CapturedError = Error & { __sentryCaptured?: boolean };

type RequestJsonOptions = RequestInit & {
    ignoreStatuses?: number[];
};

const getErrorMessage = (data: unknown, fallback: string) => {
    if (!data || typeof data !== 'object') return fallback;

    const typedData = data as {
        error?: string | { message?: string };
    };

    if (typeof typedData.error === 'string') return typedData.error;
    if (typedData.error?.message) return typedData.error.message;

    return fallback;
};

const captureAdminApiError = (
    error: unknown,
    path: string,
    method: string,
    extra?: Record<string, unknown>,
) => {
    Sentry.captureException(error, {
        tags: {
            area: 'admin-api',
            endpoint: path,
            method,
        },
        extra,
    });
};

export const getTracePropagationTargets = (): Array<string | RegExp> => {
    const targets: Array<string | RegExp> = ['localhost', /^\/api\//];

    if (BACKEND_URL) {
        targets.push(BACKEND_URL);
    }

    return targets;
};

export const requestJson = async <T>(
    path: string,
    init: RequestJsonOptions = {},
): Promise<{ response: Response; data: T }> => {
    const method = init.method || 'GET';
    const url = `${BACKEND_URL}${path}`;

    try {
        const authHeaders = await getAuthHeaders();
        const response = await fetch(url, {
            ...init,
            headers: {
                ...authHeaders,
                ...(init.headers as Record<string, string> | undefined),
            },
        });
        const data = await response.json().catch(() => null as T | null);

        if (init.ignoreStatuses?.includes(response.status)) {
            return { response, data: data as T };
        }

        const hasSuccessFlag = typeof data === 'object' && data !== null && 'success' in data;
        const isFailure = !response.ok || (hasSuccessFlag && (data as { success?: boolean }).success === false);

        if (isFailure) {
            const error = new Error(getErrorMessage(data, response.statusText || 'Request failed')) as CapturedError;
            error.__sentryCaptured = true;
            captureAdminApiError(error, path, method, {
                status: response.status,
                response: data,
                url,
            });
            throw error;
        }

        return { response, data: data as T };
    } catch (error: unknown) {
        const capturedError: CapturedError = error instanceof Error ? error : new Error('Request failed');

        if (!capturedError.__sentryCaptured) {
            capturedError.__sentryCaptured = true;
            captureAdminApiError(capturedError, path, method, { url });
        }

        throw capturedError;
    }
};
