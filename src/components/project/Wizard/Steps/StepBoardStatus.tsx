import React, { useState } from 'react';
import useProjectForm from '../../../../hooks/context/useProjectForm';
import { X, Plus } from 'lucide-react';

const StepBoardStatus = () => {
  const { boardStatuses, addStatus, removeStatus, reorderStatuses } = useProjectForm();
  const [newStatus, setNewStatus] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleAddStatus = () => {
    if (newStatus.trim()) {
      addStatus(newStatus);
      setNewStatus('');
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      reorderStatuses(draggedIndex, index);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4 text-neutral-100">
      <h2 className="text-2xl font-bold">Board Status</h2>

      <div className="flex gap-2">
        <input
          type="text"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddStatus()}
          placeholder="New status..."
          className="flex-1 px-4 py-2 bg-neutral-900 text-neutral-100 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddStatus}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="space-y-2">
        {boardStatuses.map((status, index) => (
          <div
            key={status.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`bg-neutral-800 border-2 rounded-lg p-4 flex items-center justify-between cursor-move hover:shadow-md transition ${
              draggedIndex === index ? 'border-blue-400 opacity-60' : 'border-neutral-700'
            }`}
          >
            <div className="flex items-center gap-3">
              {/* <GripVertical className="text-gray-400" size={20} /> */}
              <span className="font-medium text-neutral-100">{status.name}</span>
            </div>
            <button
              onClick={() => removeStatus(status.id)}
              aria-label={`Remove ${status.name} status`}
              className="text-neutral-300 hover:text-red-400 transition"
            >
              <X />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepBoardStatus;
