import { ReactNode } from 'react';

import { ChevronDown, ChevronRight, Plus, Settings, Zap } from 'lucide-react';

import Modal from '../../common/Modal/Modal';
import { JiraSelect } from '../../common/Select/SmallSelect';
import EditableInput from '../../common/EditableInput/EditableInput';
import EditableTextarea from '../../common/EditableTextarea/EditableTextarea';
import MultiSelect from '../../common/Select/MultiSelect';
import { IssueComments } from './IssueComments/IssueComments';
import Button from '../../common/Button/Button';
import { useIssueDetail } from '../../../hooks/board/useIssueDetail';

const IssueDetail = () => {
  const {
    projectId,
    issueId,
    isValidIds,
    issue,
    metaData,
    projectMembers,
    currentUser,
    isLoading,
    activeTab,
    setActiveTab,
    showDev,
    toggleDev,
    showAssigneeDropdown,
    toggleAssigneeDropdown,
    closeAssigneeDropdown,
    handlers,
  } = useIssueDetail();

  // Don't render if IDs are invalid or still loading
  if (!isValidIds || isLoading || !issue) {
    return null;
  }

  return (
    <Modal
      isOpen={true}
      onClose={handlers.close}
      headerContent={
        <div className="flex items-center">
          <button
            className="flex items-center gap-2 ext-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
            onClick={handlers.addEpic}
            aria-label="Add epic"
          >
            <span className="text-sm">📝 Add epic</span>
          </button>
          <span className="text-gray-300 mr-2 ml-2">/</span>
          <div className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked
              readOnly
              className="w-4 h-4 accent-blue-400"
              aria-label="Issue selected"
            />
            <span className="text-blue-400 font-semibold">{issueId}</span>
          </div>
        </div>
      }
      tooltip={
        <div className="flex items-center gap-2">
          <button
            className="p-2 hover:bg-gray-700 rounded text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={handlers.lockIssue}
            aria-label="Lock issue"
          >
            <span className="text-sm">🔒</span>
          </button>
          <div
            className="flex items-center gap-1 px-2 py-1 bg-gray-700 rounded text-sm text-gray-200"
            aria-label="Viewers"
          >
            <span className="text-sm">👁</span>
            <span className="text-sm">1</span>
          </div>
          <button
            className="p-2 hover:bg-gray-700 rounded text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={handlers.copyLink}
            aria-label="Copy link"
          >
            <span className="text-sm">🔗</span>
          </button>
          <button
            className="p-2 hover:bg-gray-700 rounded text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={handlers.moreOptions}
            aria-label="More options"
          >
            <span className="text-sm">⋯</span>
          </button>
          <button
            className="p-2 hover:bg-gray-700 rounded text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={handlers.expand}
            aria-label="Expand modal"
          >
            <span className="text-sm">⛶</span>
          </button>
        </div>
      }
      size="extra_large"
      hideYOverflow={false}
      aria-label="Issue Details Modal"
    >
      {/* panel inner content */}
      <div className="w-full h-full bg-transparent">
        {/* container that holds left+right columns and top header controls inside modal */}
        <div>
          {/* main content area: responsive columns */}
          <div className="mt-6 flex flex-col lg:flex-row gap-8">
            {/* LEFT column */}
            <div className="flex-1 lg:pr-4 min-w-0">
              {/* Title */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div className="flex-1 sm:mr-4 min-w-0">
                    <h3 className="text-2xl font-semibold text-gray-100">
                      <EditableInput value={issue.title} saveOnBlur onSave={handlers.updateTitle} />
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <JiraSelect
                      options={metaData.statuses}
                      selectedId={issue.statusId}
                      onSave={(status) => handlers.renameStatus(status.id, status.name)}
                      onSelect={handlers.updateStatus}
                    />

                    <Button className="p-2 hover:bg-gray-700 rounded text-gray-300">
                      <Zap size={18} />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-400">
                  <Button
                    className="p-1 hover:bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    aria-label="Add label"
                  >
                    <Plus size={16} />
                  </Button>
                  <Button
                    className="p-1 hover:bg-gray-700 rounded text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    aria-label="Add subtask"
                  >
                    ⊕
                  </Button>
                </div>
              </div>
              {/* Sections */}

              <Section title="Description">
                <EditableTextarea
                  value={issue.description ?? ''}
                  saveOnBlur
                  onSave={handlers.updateDescription}
                />
              </Section>
              {/* Activity */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-4">Activity</h3>

                {/* tabs */}
                <div className="flex items-center gap-4 border-b border-gray-700 pb-3">
                  {['All', 'Comments', 'History', 'Work log'].map((tab) => (
                    <Button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-2 text-sm ${
                        activeTab === tab
                          ? 'text-blue-400 border-b-2 border-blue-400'
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {tab}
                    </Button>
                  ))}

                  <button className="ml-auto p-1 hover:bg-gray-700 rounded text-gray-300">
                    <Settings size={16} />
                  </button>
                </div>

                {/* comment box */}
                <IssueComments issueId={issueId!} projectId={projectId!} />
              </div>
            </div>

            {/* RIGHT column */}
            <div className="w-full lg:w-[320px] lg:shrink-0">
              <div className="p-4 rounded-md border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium flex items-center gap-2 text-gray-100">
                    <ChevronDown size={16} />
                    Details
                  </h3>
                  <button className="p-1 hover:bg-gray-600 rounded text-gray-300">
                    <Settings size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Assignee with dropdown */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Responsável</span>
                      <div className="relative">
                        <button
                          onClick={toggleAssigneeDropdown}
                          className="text-gray-300 flex items-center gap-2 hover:bg-gray-700 px-2 py-1 rounded"
                        >
                          {issue.assigneeUser ? (
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs">
                                {issue.assigneeUser.username.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-gray-200">{issue.assigneeUser.username}</span>
                            </div>
                          ) : (
                            <span className="text-gray-300">👤 Unassigned</span>
                          )}
                          <ChevronDown size={14} />
                        </button>

                        {/* Assignee Dropdown */}
                        {showAssigneeDropdown && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={closeAssigneeDropdown} />
                            <div className="absolute right-0 top-full mt-2 w-64 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg z-20">
                              <div className="p-3 border-b border-neutral-700">
                                <h3 className="text-sm font-medium text-neutral-200">Assign to</h3>
                              </div>
                              <div className="max-h-60 overflow-y-auto">
                                {/* Unassigned option */}
                                <button
                                  onClick={() => handlers.changeAssignee(null)}
                                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-neutral-700 transition-colors"
                                >
                                  <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs">
                                    👤
                                  </div>
                                  <span className="text-sm text-neutral-200">Unassigned</span>
                                </button>
                                {/* Project members */}
                                {projectMembers?.map((member) => (
                                  <button
                                    key={member.id}
                                    onClick={() => handlers.changeAssignee(member)}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-neutral-700 transition-colors"
                                  >
                                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-medium text-white">
                                      {member.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm text-neutral-200 truncate">
                                        {member.username}
                                      </div>
                                      <div className="text-xs text-neutral-400 truncate">
                                        {member.email}
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    {currentUser && (
                      <button
                        className="text-blue-400 text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onClick={handlers.assignToMe}
                        aria-label="Assign to me"
                      >
                        Assign to me
                      </button>
                    )}
                  </div>

                  {/* Labels with MultiSelect */}
                  <div className="relative">
                    <MultiSelect
                      label="Etiquetas"
                      options={metaData.tags || []}
                      value={issue.tags || []}
                      onChange={handlers.changeLabels}
                      placeholder={
                        issue.tags && issue.tags.length > 0 ? 'Add more labels' : 'Add labels'
                      }
                      creatable
                    />
                  </div>

                  <Row label="Principal" value="Add parent" />
                  <Row label="Data limite" value="Add due date" />
                  <Row label="Team" value="Add team" />
                  <Row label="Start date" value="Add date" />

                  <div className="py-2 border-t border-gray-600">
                    <button
                      onClick={toggleDev}
                      className="flex items-center justify-between w-full text-sm"
                    >
                      <span className="text-gray-400">Development</span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${showDev ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Criador</span>
                    {issue.creatorUser ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs">
                          {issue.creatorUser.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-gray-200">{issue.creatorUser.username}</span>
                      </div>
                    ) : (
                      <span className="text-gray-300">👤 Unassigned</span>
                    )}
                  </div>
                </div>

                {/* automation block */}
                <div className="mt-6 pt-4 border-t border-gray-600">
                  <button className="flex items-center justify-between w-full mb-3">
                    <div className="flex items-center gap-2">
                      <ChevronRight size={16} />
                      <span className="font-medium text-sm text-gray-100">Automation</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Zap size={16} />
                      Rule executions
                    </div>
                  </button>

                  <div className="text-xs text-gray-400 space-y-1">
                    <div>Created {issue.createdAt}</div>
                    <div>Updated {issue.updatedAt}</div>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <button
                      className="flex items-center gap-2 text-sm text-gray-300 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onClick={handlers.configureAutomation}
                      aria-label="Configure automation"
                    >
                      <Settings size={16} />
                      Configure
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{' '}
      {/* panel inner */}
    </Modal>
  );
};

export default IssueDetail;

/* small helper components */
const Section = ({
  title,
  children,
}: {
  title: string;
  onClick?: string;
  children?: ReactNode;
}) => (
  <div className="mb-6">
    <h3 className="text-sm font-medium mb-2 text-gray-100">{title}</h3>
    {children ? <div className="text-gray-400 text-sm">{children}</div> : null}
  </div>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-gray-400">{label}</span>
    <span className="text-gray-300">{value}</span>
  </div>
);
