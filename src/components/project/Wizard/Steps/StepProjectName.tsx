import useProjectForm from '../../../../hooks/context/useProjectForm';
import Input from '../../../common/Input/Input';

const StepProjectName = () => {
  const { projectName, setProjectName, projectKey, setProjectKey } = useProjectForm();

  return (
    <div className="space-y-4">
      <div className="text-neutral-100 flex flex-col gap-4">
        <label htmlFor="project-name" className="block text-2xl font-bold text-neutral-100">
          Project Name
        </label>
        <Input
          id="project-name"
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name..."
          className="w-full px-4 py-3 bg-neutral-900 text-neutral-100 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <label htmlFor="key" className="block text-2xl font-bold text-neutral-100">
          Project Key
        </label>
        <Input
          id="key"
          type="text"
          value={projectKey}
          onChange={(e) => setProjectKey(e.target.value)}
          placeholder="Enter project key..."
          className="w-full px-4 py-3 bg-neutral-900 text-neutral-100 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
      </div>
    </div>
  );
};

export default StepProjectName;
