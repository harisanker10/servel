"use client";
import { AlertTriangle, Info } from "lucide-react";
import { useEffect } from "react";
export default function ErrorCard({ error }: { error?: string | null }) {
  if (error)
    return (
      <div
        className="flex items-center border border-red-400 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
        role="alert"
      >
        <Info className="w-6 h-6 mr-2" />

        <span className="sr-only">Info</span>
        <div>
          <span className="font-medium">{error}</span>
        </div>
      </div>
    );
}
