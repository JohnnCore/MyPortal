import { createContext } from 'react';
import { ProjectFormContextType } from './types';

// Create the context
export const ProjectFormContext = createContext<ProjectFormContextType | undefined>(undefined);
