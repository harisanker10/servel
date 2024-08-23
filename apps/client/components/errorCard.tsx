"use client";

export default function AuthErrorCard({ error }: { error?: string | null }) {
  if (error)
    return (
      <div className="space-y-4 px-2 flex items-center justify-center bg-red-200 text-red-600 py-4 rounded-md  shadow">
        {error}
      </div>
    );
}
