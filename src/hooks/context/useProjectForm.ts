import { useContext } from 'react';
import { ProjectFormContext } from '../../context/ProjectForm/context';
import { ProjectFormContextType } from '../../context/ProjectForm/types';

// Custom hook to access the ProjectForm context
const useProjectForm = (): ProjectFormContextType => {
  const context = useContext(ProjectFormContext);

  if (!context) {
    throw new Error('useProjectForm must be used within a ProjectFormProvider');
  }

  return context;
};

export default useProjectForm;
