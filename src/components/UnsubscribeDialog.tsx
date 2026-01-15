"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

interface UnsubscribeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    selectedCount: number;
    onConfirm: () => Promise<void>;
}

export function UnsubscribeDialog({
    isOpen,
    onClose,
    selectedCount,
    onConfirm,
}: UnsubscribeDialogProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState({ completed: 0, total: 0 });

    const handleConfirm = async () => {
        setIsProcessing(true);
        setProgress({ completed: 0, total: selectedCount });

        try {
            await onConfirm();
        } finally {
            setIsProcessing(false);
            setProgress({ completed: 0, total: 0 });
            onClose();
        }
    };

    const progressPercent =
        progress.total > 0
            ? Math.round((progress.completed / progress.total) * 100)
            : 0;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !isProcessing && !open && onClose()}>
            <DialogContent className="border-zinc-700 bg-zinc-800 text-white sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                        <AlertTriangle className="h-6 w-6 text-red-500" />
                    </div>
                    <DialogTitle className="text-center text-xl">
                        Confirm Unsubscribe
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-400">
                        {isProcessing ? (
                            <>
                                Processing... Please don&apos;t close this window.
                                <br />
                                {progress.completed} of {progress.total} completed
                            </>
                        ) : (
                            <>
                                Are you sure you want to unsubscribe from{" "}
                                <span className="font-semibold text-white">
                                    {selectedCount} channel{selectedCount !== 1 ? "s" : ""}
                                </span>
                                ? This action cannot be undone.
                            </>
                        )}
                    </DialogDescription>
                </DialogHeader>

                {isProcessing && (
                    <div className="mx-auto w-full max-w-xs">
                        <div className="h-2 overflow-hidden rounded-full bg-zinc-700">
                            <div
                                className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        <p className="mt-2 text-center text-sm text-zinc-400">
                            {progressPercent}% complete
                        </p>
                    </div>
                )}

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isProcessing}
                        className="cursor-pointer border-zinc-600 bg-transparent text-zinc-300 hover:bg-zinc-700 hover:text-white"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={isProcessing}
                        className="cursor-pointer bg-red-600 hover:bg-red-700"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>Unsubscribe</>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
