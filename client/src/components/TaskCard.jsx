import { HiOutlinePencil, HiOutlineTrash, HiOutlineClock } from 'react-icons/hi';

const priorityStyles = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

const statusStyles = {
  todo: 'bg-gray-100 text-gray-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  done: 'bg-emerald-100 text-emerald-700',
};

const statusLabels = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900 line-clamp-1 flex-1 mr-2">
          {task.title}
        </h3>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
            title="Edit task"
          >
            <HiOutlinePencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete task"
          >
            <HiOutlineTrash className="w-4 h-4" />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[task.status]}`}
          >
            {statusLabels[task.status]}
          </span>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${priorityStyles[task.priority]}`}
          >
            {task.priority}
          </span>
        </div>
        <div className="flex items-center text-xs text-gray-400">
          <HiOutlineClock className="w-3.5 h-3.5 mr-1" />
          {formatDate(task.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
