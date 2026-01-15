"use client";

import { Subscription } from "@/lib/youtube";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, ExternalLink, Loader2, Users } from "lucide-react";
import { useEffect, useRef, useCallback } from "react";

interface SubscriptionTableProps {
    subscriptions: Subscription[];
    isLoading: boolean;
    isLoadingMore: boolean;
    hasMore: boolean;
    isSelected: (id: string) => boolean;
    onToggleSelect: (id: string) => void;
    onLoadMore: () => void;
    onUnsubscribeSingle: (id: string) => void;
}

export function SubscriptionTable({
    subscriptions,
    isLoading,
    isLoadingMore,
    hasMore,
    isSelected,
    onToggleSelect,
    onLoadMore,
    onUnsubscribeSingle,
}: SubscriptionTableProps) {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    // Infinite scroll observer
    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries;
            if (entry.isIntersecting && hasMore && !isLoadingMore) {
                onLoadMore();
            }
        },
        [hasMore, isLoadingMore, onLoadMore]
    );

    useEffect(() => {
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(handleObserver, {
            threshold: 0.1,
        });

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [handleObserver]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-red-500" />
                <p className="mt-4 text-zinc-400">Loading subscriptions...</p>
            </div>
        );
    }

    if (subscriptions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-700/50 bg-zinc-800/30 py-20">
                <Users className="h-12 w-12 text-zinc-600" />
                <h3 className="mt-4 text-lg font-medium text-white">No subscriptions found</h3>
                <p className="mt-2 text-zinc-400">
                    Try adjusting your search or subscribe to some channels!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {subscriptions.map((subscription) => (
                <div
                    key={subscription.id}
                    className={`group flex items-center gap-4 rounded-lg border p-4 transition-all ${isSelected(subscription.id)
                            ? "border-red-500/50 bg-red-500/10"
                            : "border-zinc-700/50 bg-zinc-800/30 hover:border-zinc-600 hover:bg-zinc-800/50"
                        }`}
                >
                    <Checkbox
                        checked={isSelected(subscription.id)}
                        onCheckedChange={() => onToggleSelect(subscription.id)}
                        aria-label={`Select ${subscription.title}`}
                        className="border-zinc-600 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                    />

                    <a
                        href={`https://www.youtube.com/channel/${subscription.channelId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-zinc-700 transition-transform hover:scale-105"
                    >
                        <img
                            src={subscription.thumbnailUrl}
                            alt={subscription.title}
                            className="h-full w-full object-cover"
                        />
                    </a>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <a
                                href={`https://www.youtube.com/channel/${subscription.channelId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="truncate font-medium text-white hover:text-red-400 hover:underline"
                            >
                                {subscription.title}
                            </a>
                            <ExternalLink className="h-3 w-3 flex-shrink-0 text-zinc-500" />
                        </div>
                        <p className="mt-1 line-clamp-1 text-sm text-zinc-400">
                            {subscription.description || "No description"}
                        </p>
                    </div>

                    {subscription.subscriberCount && (
                        <Badge
                            variant="secondary"
                            className="hidden flex-shrink-0 bg-zinc-700 text-zinc-300 sm:flex"
                        >
                            <Users className="mr-1 h-3 w-3" />
                            {subscription.subscriberCount}
                        </Badge>
                    )}

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUnsubscribeSingle(subscription.id)}
                        className="flex-shrink-0 text-zinc-400 opacity-0 transition-opacity hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                        aria-label={`Unsubscribe from ${subscription.title}`}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}

            {/* Infinite scroll trigger */}
            <div ref={loadMoreRef} className="flex justify-center py-4">
                {isLoadingMore && (
                    <div className="flex items-center gap-2 text-zinc-400">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Loading more...</span>
                    </div>
                )}
                {!hasMore && subscriptions.length > 0 && (
                    <p className="text-sm text-zinc-500">
                        You&apos;ve reached the end of your subscriptions
                    </p>
                )}
            </div>
        </div>
    );
}
