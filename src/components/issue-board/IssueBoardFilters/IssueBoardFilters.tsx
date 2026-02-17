import { useState } from 'react';
import { Search, Filter, ChevronDown, Users } from 'lucide-react';
import cn from '../../../utils/cn';
import type { IssueBoardFiltersProps } from './IssueBoardFilters.types';

export default function IssueBoardFilters({
  searchQuery = '',
  onSearchChange,
  projectMembers = [],
  onMemberFilter,
  onFilterClick,
  selectedMembers = [],
}: IssueBoardFiltersProps) {
  const [showMembersDropdown, setShowMembersDropdown] = useState(false);

  const handleMemberToggle = (memberId: number) => {
    const newSelected = selectedMembers.includes(memberId)
      ? selectedMembers.filter((id) => id !== memberId)
      : [...selectedMembers, memberId];
    onMemberFilter?.(newSelected);
  };

  const displayedMembers = projectMembers.slice(0, 5); // Show max 5 avatars
  const extraMembersCount = Math.max(0, projectMembers.length - 5);

  return (
    <div className="border-b border-neutral-700 px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left side: Search */}
        <div className="flex-1 max-w-md relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search issues"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-neutral-200 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side: Members + Filter */}
        <div className="flex items-center gap-3">
          {/* Project Members */}
          <div className="relative">
            <button
              onClick={() => setShowMembersDropdown(!showMembersDropdown)}
              className="flex items-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors text-sm text-neutral-200"
            >
              <Users className="w-4 h-4" />
              <div className="flex items-center -space-x-1">
                {displayedMembers.map((member, index) => (
                  <div
                    key={member.id}
                    className="w-6 h-6 rounded-full bg-blue-600 border-2 border-neutral-900 flex items-center justify-center text-xs font-medium text-white"
                    style={{ zIndex: displayedMembers.length - index }}
                    title={member.username}
                  >
                    {member.username.charAt(0).toUpperCase()}
                  </div>
                ))}
                {extraMembersCount > 0 && (
                  <div
                    className="w-6 h-6 rounded-full bg-neutral-600 border-2 border-neutral-900 flex items-center justify-center text-xs font-medium text-white"
                    style={{ zIndex: 0 }}
                  >
                    +{extraMembersCount}
                  </div>
                )}
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Members Dropdown */}
            {showMembersDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMembersDropdown(false)} />
                <div className="absolute right-0 top-full mt-2 w-64 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg z-20">
                  <div className="p-3 border-b border-neutral-700">
                    <h3 className="text-sm font-medium text-neutral-200">Filter by assignee</h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {projectMembers.map((member) => (
                      <button
                        key={member.id}
                        onClick={() => handleMemberToggle(member.id)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-neutral-700 transition-colors',
                          {
                            'bg-blue-600/20': selectedMembers.includes(member.id),
                          }
                        )}
                      >
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-medium text-white">
                          {member.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-neutral-200 truncate">{member.username}</div>
                          <div className="text-xs text-neutral-400 truncate">{member.email}</div>
                        </div>
                        {selectedMembers.includes(member.id) && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="p-2 border-t border-neutral-700">
                    <button
                      onClick={() => {
                        onMemberFilter?.([]);
                        setShowMembersDropdown(false);
                      }}
                      className="text-xs text-neutral-400 hover:text-neutral-200"
                    >
                      Clear all filters
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Filter Button */}
          <button
            onClick={onFilterClick}
            className="flex items-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors text-sm text-neutral-200"
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>
    </div>
  );
}
