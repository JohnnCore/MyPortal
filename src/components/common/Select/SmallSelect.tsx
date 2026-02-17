import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import type { MetaResponse } from '../../../types';

interface JiraSelectProps {
  options: MetaResponse[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onSave: (status: MetaResponse) => void;
}

export const JiraSelect: React.FC<JiraSelectProps> = ({
  options,
  selectedId,
  onSelect,
  onSave,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const [showModal, setShowModal] = useState<'create' | 'edit' | null>(null);

  const [formData, setFormData] = useState<MetaResponse>({
    id: 0,
    name: '',
  });

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const selectedOption = options.find((opt) => opt.id === selectedId) || null;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowModal(null);
        setHighlightedIndex(0);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusSelect = (id: number) => {
    onSelect(id);
    setIsOpen(false);
    setHighlightedIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showModal) return;

    if (!isOpen) {
      if (['Enter', ' ', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    const totalItems = options.length + 2; // includes create & edit

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % totalItems);
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + totalItems) % totalItems);
    }

    if (e.key === 'Enter') {
      e.preventDefault();

      if (highlightedIndex < options.length) {
        handleStatusSelect(options[highlightedIndex].id);
      } else {
        const menuIndex = highlightedIndex - options.length;

        if (menuIndex === 0) openCreateModal();
        else if (menuIndex === 1) openEditModal();
      }
    }

    if (['Escape', 'Tab'].includes(e.key)) {
      setIsOpen(false);
      setHighlightedIndex(0);
    }
  };

  const openCreateModal = () => {
    setFormData({ id: 0, name: '' });
    setShowModal('create');
    setIsOpen(false);
  };

  const openEditModal = () => {
    if (!selectedOption) return;

    setFormData({
      id: selectedOption.id,
      name: selectedOption.name,
    });

    setShowModal('edit');
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    // One function handles both create & update
    onSave({
      id: formData.id || 0,
      name: formData.name,
    });

    closeModal();
  };

  const closeModal = () => {
    setShowModal(null);
    setIsOpen(false);
    setFormData({ id: 0, name: '' });
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((v) => !v)}
        onKeyDown={handleKeyDown}
        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
      >
        <span>{selectedOption?.name || 'Select status'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && !showModal && (
        <div className="absolute left-0 mt-2 w-56 bg-gray-800 rounded-md shadow-xl border border-gray-700 overflow-hidden z-50">
          <div className="py-2">
            {options.map((opt, index) => (
              <button
                key={opt.id}
                onClick={() => handleStatusSelect(opt.id)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`w-full px-4 py-2 text-left flex items-center gap-2 ${
                  highlightedIndex === index ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`}
              >
                <span className="text-white text-sm">{opt.name}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-gray-700" />

          <div className="py-2">
            <button
              onClick={openCreateModal}
              onMouseEnter={() => setHighlightedIndex(options.length)}
              className={`w-full px-4 py-2 text-left text-gray-300 text-sm ${
                highlightedIndex === options.length ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              Create status
            </button>

            <button
              onClick={openEditModal}
              onMouseEnter={() => setHighlightedIndex(options.length + 1)}
              className={`w-full px-4 py-2 text-left text-gray-300 text-sm ${
                highlightedIndex === options.length + 1 ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              Edit status
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="absolute left-0 mt-2 w-96 bg-gray-900 rounded-md shadow-xl border border-gray-700 z-50">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">
              {showModal === 'create' ? 'Create status' : 'Edit status'}
            </h2>

            <button onClick={closeModal} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Name <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
              required
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-700 mt-6">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-gray-300 hover:text-white text-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
              >
                {showModal === 'create' ? 'Create' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
