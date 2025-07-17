'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BackToPolls from '../components/BackToPolls';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function CreatePollPage() {
  const router = useRouter();

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  const isQuestionValid = () => question.trim().length > 0;
  const isOptionValid = (opt) => opt.trim().length > 0;
  const allOptionsValid = () => options.length >= 2 && options.every(isOptionValid);
  const isFormValid = () => isQuestionValid() && allOptionsValid();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.trim(),
          options: options.map(opt => opt.trim()),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create poll');
      }

      setSuccessMsg('Poll created successfully!');
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded shadow mt-12 font-sans">
      <BackToPolls />
      <h1 className="text-3xl font-bold mb-6">Create a New Poll</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {successMsg && (
        <Alert className="mb-4 border border-green-400 bg-green-50 text-green-700 rounded-md p-4">
          <AlertTitle className="font-semibold text-green-800">Success</AlertTitle>
          <AlertDescription>{successMsg}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Question */}
        <label className="block mb-2 font-semibold text-gray-700" htmlFor="question">
          Question
        </label>
        <input
          id="question"
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          className={`w-full mb-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
            !isQuestionValid()
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="Enter your poll question"
          aria-describedby="question-error"
          required
        />
        {!isQuestionValid() && (
          <p id="question-error" className="mb-4 text-sm text-red-600">
            This field cannot be blank.
          </p>
        )}

        {/* Options */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700">Options</label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center mb-3">
              <input
                type="text"
                value={option}
                onChange={e => updateOption(index, e.target.value)}
                className={`flex-grow px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                  !isOptionValid(option)
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder={`Option ${index + 1}`}
                aria-describedby={`option-error-${index}`}
                required
              />
              {options.length > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOption(index)}
                  className="ml-3 text-red-600 hover:bg-red-100 transition"
                  aria-label={`Remove option ${index + 1}`}
                >
                  &times;
                </Button>
              )}
            </div>
          ))}

          {options.some(option => !isOptionValid(option)) && (
            <p className="mb-4 text-sm text-red-600">
              Options cannot be blank.
            </p>
          )}

          <Button
            type="button"
            onClick={addOption}
            variant="outline"
            className="mt-2 font-semibold"
          >
            + Add Option
          </Button>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          disabled={!isFormValid() || loading}
          className="w-full"
        >
          {loading ? 'Creating...' : 'Create Poll'}
        </Button>
      </form>
    </div>
  );
}