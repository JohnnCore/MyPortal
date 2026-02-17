import { NavLink } from 'react-router';
import cn from '../../../utils/cn';
import type { IssueBoardHeaderProps, HeaderTab } from './IssueBoardHeader.types';
import { TABS } from '../tabs/tabsConfig';

const defaultTabs: HeaderTab[] = TABS.map((t) => ({ id: t.id, label: t.label }));

export default function IssueBoardHeader({ tabs = defaultTabs, projectId }: IssueBoardHeaderProps) {
  return (
    <div className="border-b border-neutral-700 bg-card-background">
      <div className="flex items-center gap-1 px-6 py-3">
        {tabs.map((tab) => {
          const href = projectId
            ? tab.id === 'board'
              ? `/board/${projectId}`
              : `/board/${projectId}/${tab.id}`
            : '#';

          return (
            <NavLink
              key={tab.id}
              to={href}
              end
              className={({ isActive }) =>
                cn('flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors', {
                  'text-blue-400 border-b-2 border-blue-400': isActive,
                  'text-neutral-300 hover:text-white hover:bg-neutral-800': !isActive,
                })
              }
            >
              {tab.icon && <span className="text-base">{tab.icon}</span>}
              <span className="font-semibold">{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
