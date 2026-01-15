"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";

interface SignOutButtonProps {
    userName?: string | null;
}

export function SignOutButton({ userName }: SignOutButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignOut = async () => {
        setIsLoading(true);
        try {
            await signOut({ callbackUrl: "/login" });
        } catch (error) {
            console.error("Sign out error:", error);
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className="cursor-pointer rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white sm:block hidden"
                >
                    Sign Out
                </button>
            </DialogTrigger>
            {/* Mobile icon button */}
            <DialogTrigger asChild>
                <button
                    type="button"
                    className="cursor-pointer rounded-lg bg-zinc-800 p-2 text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white sm:hidden"
                    aria-label="Sign out"
                >
                    <LogOut className="h-5 w-5" />
                </button>
            </DialogTrigger>

            <DialogContent className="border-zinc-700 bg-zinc-800 text-white sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-700">
                        <LogOut className="h-6 w-6 text-zinc-300" />
                    </div>
                    <DialogTitle className="text-center text-xl">Sign Out</DialogTitle>
                    <DialogDescription className="text-center text-zinc-400">
                        Are you sure you want to sign out
                        {userName ? ` as ${userName}` : ""}?
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        disabled={isLoading}
                        className="cursor-pointer border-zinc-600 bg-transparent text-zinc-300 hover:bg-zinc-700 hover:text-white"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleSignOut}
                        disabled={isLoading}
                        className="cursor-pointer bg-red-600 hover:bg-red-700"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing out...
                            </>
                        ) : (
                            <>Sign Out</>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
