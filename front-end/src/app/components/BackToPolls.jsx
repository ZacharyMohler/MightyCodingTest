'use client'; // required for client-side navigation in Next.js

import React from 'react';
import { useRouter } from 'next/navigation';

export default function BackToPolls() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/')}
      className="mb-6 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition font-semibold"
    >
      ← Back to Polls
    </button>
  );
}