"use client";

import { useState, useMemo, useCallback } from "react";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useSelection } from "@/hooks/useSelection";
import { SearchFilter } from "@/components/SearchFilter";
import { SubscriptionTable } from "@/components/SubscriptionTable";
import { SelectionBar } from "@/components/SelectionBar";
import { UnsubscribeDialog } from "@/components/UnsubscribeDialog";
import { RefreshCw, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isExporting, setIsExporting] = useState(false);
    const [showUnsubscribeDialog, setShowUnsubscribeDialog] = useState(false);
    const [pendingUnsubscribeIds, setPendingUnsubscribeIds] = useState<string[]>([]);
    const [unsubscribeProgress, setUnsubscribeProgress] = useState({ completed: 0, total: 0 });

    const {
        subscriptions,
        isLoading,
        isLoadingMore,
        error,
        hasMore,
        totalResults,
        loadMore,
        refresh,
        removeSubscriptions,
    } = useSubscriptions();

    const {
        selectedIds,
        toggle,
        deselectAll,
        selectedCount,
    } = useSelection();

    // Filter subscriptions based on search query
    const filteredSubscriptions = useMemo(() => {
        if (!searchQuery.trim()) return subscriptions;
        const query = searchQuery.toLowerCase();
        return subscriptions.filter(
            (sub) =>
                sub.title.toLowerCase().includes(query) ||
                sub.description.toLowerCase().includes(query)
        );
    }, [subscriptions, searchQuery]);

    // Handle export
    const handleExport = useCallback(async () => {
        setIsExporting(true);
        try {
            const response = await fetch("/api/youtube/export");
            if (!response.ok) throw new Error("Export failed");

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `youtube-subscriptions-${new Date().toISOString().split("T")[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Export error:", error);
        } finally {
            setIsExporting(false);
        }
    }, []);

    // Handle single unsubscribe
    const handleUnsubscribeSingle = useCallback((id: string) => {
        setPendingUnsubscribeIds([id]);
        setShowUnsubscribeDialog(true);
    }, []);

    // Handle bulk unsubscribe
    const handleBulkUnsubscribe = useCallback(() => {
        setPendingUnsubscribeIds(Array.from(selectedIds));
        setShowUnsubscribeDialog(true);
    }, [selectedIds]);

    // Cancel selection
    const handleCancelSelection = useCallback(() => {
        deselectAll();
    }, [deselectAll]);

    // Confirm unsubscribe
    const confirmUnsubscribe = useCallback(async () => {
        const total = pendingUnsubscribeIds.length;
        setUnsubscribeProgress({ completed: 0, total });

        for (let i = 0; i < total; i++) {
            const id = pendingUnsubscribeIds[i];
            try {
                const response = await fetch(`/api/youtube/subscriptions/${id}`, {
                    method: "DELETE",
                });
                if (!response.ok) throw new Error("Failed to unsubscribe");
            } catch (error) {
                console.error(`Failed to unsubscribe from ${id}:`, error);
            }

            setUnsubscribeProgress((prev) => ({ ...prev, completed: i + 1 }));

            // Rate limit: 1 request per second
            if (i < total - 1) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }

        removeSubscriptions(pendingUnsubscribeIds);
        deselectAll();
        setPendingUnsubscribeIds([]);
        setUnsubscribeProgress({ completed: 0, total: 0 });
    }, [pendingUnsubscribeIds, removeSubscriptions, deselectAll]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Your Subscriptions</h1>
                    <p className="mt-1 text-zinc-400">
                        {totalResults > 0
                            ? `${totalResults} total subscriptions`
                            : "Loading..."}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <SearchFilter value={searchQuery} onChange={setSearchQuery} />
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleExport}
                        disabled={isExporting || isLoading}
                        className="cursor-pointer border-zinc-600 bg-transparent text-zinc-300 hover:bg-zinc-700 hover:text-white"
                        aria-label="Export subscriptions as CSV"
                    >
                        <Download className={`h-4 w-4 ${isExporting ? "animate-pulse" : ""}`} />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={refresh}
                        disabled={isLoading}
                        className="cursor-pointer border-zinc-600 bg-transparent text-zinc-300 hover:bg-zinc-700 hover:text-white"
                        aria-label="Refresh subscriptions"
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    </Button>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="flex items-center gap-3 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-400">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p>{error}</p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={refresh}
                        className="ml-auto cursor-pointer border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                        Retry
                    </Button>
                </div>
            )}

            {/* Subscription List */}
            <SubscriptionTable
                subscriptions={filteredSubscriptions}
                selectedIds={selectedIds}
                isLoading={isLoading}
                isLoadingMore={isLoadingMore}
                hasMore={hasMore && !searchQuery}
                onToggleSelect={toggle}
                onLoadMore={loadMore}
                onUnsubscribeSingle={handleUnsubscribeSingle}
            />

            {/* Fixed Selection Bar at Bottom */}
            <SelectionBar
                selectedCount={selectedCount}
                onUnsubscribe={handleBulkUnsubscribe}
                onCancel={handleCancelSelection}
            />

            {/* Unsubscribe Dialog */}
            <UnsubscribeDialog
                isOpen={showUnsubscribeDialog}
                onClose={() => {
                    setShowUnsubscribeDialog(false);
                    setPendingUnsubscribeIds([]);
                }}
                selectedCount={pendingUnsubscribeIds.length}
                onConfirm={confirmUnsubscribe}
                progress={unsubscribeProgress}
            />
        </div>
    );
}
