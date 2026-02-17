import { memo } from 'react';
import { GenericBoardCardProps } from './GenericBoardCard.types';

function GenericBoardCardComponent<T>({
  item,
  title,
  description,
  renderIcon,
  onClick,
  className = '',
}: GenericBoardCardProps<T>) {
  return (
    <article
      className={`p-4 bg-white rounded-lg shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 dark:bg-card-background dark:text-white ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={() => onClick?.(item)}
      aria-label={`Card: ${title}`}
    >
      <h3 className="text-base font-semibold flex items-start gap-2">
        {renderIcon && <span className="shrink-0">{renderIcon()}</span>}
        <span className="flex-1 line-clamp-2">{title}</span>
      </h3>
      {description && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{description}</p>
      )}
    </article>
  );
}

// Memoize with generic comparison
export const GenericBoardCard = memo(GenericBoardCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.title === nextProps.title &&
    prevProps.description === nextProps.description &&
    prevProps.item === nextProps.item
  );
}) as typeof GenericBoardCardComponent;

export default GenericBoardCard;
