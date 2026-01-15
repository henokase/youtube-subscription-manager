"use client";

import { useState, useMemo, useCallback } from "react";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useSelection } from "@/hooks/useSelection";
import { SearchFilter } from "@/components/SearchFilter";
import { BulkActions } from "@/components/BulkActions";
import { SubscriptionTable } from "@/components/SubscriptionTable";
import { UnsubscribeDialog } from "@/components/UnsubscribeDialog";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isExporting, setIsExporting] = useState(false);
    const [showUnsubscribeDialog, setShowUnsubscribeDialog] = useState(false);
    const [pendingUnsubscribeIds, setPendingUnsubscribeIds] = useState<string[]>([]);

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
        isSelected,
        toggle,
        selectAll,
        deselectAll,
        isAllSelected,
        isSomeSelected,
        selectedCount,
        selectedIds,
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

    const filteredIds = useMemo(
        () => filteredSubscriptions.map((sub) => sub.id),
        [filteredSubscriptions]
    );

    // Handle export
    const handleExport = async () => {
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
    };

    // Handle single unsubscribe
    const handleUnsubscribeSingle = (id: string) => {
        setPendingUnsubscribeIds([id]);
        setShowUnsubscribeDialog(true);
    };

    // Handle bulk unsubscribe
    const handleBulkUnsubscribe = () => {
        setPendingUnsubscribeIds(Array.from(selectedIds));
        setShowUnsubscribeDialog(true);
    };

    // Confirm unsubscribe
    const confirmUnsubscribe = useCallback(async () => {
        for (const id of pendingUnsubscribeIds) {
            try {
                const response = await fetch(`/api/youtube/subscriptions/${id}`, {
                    method: "DELETE",
                });
                if (!response.ok) throw new Error("Failed to unsubscribe");
            } catch (error) {
                console.error(`Failed to unsubscribe from ${id}:`, error);
            }
            // Rate limit: 1 request per second
            if (pendingUnsubscribeIds.indexOf(id) < pendingUnsubscribeIds.length - 1) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }

        removeSubscriptions(pendingUnsubscribeIds);
        deselectAll();
        setPendingUnsubscribeIds([]);
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
                        onClick={refresh}
                        disabled={isLoading}
                        className="border-zinc-600 bg-transparent text-zinc-300 hover:bg-zinc-700 hover:text-white"
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
                        className="ml-auto border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                        Retry
                    </Button>
                </div>
            )}

            {/* Bulk Actions */}
            {!isLoading && filteredSubscriptions.length > 0 && (
                <BulkActions
                    selectedCount={selectedCount}
                    totalCount={filteredSubscriptions.length}
                    isAllSelected={isAllSelected(filteredIds)}
                    isSomeSelected={isSomeSelected(filteredIds)}
                    onSelectAll={() => selectAll(filteredIds)}
                    onDeselectAll={deselectAll}
                    onUnsubscribe={handleBulkUnsubscribe}
                    onExport={handleExport}
                    isExporting={isExporting}
                />
            )}

            {/* Subscription List */}
            <SubscriptionTable
                subscriptions={filteredSubscriptions}
                isLoading={isLoading}
                isLoadingMore={isLoadingMore}
                hasMore={hasMore && !searchQuery}
                isSelected={isSelected}
                onToggleSelect={toggle}
                onLoadMore={loadMore}
                onUnsubscribeSingle={handleUnsubscribeSingle}
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
            />
        </div>
    );
}
