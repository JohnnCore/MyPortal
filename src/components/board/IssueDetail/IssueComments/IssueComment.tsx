import { Comment } from '../../../../types';

export const IssueComment = ({ comment }: { comment: Comment }) => {
  return (
    <li className="p-3 rounded-md border border-gray-700">
      <div className="grid grid-cols-[auto_1fr] gap-3">
        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-medium shrink-0">
          {comment.user?.username.charAt(0).toUpperCase() || 'U'}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-gray-200 text-sm font-semibold">
              {comment.user?.username || 'User'}
            </span>
            <span className="text-gray-500 text-xs ml-2">
              {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ''}
            </span>
          </div>

          <div className="text-gray-300 text-sm whitespace-pre-line">{comment.content}</div>
        </div>
      </div>
    </li>
  );
};
