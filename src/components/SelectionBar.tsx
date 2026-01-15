"use client";

import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";

interface SelectionBarProps {
    selectedCount: number;
    onUnsubscribe: () => void;
    onCancel: () => void;
}

export function SelectionBar({
    selectedCount,
    onUnsubscribe,
    onCancel,
}: SelectionBarProps) {
    if (selectedCount === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-700/50 bg-zinc-900/95 backdrop-blur-lg">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-white">
                        {selectedCount} channel{selectedCount !== 1 ? "s" : ""} selected
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onCancel}
                        className="cursor-pointer border-zinc-600 bg-transparent text-zinc-300 hover:bg-zinc-700 hover:text-white"
                    >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={onUnsubscribe}
                        className="cursor-pointer bg-red-600 hover:bg-red-700"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Unsubscribe ({selectedCount})
                    </Button>
                </div>
            </div>
        </div>
    );
}
