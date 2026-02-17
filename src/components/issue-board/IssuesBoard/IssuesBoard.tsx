import IssueBoardFilters from '../IssueBoardFilters/IssueBoardFilters';
import FilterModal from '../FilterModal/FilterModal';
import { Suspense, useState } from 'react';
import type { IssueBoardProps } from './IssuesBoard.types';
import { getTab } from '../tabs/tabsConfig';

export default function IssueBoard({
  issues,
  statuses,
  types,
  priorities,
  projectMembers,
  projectId,
  currentTab = 'board',
  isLoading = false,
  onReorder,
  onRenameStatus,
  onReorderStatus,
  onCreateCard,
  filters,
  onFilterChange,
  onClearFilters,
}: IssueBoardProps) {
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Resolve tab config — drives which content component and features are rendered
  const tabEntry = getTab(currentTab);
  const TabContent = tabEntry.Component;

  const handleFilterClick = () => {
    setShowFilterModal(!showFilterModal);
  };

  return (
    <div className="flex flex-col h-full">
      {tabEntry.showFilters && (
        <IssueBoardFilters
          searchQuery={filters.search}
          onSearchChange={(q) => onFilterChange('search', q)}
          projectMembers={projectMembers}
          onMemberFilter={(ids) => onFilterChange('assigneeIds', ids)}
          selectedMembers={filters.assigneeIds}
          onFilterClick={handleFilterClick}
        />
      )}

      {tabEntry.showFilters && (
        <FilterModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          statuses={statuses}
          types={types}
          priorities={priorities}
          selectedStatuses={filters.statusIds}
          selectedTypes={filters.typeIds}
          selectedPriorities={filters.priorityIds}
          onStatusFilter={(ids) => onFilterChange('statusIds', ids)}
          onTypeFilter={(ids) => onFilterChange('typeIds', ids)}
          onPriorityFilter={(ids) => onFilterChange('priorityIds', ids)}
          onClearAll={onClearFilters}
        />
      )}

      <div className="flex-1">
        <Suspense fallback={<div>Loading view...</div>}>
          <TabContent
            issues={issues}
            statuses={statuses}
            types={types}
            priorities={priorities}
            projectMembers={projectMembers}
            filters={filters}
            isLoading={isLoading}
            projectId={projectId}
            onReorder={onReorder}
            onRenameStatus={onRenameStatus}
            onReorderStatus={onReorderStatus}
            onCreateCard={onCreateCard}
          />
        </Suspense>
      </div>
    </div>
  );
}
