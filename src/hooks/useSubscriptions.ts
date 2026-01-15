"use client";

import { useState, useEffect, useCallback } from "react";
import { Subscription, SubscriptionsResponse } from "@/lib/youtube";

interface UseSubscriptionsOptions {
    initialPageSize?: number;
}

interface UseSubscriptionsReturn {
    subscriptions: Subscription[];
    isLoading: boolean;
    isLoadingMore: boolean;
    error: string | null;
    hasMore: boolean;
    totalResults: number;
    loadMore: () => Promise<void>;
    refresh: () => Promise<void>;
    removeSubscriptions: (ids: string[]) => void;
}

export function useSubscriptions(
    options: UseSubscriptionsOptions = {}
): UseSubscriptionsReturn {
    const { initialPageSize = 50 } = options;

    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nextPageToken, setNextPageToken] = useState<string | undefined>();
    const [totalResults, setTotalResults] = useState(0);

    const fetchSubscriptions = useCallback(
        async (pageToken?: string) => {
            const params = new URLSearchParams({
                maxResults: initialPageSize.toString(),
            });
            if (pageToken) {
                params.set("pageToken", pageToken);
            }

            const response = await fetch(`/api/youtube/subscriptions?${params}`);

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to fetch subscriptions");
            }

            return response.json() as Promise<SubscriptionsResponse>;
        },
        [initialPageSize]
    );

    const loadInitial = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await fetchSubscriptions();
            setSubscriptions(data.items);
            setNextPageToken(data.nextPageToken);
            setTotalResults(data.totalResults);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    }, [fetchSubscriptions]);

    const loadMore = useCallback(async () => {
        if (!nextPageToken || isLoadingMore) return;

        setIsLoadingMore(true);

        try {
            const data = await fetchSubscriptions(nextPageToken);
            setSubscriptions((prev) => {
                const existingIds = new Set(prev.map((s) => s.id));
                const newItems = data.items.filter((item) => !existingIds.has(item.id));
                return [...prev, ...newItems];
            });
            setNextPageToken(data.nextPageToken);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoadingMore(false);
        }
    }, [nextPageToken, isLoadingMore, fetchSubscriptions]);

    const refresh = useCallback(async () => {
        setSubscriptions([]);
        setNextPageToken(undefined);
        await loadInitial();
    }, [loadInitial]);

    const removeSubscriptions = useCallback((ids: string[]) => {
        setSubscriptions((prev) => prev.filter((sub) => !ids.includes(sub.id)));
        setTotalResults((prev) => Math.max(0, prev - ids.length));
    }, []);

    useEffect(() => {
        loadInitial();
    }, [loadInitial]);

    return {
        subscriptions,
        isLoading,
        isLoadingMore,
        error,
        hasMore: !!nextPageToken,
        totalResults,
        loadMore,
        refresh,
        removeSubscriptions,
    };
}
