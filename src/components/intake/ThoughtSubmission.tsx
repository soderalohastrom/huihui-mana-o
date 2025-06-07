import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface Props {
  onSubmitted?: () => void;
}

export default function ThoughtSubmission({ onSubmitted }: Props) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitThought = useMutation(api.intake.submitThought);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await submitThought({
        content: content.trim(),
        source: "web",
        metadata: {
          timestamp: Date.now(),
        },
      });
      
      setContent("");
      onSubmitted?.();
    } catch (error) {
      console.error("Error submitting thought:", error);
      alert("Error submitting thought. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Capture Your Thoughts
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="thought-content" className="sr-only">
            Your thought
          </label>
          <textarea
            id="thought-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={isSubmitting}
          />
        </div>
        
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Submitting..." : "Capture Thought"}
        </button>
      </form>
    </div>
  );
}