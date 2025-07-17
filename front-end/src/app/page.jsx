'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './index.css'
import BackToPolls from './components/BackToPolls.jsx';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardTitle,
} from '@/components/ui/card';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

export default function HomePage() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noPolls, setNoPolls] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch('http://localhost:3000/polls');
        if (!response.ok) throw new Error('Failed to fetch polls');
        const data = await response.json();
        if (data.data.length === 0) {
          setNoPolls(true);
        } else {
          setPolls(data.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  const goToPoll = (id) => {
    router.push(`/poll/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading polls...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-3xl mx-auto mt-8">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (noPolls) {
    return (
      <div className="max-w-3xl mx-auto mt-8 text-center text-gray-500 italic font-semibold">
        No Polls Yet
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Poll Questions</h1>

      <ul className="space-y-4">
        {polls.map((poll) => (
          <Card
            key={poll.id}
            className="p-4"
          >
            <CardContent className="flex justify-between items-center w-full">
              <CardTitle className="font-semibold text-lg">
                {poll.question}
              </CardTitle>
              <Button size="sm" variant="outline" onClick={() => goToPoll(poll.id)}>
                Vote / View Results
              </Button>
            </CardContent>
          </Card>
        ))}
      </ul>

      <div className="flex justify-end mt-8">
        <Button
          onClick={() => router.push('/create-poll')}
          size="lg"
        >
          + Create New Poll
        </Button>
      </div>
    </div>
  );
}