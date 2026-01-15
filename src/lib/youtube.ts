import { youtube_v3 } from "@googleapis/youtube";

const API_BASE_URL = "https://www.googleapis.com/youtube/v3";

export interface Subscription {
    id: string;
    channelId: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    subscriberCount?: string;
    publishedAt: string;
}

export interface SubscriptionsResponse {
    items: Subscription[];
    nextPageToken?: string;
    totalResults: number;
}

/**
 * Fetch the authenticated user's YouTube subscriptions
 */
export async function getSubscriptions(
    accessToken: string,
    pageToken?: string,
    maxResults: number = 50
): Promise<SubscriptionsResponse> {
    const params = new URLSearchParams({
        part: "snippet,contentDetails",
        mine: "true",
        maxResults: maxResults.toString(),
    });

    if (pageToken) {
        params.set("pageToken", pageToken);
    }

    const response = await fetch(`${API_BASE_URL}/subscriptions?${params}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to fetch subscriptions");
    }

    const data = await response.json();

    // Extract channel IDs to fetch subscriber counts
    const channelIds =
        data.items?.map(
            (item: youtube_v3.Schema$Subscription) =>
                item.snippet?.resourceId?.channelId
        ) || [];

    // Fetch channel details for subscriber counts
    let channelDetails: Map<string, string> = new Map();
    if (channelIds.length > 0) {
        channelDetails = await getChannelSubscriberCounts(accessToken, channelIds);
    }

    const items: Subscription[] =
        data.items?.map((item: youtube_v3.Schema$Subscription) => {
            const channelId = item.snippet?.resourceId?.channelId || "";
            return {
                id: item.id || "",
                channelId,
                title: item.snippet?.title || "",
                description: item.snippet?.description || "",
                thumbnailUrl:
                    item.snippet?.thumbnails?.medium?.url ||
                    item.snippet?.thumbnails?.default?.url ||
                    "",
                subscriberCount: channelDetails.get(channelId),
                publishedAt: item.snippet?.publishedAt || "",
            };
        }) || [];

    return {
        items,
        nextPageToken: data.nextPageToken,
        totalResults: data.pageInfo?.totalResults || 0,
    };
}

/**
 * Fetch subscriber counts for a list of channel IDs
 */
async function getChannelSubscriberCounts(
    accessToken: string,
    channelIds: string[]
): Promise<Map<string, string>> {
    const params = new URLSearchParams({
        part: "statistics",
        id: channelIds.join(","),
    });

    const response = await fetch(`${API_BASE_URL}/channels?${params}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        // Don't throw, just return empty map - subscriber counts are optional
        return new Map();
    }

    const data = await response.json();
    const counts = new Map<string, string>();

    data.items?.forEach((channel: youtube_v3.Schema$Channel) => {
        if (channel.id && channel.statistics?.subscriberCount) {
            counts.set(channel.id, formatSubscriberCount(channel.statistics.subscriberCount));
        }
    });

    return counts;
}

/**
 * Format subscriber count for display (e.g., 1.2M, 450K)
 */
function formatSubscriberCount(count: string): string {
    const num = parseInt(count, 10);
    if (isNaN(num)) return count;

    if (num >= 1_000_000) {
        return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
    }
    if (num >= 1_000) {
        return `${(num / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
    }
    return num.toString();
}

/**
 * Unsubscribe from a channel
 */
export async function deleteSubscription(
    accessToken: string,
    subscriptionId: string
): Promise<void> {
    const response = await fetch(
        `${API_BASE_URL}/subscriptions?id=${subscriptionId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok && response.status !== 204) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to unsubscribe");
    }
}

/**
 * Bulk unsubscribe with rate limiting (1 request per second)
 */
export async function bulkDeleteSubscriptions(
    accessToken: string,
    subscriptionIds: string[],
    onProgress?: (completed: number, total: number) => void
): Promise<{ success: string[]; failed: string[] }> {
    const success: string[] = [];
    const failed: string[] = [];

    for (let i = 0; i < subscriptionIds.length; i++) {
        const id = subscriptionIds[i];

        try {
            await deleteSubscription(accessToken, id);
            success.push(id);
        } catch {
            failed.push(id);
        }

        onProgress?.(i + 1, subscriptionIds.length);

        // Rate limit: wait 1 second between requests (except after the last one)
        if (i < subscriptionIds.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }

    return { success, failed };
}

/**
 * Generate CSV content from subscriptions
 */
export function generateSubscriptionsCsv(subscriptions: Subscription[]): string {
    const headers = ["Channel Name", "Channel ID", "Subscriber Count", "Subscribed Date", "Channel URL"];
    const rows = subscriptions.map((sub) => [
        `"${sub.title.replace(/"/g, '""')}"`,
        sub.channelId,
        sub.subscriberCount || "N/A",
        new Date(sub.publishedAt).toLocaleDateString(),
        `https://www.youtube.com/channel/${sub.channelId}`,
    ]);

    return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}
