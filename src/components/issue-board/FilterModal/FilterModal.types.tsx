import { MetaResponse } from '../../../types';

export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  statuses?: MetaResponse[];
  types?: MetaResponse[];
  priorities?: MetaResponse[];
  selectedStatuses?: number[];
  selectedTypes?: number[];
  selectedPriorities?: number[];
  onStatusFilter?: (statusIds: number[]) => void;
  onTypeFilter?: (typeIds: number[]) => void;
  onPriorityFilter?: (priorityIds: number[]) => void;
  onClearAll?: () => void;
}
