import { auth } from "@/auth";
import { getSubscriptions, generateSubscriptionsCsv, Subscription } from "@/lib/youtube";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();

    if (!session?.accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Fetch all subscriptions (paginate through all pages)
        const allSubscriptions: Subscription[] = [];
        let pageToken: string | undefined;

        do {
            const response = await getSubscriptions(session.accessToken, pageToken, 50);
            allSubscriptions.push(...response.items);
            pageToken = response.nextPageToken;
        } while (pageToken);

        const csv = generateSubscriptionsCsv(allSubscriptions);

        return new NextResponse(csv, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="youtube-subscriptions-${new Date().toISOString().split("T")[0]}.csv"`,
            },
        });
    } catch (error) {
        console.error("Error exporting subscriptions:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to export subscriptions" },
            { status: 500 }
        );
    }
}
