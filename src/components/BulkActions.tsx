"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Trash2 } from "lucide-react";

interface BulkActionsProps {
    selectedCount: number;
    totalCount: number;
    isAllSelected: boolean;
    isSomeSelected: boolean;
    onSelectAll: () => void;
    onDeselectAll: () => void;
    onUnsubscribe: () => void;
    onExport: () => void;
    isExporting?: boolean;
}

export function BulkActions({
    selectedCount,
    totalCount,
    isAllSelected,
    isSomeSelected,
    onSelectAll,
    onDeselectAll,
    onUnsubscribe,
    onExport,
    isExporting = false,
}: BulkActionsProps) {
    const handleCheckboxChange = () => {
        if (isAllSelected) {
            onDeselectAll();
        } else {
            onSelectAll();
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-4 rounded-lg border border-zinc-700/50 bg-zinc-800/30 p-4">
            <div className="flex items-center gap-3">
                <Checkbox
                    id="select-all"
                    checked={isAllSelected}
                    onCheckedChange={handleCheckboxChange}
                    aria-label={isAllSelected ? "Deselect all" : "Select all"}
                    className="border-zinc-600 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                    {...(isSomeSelected ? { "data-state": "indeterminate" } : {})}
                />
                <label
                    htmlFor="select-all"
                    className="cursor-pointer text-sm text-zinc-300"
                >
                    {isAllSelected
                        ? `All ${totalCount} selected`
                        : selectedCount > 0
                            ? `${selectedCount} selected`
                            : "Select all"}
                </label>
            </div>

            <div className="flex flex-1 items-center justify-end gap-2">
                {selectedCount > 0 && (
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={onUnsubscribe}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Unsubscribe ({selectedCount})
                    </Button>
                )}

                <Button
                    variant="outline"
                    size="sm"
                    onClick={onExport}
                    disabled={isExporting}
                    className="border-zinc-600 bg-transparent text-zinc-300 hover:bg-zinc-700 hover:text-white"
                >
                    <Download className="mr-2 h-4 w-4" />
                    {isExporting ? "Exporting..." : "Export CSV"}
                </Button>
            </div>
        </div>
    );
}
