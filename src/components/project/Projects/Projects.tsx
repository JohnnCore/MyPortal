import { useState } from 'react';

import ProjectFormWizard from '../Wizard/Wizard';
import ProjectList from '../ProjectList/ProjectList';
import PageContainer from '../../common/PageContainer/PageContainer';
import { BoardStatus, Story } from '../../../context/ProjectForm/types';
import { ProjectFormProvider } from '../../../context/ProjectForm/provider';
import { useCreateProjectMutation } from '../../../redux/api/Projects/projectsApiSlice';
import Button from '../../common/Button/Button';

const Projects = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [createProject] = useCreateProjectMutation();

  const handleCreate = async (data: {
    name: string;
    projectKey: string;
    stories: Story[];
    boardStatuses: BoardStatus[];
  }) => {
    const newProject = {
      name: data.name,
      stories: data.stories,
      key: data.projectKey,
      issueStatuses: data.boardStatuses,
    };

    try {
      const created = await createProject(newProject).unwrap();
      if (created) setShowCreate(false);
    } catch (err) {
      // err is typed by RTK Query; log for now
      console.error('Create project error', err);
    }
  };

  return (
    <PageContainer>
      {!showCreate && (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">My Projects</h2>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowCreate(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Project
              </Button>

              {showCreate && (
                <Button
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-lg shadow ">
            <div className="overflow-x-auto">
              <ProjectList />
            </div>
          </div>
        </>
      )}

      {showCreate && (
        <ProjectFormProvider>
          <ProjectFormWizard onSubmit={handleCreate} />
        </ProjectFormProvider>
      )}
    </PageContainer>
  );
};

export default Projects;
