// src/context/ProjectFormProvider.tsx
import { useState, ReactNode } from 'react';
import { ProjectFormContext } from './context'; // Import the context
import { Story, BoardStatus } from './types';

// Initial state values
const initialStatuses: BoardStatus[] = [
  { id: '1', name: 'To Do' },
  { id: '2', name: 'In Progress' },
  { id: '3', name: 'Done' },
];

// Provider component
export const ProjectFormProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectName, setProjectName] = useState('');
  const [projectKey, setProjectKey] = useState('');
  const [stories, setStories] = useState<Story[]>([]);
  const [boardStatuses, setBoardStatuses] = useState<BoardStatus[]>(initialStatuses);

  // Functions for managing the project form state
  const addStory = (story: Omit<Story, 'id'>) => {
    setStories((prev) => [...prev, { ...story, id: crypto.randomUUID() }]);
  };

  const removeStory = (id: string) => {
    setStories((prev) => prev.filter((story) => story.id !== id));
  };

  const addStatus = (name: string) => {
    setBoardStatuses((prev) => [...prev, { id: crypto.randomUUID(), name }]);
  };

  const removeStatus = (id: string) => {
    setBoardStatuses((prev) => prev.filter((status) => status.id !== id));
  };

  const reorderStatuses = (fromIndex: number, toIndex: number) => {
    if (
      fromIndex < 0 ||
      fromIndex >= boardStatuses.length ||
      toIndex < 0 ||
      toIndex >= boardStatuses.length
    ) {
      return; // or throw error
    }
    const updatedStatuses = [...boardStatuses];
    const [movedStatus] = updatedStatuses.splice(fromIndex, 1);
    updatedStatuses.splice(toIndex, 0, movedStatus);
    setBoardStatuses(updatedStatuses);
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);
  const resetForm = () => {
    setProjectName('');
    setStories([]);
    setBoardStatuses(initialStatuses);
    setProjectKey('');
    setCurrentStep(1);
  };

  return (
    <ProjectFormContext.Provider
      value={{
        currentStep,
        projectName,
        setProjectName,
        projectKey,
        setProjectKey,
        stories,
        addStory,
        removeStory,
        boardStatuses,
        addStatus,
        removeStatus,
        reorderStatuses,
        nextStep,
        prevStep,
        resetForm,
      }}
    >
      {children}
    </ProjectFormContext.Provider>
  );
};
