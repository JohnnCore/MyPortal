import useProjectForm from '../../../../hooks/context/useProjectForm';
import { WIZARD_STEPS } from '../../../../utils/constants';
import { Check } from 'lucide-react';

const StepIndicator = () => {
  const { currentStep } = useProjectForm();

  return (
    <nav className="flex items-center justify-center mb-8 gap-2" aria-label="Progress indicator">
      {WIZARD_STEPS.map((step, index) => (
        <>
          <div key={step}>
            <div
              className="flex items-center"
              aria-current={currentStep === index + 1 ? 'step' : undefined}
              aria-label={`Step ${index + 1}: ${step}${
                currentStep > index + 1
                  ? ' (completed)'
                  : currentStep === index + 1
                    ? ' (current)'
                    : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep > index + 1
                    ? 'bg-green-500 text-white'
                    : currentStep === index + 1
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                }`}
              >
                {currentStep > index + 1 ? <Check size={16} /> : index + 1}
              </div>
              <span
                className={`ml-2 text-sm ${
                  currentStep === index + 1 ? 'font-semibold' : 'text-gray-500'
                }`}
              >
                {step}
              </span>
            </div>
          </div>
          {index < WIZARD_STEPS.length - 1 && (
            <div
              className={`w-12 h-0.5 ${currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'}`}
            />
          )}
        </>
      ))}
    </nav>
  );
};

export default StepIndicator;
