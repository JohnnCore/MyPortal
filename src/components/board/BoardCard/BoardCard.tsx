import { BoardCardProps } from "./BoardCard.types";
import { memo } from "react";

const BoardCard = memo(({ item, onClick }: BoardCardProps) => {
  return (
    <div
      key={item.id}
      className="p-4 bg-white rounded-lg shadow-sm cursor-grab hover:shadow-md transition-shadow duration-200 dark:bg-card-background dark:text-white"
      draggable
      onClick={() => onClick?.(item)}
    >
      <h3 className="text-lg font-bold">
        {item.typeId === 1 ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="inline-block w-5 h-5 mr-2 text-blue-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="inline-block w-5 h-5 mr-2 text-red-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {item.title}
      </h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {item.description}
      </p>
    </div>
  );
});

BoardCard.displayName = "CardBoard";

export default BoardCard;
