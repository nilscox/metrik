import cx from 'classnames';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';

export const Tabs: React.FC = ({ children }) => {
  return (
    <div role="tablist" className="border-b border-gray-200">
      {children}
    </div>
  );
};

type TabProps = {
  link?: string;
};

export const Tab: React.FC<TabProps> = ({ link = '', children }) => {
  const resolved = useResolvedPath(link);
  const active = Boolean(useMatch({ path: resolved.pathname }));

  return (
    <Link
      to={link}
      role="tab"
      aria-selected={active}
      className={cx(
        'inline-block bg-none px-4 py-1 no-underline text-inherit',
        active && 'border-b-2 border-blue-600',
      )}
    >
      {children}
    </Link>
  );
};

type TabPanelProps = {
  className?: string;
};

export const TabPanel: React.FC<TabPanelProps> = ({ className, children }) => {
  return (
    <div role="tabpanel" className={className}>
      {children}
    </div>
  );
};
