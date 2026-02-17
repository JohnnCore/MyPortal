import { useState } from 'react';
import useProjectForm from '../../../../hooks/context/useProjectForm';
import { Story, storyTypes } from '../../../../context/ProjectForm/types';
import cn from '../../../../utils/cn';

const getStoryTypeBadgeClasses = (type: Story['type']): string => {
  const colorMap: Record<Story['type'], string> = {
    bug: 'bg-red-100 text-red-700',
    fix: 'bg-yellow-100 text-yellow-700',
    feature: 'bg-green-100 text-green-700',
    task: 'bg-purple-100 text-purple-700',
  };
  return colorMap[type] || 'bg-blue-100 text-blue-700';
};

const StepStories = () => {
  const { stories, addStory, removeStory } = useProjectForm();
  const [newStory, setNewStory] = useState<Omit<Story, 'id'>>({
    title: '',
    type: 'feature',
    description: '',
  });

  const handleAddStory = () => {
    if (newStory.title.trim()) {
      addStory(newStory);
      setNewStory({ title: '', type: 'feature', description: '' });
    }
  };

  return (
    <div className="space-y-4 text-neutral-100">
      <h2 className="text-2xl font-bold">Stories</h2>

      <div className="flex gap-2">
        <input
          type="text"
          value={newStory.title}
          onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && handleAddStory()}
          placeholder="Story title..."
          className="flex-1 px-4 py-2 bg-neutral-900 text-neutral-100 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={newStory.type}
          onChange={(e) => setNewStory({ ...newStory, type: e.target.value as Story['type'] })}
          className="px-4 py-2 bg-neutral-900 text-neutral-100 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {storyTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddStory}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Add
        </button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {stories.map((story) => (
          <div
            key={story.id}
            className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={cn(
                      'px-2 py-1 text-xs font-semibold rounded',
                      getStoryTypeBadgeClasses(story.type)
                    )}
                  >
                    {story.type}
                  </span>
                </div>
                <p className="text-neutral-100 font-medium">{story.title}</p>
              </div>
              <button
                onClick={() => removeStory(story.id)}
                className="text-neutral-300 hover:text-red-400 transition"
              >
                X
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepStories;
