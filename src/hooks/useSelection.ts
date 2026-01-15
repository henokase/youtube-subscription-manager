"use client";

import { useState, useCallback, useMemo } from "react";

interface UseSelectionReturn {
    selectedIds: Set<string>;
    isSelected: (id: string) => boolean;
    toggle: (id: string) => void;
    selectAll: (ids: string[]) => void;
    deselectAll: () => void;
    isAllSelected: (ids: string[]) => boolean;
    isSomeSelected: (ids: string[]) => boolean;
    selectedCount: number;
}

export function useSelection(): UseSelectionReturn {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const isSelected = useCallback(
        (id: string) => selectedIds.has(id),
        [selectedIds]
    );

    const toggle = useCallback((id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    const selectAll = useCallback((ids: string[]) => {
        setSelectedIds(new Set(ids));
    }, []);

    const deselectAll = useCallback(() => {
        setSelectedIds(new Set());
    }, []);

    const isAllSelected = useCallback(
        (ids: string[]) => ids.length > 0 && ids.every((id) => selectedIds.has(id)),
        [selectedIds]
    );

    const isSomeSelected = useCallback(
        (ids: string[]) => ids.some((id) => selectedIds.has(id)) && !isAllSelected(ids),
        [selectedIds, isAllSelected]
    );

    const selectedCount = useMemo(() => selectedIds.size, [selectedIds]);

    return {
        selectedIds,
        isSelected,
        toggle,
        selectAll,
        deselectAll,
        isAllSelected,
        isSomeSelected,
        selectedCount,
    };
}
