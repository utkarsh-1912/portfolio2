'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Native drag-and-drop reordering for admin lists. Returns the items in their current
 * (optimistic) order plus props to spread on each row; `onCommit` receives the new id order.
 * The local order resets whenever the server sends fresh data.
 */
export function useDragReorder<T extends { id: number }>(items: T[], onCommit: (ids: number[]) => void) {
    const [order, setOrder] = useState<number[]>(() => items.map((i) => i.id));
    const [overId, setOverId] = useState<number | null>(null);
    const dragId = useRef<number | null>(null);

    const key = items.map((i) => i.id).join(',');
    useEffect(() => {
        setOrder(items.map((i) => i.id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    const byId = new Map(items.map((i) => [i.id, i]));
    const ordered = order.map((id) => byId.get(id)).filter(Boolean) as T[];

    const rowProps = (id: number) => ({
        draggable: true,
        onDragStart: (e: React.DragEvent) => {
            dragId.current = id;
            e.dataTransfer.effectAllowed = 'move';
        },
        onDragOver: (e: React.DragEvent) => {
            e.preventDefault();
            if (dragId.current !== id) setOverId(id);
        },
        onDragLeave: () => setOverId((cur) => (cur === id ? null : cur)),
        onDrop: (e: React.DragEvent) => {
            e.preventDefault();
            const from = dragId.current;
            setOverId(null);
            dragId.current = null;
            if (from === null || from === id) return;
            const next = order.filter((x) => x !== from);
            next.splice(next.indexOf(id), 0, from);
            setOrder(next);
            onCommit(next);
        },
        onDragEnd: () => {
            setOverId(null);
            dragId.current = null;
        },
        'data-drag-over': overId === id || undefined,
    });

    /** Keyboard-accessible alternative to dragging. */
    const move = (id: number, dir: -1 | 1) => {
        const idx = order.indexOf(id);
        const to = idx + dir;
        if (idx < 0 || to < 0 || to >= order.length) return;
        const next = [...order];
        [next[idx], next[to]] = [next[to], next[idx]];
        setOrder(next);
        onCommit(next);
    };

    return { ordered, rowProps, move };
}
