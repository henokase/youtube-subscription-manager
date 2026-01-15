import { auth } from "@/auth";
import { deleteSubscription } from "@/lib/youtube";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();

    if (!session?.accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    try {
        await deleteSubscription(session.accessToken, id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting subscription:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to unsubscribe" },
            { status: 500 }
        );
    }
}
