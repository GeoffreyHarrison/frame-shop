"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import type { OrderComment } from "@/lib/types";

interface CommentDialogProps {
  comments: OrderComment[];
  onAddComment?: (text: string) => void;
  hasComments: boolean;
}

export function CommentDialog({
  comments: initialComments,
  onAddComment,
  hasComments,
}: CommentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(initialComments);

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    const comment: OrderComment = {
      id: `com-new-${Date.now()}`,
      author: "You",
      text: newComment.trim(),
      createdAt: new Date().toISOString(),
    };
    setComments([...comments, comment]);
    onAddComment?.(newComment.trim());
    setNewComment("");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`inline-flex p-1 rounded-md transition-colors hover:bg-gray-100 ${
          hasComments || comments.length > 0
            ? "text-green-500"
            : "text-gray-300 hover:text-gray-400"
        }`}
        title="Comments"
      >
        <MessageCircle size={18} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-gray-900">Order Comments</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 max-h-64 overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No comments yet
                </p>
              ) : (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-gray-50 rounded-md p-3"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {comment.author}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSubmit}
                  disabled={!newComment.trim()}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
