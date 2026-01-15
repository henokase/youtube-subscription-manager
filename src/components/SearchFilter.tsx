"use client";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchFilterProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function SearchFilter({
    value,
    onChange,
    placeholder = "Search channels...",
}: SearchFilterProps) {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-10 w-full border-zinc-700 bg-zinc-800/50 pl-10 pr-10 text-white placeholder:text-zinc-500 focus:border-red-500 focus:ring-red-500/20 sm:w-80"
                aria-label="Search subscriptions"
            />
            {value && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 text-zinc-500 hover:bg-zinc-700 hover:text-white"
                    onClick={() => onChange("")}
                    aria-label="Clear search"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
