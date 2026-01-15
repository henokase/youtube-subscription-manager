import { auth } from "@/auth";
import { getSubscriptions } from "@/lib/youtube";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const session = await auth();

    if (!session?.accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const pageToken = searchParams.get("pageToken") || undefined;
    const maxResults = parseInt(searchParams.get("maxResults") || "50", 10);

    try {
        const subscriptions = await getSubscriptions(
            session.accessToken,
            pageToken,
            maxResults
        );

        return NextResponse.json(subscriptions);
    } catch (error) {
        console.error("Error fetching subscriptions:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to fetch subscriptions" },
            { status: 500 }
        );
    }
}
