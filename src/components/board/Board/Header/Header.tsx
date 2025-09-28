interface HeaderProps {
  onCreateIssue: () => void;
  onHover?: () => void;
}

const Header = ({ onCreateIssue, onHover }: HeaderProps) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Work Items Board
      </h1>
      <button
        onClick={onCreateIssue}
        onMouseEnter={onHover}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Create Issue
      </button>
    </div>
  );
};

export default Header;
