'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service (later)
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
            <p className="mb-8 text-neutral-600">The Fortress Protocol caught a crash. We are safe.</p>

            <div className="bg-neutral-100 p-4 rounded-lg text-left text-xs font-mono mb-8 overflow-auto max-w-lg">
                {error.message || 'Unknown Error'}
            </div>

            <button
                onClick={() => reset()}
                className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800"
            >
                Try again
            </button>
        </div>
    );
}
