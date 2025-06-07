import { useState } from "react";
import { mockAugmentThought, type DemoThought } from "../../lib/demoData";

interface Props {
  onSubmitted?: (newThought: DemoThought) => void;
}

export default function DemoThoughtSubmission({ onSubmitted }: Props) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const augmentation = mockAugmentThought(content.trim());
      
      const newThought: DemoThought = {
        _id: `demo-${Date.now()}`,
        content: content.trim(),
        status: "completed",
        metadata: { timestamp: Date.now() },
        augmented: augmentation
      };
      
      setContent("");
      onSubmitted?.(newThought);
    } catch (error) {
      console.error("Demo error:", error);
      alert("Demo mode error - please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Capture Your Thoughts
        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">DEMO</span>
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
            placeholder="What's on your mind? (Try words like 'dream', 'task', 'feel', or 'personal' to see zone classification)"
            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={isSubmitting}
          />
        </div>
        
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Processing..." : "Capture Thought"}
        </button>
      </form>
      
      <div className="mt-4 text-xs text-gray-500 border-t pt-4">
        <p className="font-medium mb-2">🌺 Ahupuaʻa Zones:</p>
        <div className="grid grid-cols-2 gap-2">
          <div>🌋 Mauka - Visionary</div>
          <div>🌱 Kula - Practical</div>
          <div>🌊 Makai - Emotional</div>
          <div>🌫️ Kapu - Sacred</div>
        </div>
      </div>
    </div>
  );
}