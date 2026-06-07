'use client';

import React, { useState } from 'react';

interface CommentFormProps {
  postId: string;
  onCommentSubmitted: (comment: any) => void;
}

export default function CommentForm({ postId, onCommentSubmitted }: CommentFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !comment.trim()) {
      setErrorMessage('Name and comment are required.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || undefined,
          comment: comment.trim(),
          postId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit comment. Please try again.');
      }

      // Append comment to local UI list in "awaiting moderation" status
      onCommentSubmitted({
        _id: `temp-${Date.now()}`,
        name: name.trim(),
        comment: comment.trim(),
        _createdAt: new Date().toISOString(),
        approved: false, // Flag indicating it is pending approval
      });

      setStatus('success');
      setName('');
      setEmail('');
      setComment('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center max-w-lg mx-auto">
        <span className="material-symbols-outlined text-4xl text-emerald-600 mb-2">
          verified
        </span>
        <h3 className="text-base font-bold text-emerald-800 mb-1 font-display">
          Comment Submitted
        </h3>
        <p className="text-xs text-emerald-700 leading-relaxed mb-4">
          Thank you! Your comment has been registered and is awaiting moderation before showing up publicly on the website.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-xs font-bold text-emerald-800 underline hover:text-emerald-950 transition-colors"
        >
          Submit another comment
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto bg-[var(--color-neutral-50)] border border-[var(--color-neutral-200)] p-6 rounded-lg">
      <h3 className="text-base font-bold text-[#1A3A5C] font-display flex items-center gap-1.5 border-b border-[var(--color-neutral-200)] pb-2 mb-2">
        <span className="material-symbols-outlined text-base">chat_bubble</span>
        <span>Leave a Comment</span>
      </h3>

      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded p-3 text-xs text-red-700 font-medium flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm">error</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-xs font-bold text-surwash-navy mb-1.5 font-sans">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            disabled={status === 'submitting'}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-base sm:text-sm border border-[var(--color-neutral-300)] rounded px-3 py-2 bg-white text-[var(--color-neutral-800)] focus:ring-1 focus:ring-surwash-blue focus:border-surwash-blue outline-none disabled:bg-[var(--color-neutral-100)]"
            placeholder="John Doe"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs font-bold text-surwash-navy mb-1.5 font-sans">
            Email <span className="text-[var(--color-neutral-400)] font-normal">(optional - never shared)</span>
          </label>
          <input
            type="email"
            id="email"
            disabled={status === 'submitting'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-base sm:text-sm border border-[var(--color-neutral-300)] rounded px-3 py-2 bg-white text-[var(--color-neutral-800)] focus:ring-1 focus:ring-surwash-blue focus:border-surwash-blue outline-none disabled:bg-[var(--color-neutral-100)]"
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="comment" className="block text-xs font-bold text-surwash-navy mb-1.5 font-sans">
          Comment <span className="text-red-500">*</span>
        </label>
        <textarea
          id="comment"
          disabled={status === 'submitting'}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full text-base sm:text-sm border border-[var(--color-neutral-300)] rounded px-3 py-2 bg-white text-[var(--color-neutral-800)] focus:ring-1 focus:ring-surwash-blue focus:border-surwash-blue outline-none disabled:bg-[var(--color-neutral-100)]"
          placeholder="Share your feedback or questions..."
          required
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-surwash-navy text-white text-xs font-bold hover:bg-surwash-blue transition-colors duration-150 disabled:bg-[var(--color-neutral-300)] cursor-pointer flex items-center justify-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-surwash-blue"
      >
        {status === 'submitting' ? (
          <>
            <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-sm">send</span>
            <span>Post Comment</span>
          </>
        )}
      </button>
    </form>
  );
}
