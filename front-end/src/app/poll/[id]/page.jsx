'use client';

import React, { use, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import BackToPolls from '../../components/BackToPolls';

export default function PollPage({ params }) {
  const { id } = use(params);
  const [poll, setPoll] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPoll() {
      try {
        const response = await fetch(`http://localhost:3000/polls/${id}`);
        if (!response.ok) throw new Error('Poll not found');
        const data = await response.json();
        setPoll(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPoll();
  }, [id]);

  const castVote = async (optionIndex) => {
    if (hasVoted) return;

    try {
      const response = await fetch(`http://localhost:3000/polls/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionIndex }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to vote');
      }
      const data = await response.json();
      setPoll(data.data);
      setHasVoted(true);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500 text-lg">Loading poll...</div>
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

  if (!poll) {
    return (
      <Alert className="max-w-3xl mx-auto mt-8">
        <AlertTitle>Poll not found</AlertTitle>
      </Alert>
    );
  }

  return (
      <>
                      <div className="max-w-3xl mx-auto mt-12 mb-4">
  <BackToPolls />
</div>


          <Card className="max-w-3xl mx-auto mt-12">

        <CardHeader>
          <CardTitle>
<h2 className="text-3xl font-semibold mb-6 text-gray-800">{poll.question}</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {poll.options.map((option, idx) => (
              <li key={idx} className="flex justify-between items-center p-4 border rounded-md hover:bg-gray-50 transition">
                <span className="font-medium text-gray-700">{option.text}</span>
                <div className="flex items-center space-x-4">
                  <span className="font-bold text-blue-600">{option.votes} votes</span>
                  <Button
                    size="sm"
                    disabled={hasVoted}
                    onClick={() => castVote(idx)}
                  >
                    Vote
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-right text-gray-600 mt-6 font-semibold">
            Total votes: {poll.totalVotes}
          </p>
          {hasVoted && (
        <Alert className="mb-4 border border-green-400 bg-green-50 text-green-700 rounded-md p-4">
          <AlertTitle className="font-semibold text-green-800">Success</AlertTitle>
              <AlertDescription>Successfully cast vote</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      </>
  );
}