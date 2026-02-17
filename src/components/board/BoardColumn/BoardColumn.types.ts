import { ReactNode } from 'react';
import { MetaResponse } from '../../../types';

export interface BoardColumnProps {
  status: MetaResponse;
  children?: ReactNode;
  count: number;
  isLoading?: boolean;
  onRename?: (statusId: number, newName: string) => void | Promise<void>;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  canMoveLeft?: boolean;
  canMoveRight?: boolean;
}
