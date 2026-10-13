'use client';

import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { ActionResult } from '@/lib/cms-schemas';

/**
 * Runs an admin server action and reports the outcome with a toast.
 * Resolves to the action's data on success, or `undefined` on failure.
 */
export function useAdminAction() {
    const { toast } = useToast();

    return useCallback(
        async <T,>(action: Promise<ActionResult<T>>, successMessage?: string): Promise<{ ok: boolean; data?: T }> => {
            const result = await action;
            if (!result.ok) {
                toast({ title: 'Not saved', description: result.error, variant: 'destructive' });
                return { ok: false };
            }
            if (successMessage) toast({ title: 'Saved', description: successMessage });
            return { ok: true, data: result.data };
        },
        [toast]
    );
}
