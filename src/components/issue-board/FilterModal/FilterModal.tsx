import { useState } from 'react';
import { X, Search } from 'lucide-react';
import cn from '../../../utils/cn';
import { FilterModalProps } from './FilterModal.types';

export default function FilterModal({
  isOpen,
  onClose,
  statuses = [],
  types = [],
  priorities = [],
  selectedStatuses = [],
  selectedTypes = [],
  selectedPriorities = [],
  onStatusFilter,
  onTypeFilter,
  onPriorityFilter,
  onClearAll,
}: FilterModalProps) {
  const [activeSection, setActiveSection] = useState('status');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const handleStatusToggle = (statusId: number) => {
    const newSelected = selectedStatuses.includes(statusId)
      ? selectedStatuses.filter((id) => id !== statusId)
      : [...selectedStatuses, statusId];
    onStatusFilter?.(newSelected);
  };

  const handleTypeToggle = (typeId: number) => {
    const newSelected = selectedTypes.includes(typeId)
      ? selectedTypes.filter((id) => id !== typeId)
      : [...selectedTypes, typeId];
    onTypeFilter?.(newSelected);
  };

  const handlePriorityToggle = (priorityId: number) => {
    const newSelected = selectedPriorities.includes(priorityId)
      ? selectedPriorities.filter((id) => id !== priorityId)
      : [...selectedPriorities, priorityId];
    onPriorityFilter?.(newSelected);
  };

  const sections = [
    {
      id: 'status',
      label: 'Status',
      data: statuses,
      selected: selectedStatuses,
      handler: handleStatusToggle,
    },
    {
      id: 'type',
      label: 'Work type',
      data: types,
      selected: selectedTypes,
      handler: handleTypeToggle,
    },
    {
      id: 'priority',
      label: 'Priority',
      data: priorities,
      selected: selectedPriorities,
      handler: handlePriorityToggle,
    },
  ];

  const activeData = sections.find((s) => s.id === activeSection);
  const filteredData = activeData
    ? activeData.data.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <>
      {/* Overlay: clicking outside closes modal */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div className="fixed right-2 md:right-10 top-[17.5] h-[calc(50vh-4rem)] w-80 bg-neutral-900 border-l border-neutral-700 z-50 flex">
        {/* Left Sidebar - Sections */}
        <div className="w-1/3 bg-neutral-800 border-r border-neutral-700">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-700">
            <span className="text-sm font-medium text-neutral-300">Filter</span>
            <button
              onClick={onClose}
              className="p-1 hover:bg-neutral-700 rounded text-neutral-400 hover:text-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sections List */}
          <div className="py-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn('w-full text-left px-4 py-3 text-sm transition-colors', {
                  'bg-blue-600 text-white': activeSection === section.id,
                  'text-neutral-300 hover:bg-neutral-700': activeSection !== section.id,
                })}
              >
                <div className="flex items-center justify-between">
                  <span>{section.label}</span>
                  {section.selected.length > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-4.5 text-center">
                      {section.selected.length}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Content - Filter Options */}
        <div className="flex-1 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-neutral-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="text"
                placeholder={`Search ${activeData?.label.toLowerCase()}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-neutral-200 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Options */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-2">
              {filteredData.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-neutral-800 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={activeData?.selected.includes(item.id) || false}
                    onChange={() => activeData?.handler(item.id)}
                    className="w-4 h-4 text-blue-600 bg-neutral-700 border-neutral-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-neutral-200">{item.name}</span>
                </label>
              ))}

              {filteredData.length === 0 && searchQuery && (
                <div className="text-sm text-neutral-400 p-2">
                  No {activeData?.label.toLowerCase()} found
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-700">
            <button
              onClick={onClearAll}
              className="text-sm text-neutral-400 hover:text-neutral-200"
            >
              Clear all filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
