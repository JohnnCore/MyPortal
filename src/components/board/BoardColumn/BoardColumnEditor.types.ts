import { MetaResponse } from '../../../types';

export interface Props {
  status: MetaResponse;
  count: number;
  isLoading?: boolean;
  onSave?: (statusId: number, newName: string) => void | Promise<void>;
  onCancel?: () => void;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  canMoveLeft?: boolean;
  canMoveRight?: boolean;
}
