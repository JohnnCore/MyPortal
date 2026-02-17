import { useState } from 'react';

import { ChevronRight } from 'lucide-react';

import { IssueComment } from './IssueComment';
import { IssueCommentsProps } from './IssueComments.types';
import AddCommentTextarea from '../../../common/EditableTextarea/AddCommentTextarea';
import { useCreateComment, useIssueComments } from '../../../../hooks/Issues/useIssue';

const quickReactions = [
  { emoji: '🎉', text: 'Looks good!' },
  { emoji: '👋', text: 'Need help?' },
  { emoji: '🚫', text: 'This is blocked...' },
  { emoji: '💡', text: 'Can you clarify...?' },
  { emoji: '✅', text: '' },
];

export const IssueComments = ({ issueId, projectId }: IssueCommentsProps) => {
  // Comment draft state for AddCommentTextarea
  const [commentDraft, setCommentDraft] = useState<string>('');

  const { comments, isLoading: isCommentsLoading } = useIssueComments({
    id: issueId,
    projectId: projectId,
  });

  const { handleCreate: handleCreateComment } = useCreateComment({
    id: issueId,
    projectId: projectId,
  });

  const handleClickReaction = (reaction: { emoji: string; text?: string }) => {
    setCommentDraft(reaction.text ? `${reaction.emoji} ${reaction.text}` : reaction.emoji);
  };

  return (
    <div className="mt-4">
      <div className="flex gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium shrink-0">
          CF
        </div>

        <div className="flex-1 min-w-0">
          <div className="rounded-md p-3 mb-2 border bg-input-background border-gray-700">
            <AddCommentTextarea
              value={commentDraft}
              onChange={setCommentDraft}
              onSave={(comment) => {
                handleCreateComment(comment);
                setCommentDraft('');
              }}
              placeholder="Add a comment..."
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {quickReactions.map((r, i) => (
              <button
                key={i}
                className="px-2 sm:px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs flex items-center gap-1 sm:gap-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label={`Quick reaction: ${r.text || r.emoji}`}
                onClick={() => handleClickReaction(r)}
              >
                <span>{r.emoji}</span>
                {r.text && <span className="hidden sm:inline">{r.text}</span>}
              </button>
            ))}

            <button
              className="p-1 text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Show more reactions"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="mt-2 text-xs text-gray-400">
            Pro tip: press <kbd className="px-1 py-0.5 bg-gray-700 rounded">M</kbd>
            to comment
          </div>

          {/* Comment Section */}
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2 text-gray-200">Comments</h4>
            {isCommentsLoading ? (
              <div className="text-gray-400 text-sm">Loading comments...</div>
            ) : comments && Array.isArray(comments.data) && comments.data.length > 0 ? (
              <ul className="space-y-4">
                {comments.data.map((comment) => (
                  <IssueComment key={comment.id} comment={comment} />
                ))}
              </ul>
            ) : (
              <div className="text-gray-400 text-sm">No comments yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
