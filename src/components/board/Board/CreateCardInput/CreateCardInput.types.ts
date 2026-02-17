import type React from 'react';
import type { IssueType, IssuesPriority } from '../../../../types';

export interface CreateCardInputProps {
    /** Current title value */
    title: string;
    /** Handler for title changes */
    onTitleChange: (value: string) => void;
    /** Currently selected type ID */
    typeId: number;
    /** Handler for type selection changes */
    onTypeChange: (id: number) => void;
    /** Currently selected priority ID */
    priorityId: number;
    /** Handler for priority selection changes */
    onPriorityChange: (id: number) => void;
    /** Available issue types */
    types: IssueType[];
    /** Available priorities */
    priorities: IssuesPriority[];
    /** Handler for saving the new card */
    onSave: () => void;
    /** Handler for canceling the creation */
    onCancel: () => void;
    /** Handler for Enter key press */
    onKeyDown?: (e: React.KeyboardEvent) => void;
    /** Whether the save button is disabled */
    isDisabled?: boolean;
}
