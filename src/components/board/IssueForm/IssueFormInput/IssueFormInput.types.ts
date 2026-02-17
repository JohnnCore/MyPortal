import { UseFormRegister, Control, FieldErrors, UseFormWatch } from 'react-hook-form';
import { IssueFormData } from '../../../../schemas/IssueForm.schema';
import { MetaBase } from '../../../../types';

export interface IssueFormInputProps {
  register: UseFormRegister<IssueFormData>;
  control: Control<IssueFormData>;
  errors: FieldErrors<IssueFormData>;
  watch: UseFormWatch<IssueFormData>;
  isDisabled: boolean;
  projectId?: number;
  dropdownValues: {
    projects: MetaBase[];
    metaData: {
      priorities: MetaBase[];
      statuses: MetaBase[];
      types: MetaBase[];
      tags: MetaBase[];
    };
    projectMembers: MetaBase[] | [];
  };
}
