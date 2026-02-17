import { ReactNode } from 'react';

export interface GenericBoardCardProps<T> {
  item: T;
  title: string;
  description?: string | null;
  renderIcon?: () => ReactNode;
  onClick?: (item: T) => void;
  className?: string;
}
