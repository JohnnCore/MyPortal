import useProjectForm from '../../../hooks/context/useProjectForm';
import StepBoardStatus from './Steps/StepBoardStatus';
import StepIndicator from './Steps/StepIndicator';
import StepProjectName from './Steps/StepProjectName';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProjectFormWizardProps, ProjectData } from './Wizard.types';

const ProjectFormWizard = ({ onSubmit }: ProjectFormWizardProps) => {
  const {
    currentStep,
    nextStep,
    prevStep,
    projectName,
    projectKey,
    stories,
    boardStatuses,
    resetForm,
  } = useProjectForm();

  const canProceed = () => {
    if (currentStep === 1) return projectName.trim() !== '' && projectKey.trim() !== '';
    // if (currentStep === 2) return stories.length > 0;
    if (currentStep === 2) return boardStatuses.length > 0;
    return false;
  };

  const handleFinish = () => {
    const project: ProjectData = {
      name: projectName.trim(),
      projectKey: projectKey.trim(),
      stories,
      boardStatuses,
    };

    onSubmit?.(project);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-body-background p-8">
      <div className="max-w-3xl mx-auto bg-neutral-800 rounded-2xl shadow-xl p-8 text-neutral-100">
        <StepIndicator />

        <div className="mb-8">
          {currentStep === 1 && <StepProjectName />}
          {/* {currentStep === 2 && <StepStories />} */}
          {currentStep === 2 && <StepBoardStatus />}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-2 bg-neutral-700 text-neutral-200 rounded-lg hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          {currentStep < 2 ? (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Create Project
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectFormWizard;
