import { HiOutlineSearch, HiOutlineFilter, HiX } from 'react-icons/hi';

const SearchFilter = ({ search, onSearchChange, status, onStatusChange, priority, onPriorityChange, onClear }) => {
  const hasFilters = search || status || priority;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Status filter */}
      <div className="relative">
        <HiOutlineFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="pl-9 pr-8 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm bg-white appearance-none min-w-[140px]"
        >
          <option value="">All Status</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {/* Priority filter */}
      <select
        value={priority}
        onChange={(e) => onPriorityChange(e.target.value)}
        className="px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm bg-white min-w-[140px]"
      >
        <option value="">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      {/* Clear filters */}
      {hasFilters && (
        <button
          onClick={onClear}
          className="flex items-center space-x-1 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors whitespace-nowrap"
        >
          <HiX className="w-4 h-4" />
          <span>Clear</span>
        </button>
      )}
    </div>
  );
};

export default SearchFilter;
