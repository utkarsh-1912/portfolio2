'use client';

import { useTransition } from 'react';
import { Switch } from '@/components/ui/switch';
import type { ActionResult } from '@/lib/cms-schemas';
import { useAdminAction } from './use-admin-action';

/**
 * Quick Published/Draft switch for list rows. Drafts (and archived items) are
 * hidden from the public site. Saves the whole item with only `status` changed.
 */
export function StatusToggle({
    item,
    save,
}: {
    item: { id: number; title: string; status?: string | null };
    save: (id: number, data: unknown) => Promise<ActionResult<unknown>>;
}) {
    const [isPending, startTransition] = useTransition();
    const run = useAdminAction();
    const published = (item.status ?? 'active') === 'active';

    return (
        <label className="flex items-center gap-2 text-xs text-muted-foreground" title={published ? 'Visible on the site' : 'Hidden from the site'}>
            <Switch
                checked={published}
                disabled={isPending}
                aria-label={`${item.title}: ${published ? 'published' : 'draft'}`}
                onCheckedChange={(on) =>
                    startTransition(async () => {
                        await run(save(item.id, { ...item, status: on ? 'active' : 'draft' }), on ? `"${item.title}" is now published.` : `"${item.title}" is now a draft.`);
                    })
                }
            />
            <span className="w-16">{published ? 'Published' : item.status === 'archived' ? 'Archived' : 'Draft'}</span>
        </label>
    );
}
