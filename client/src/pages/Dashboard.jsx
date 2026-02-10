import { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineClipboardList } from 'react-icons/hi';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import SearchFilter from '../components/SearchFilter';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Modal
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;

      const { data } = await API.get('/tasks', { params });
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, priorityFilter]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchTasks]);

  const handleCreate = async (formData) => {
    try {
      await API.post('/tasks', formData);
      toast.success('Task created!');
      setShowForm(false);
      fetchTasks(1);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create task';
      toast.error(msg);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await API.put(`/tasks/${editingTask._id}`, formData);
      toast.success('Task updated!');
      setEditingTask(null);
      setShowForm(false);
      fetchTasks(pagination.page);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update task';
      toast.error(msg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await API.delete(`/tasks/${id}`);
      toast.success('Task deleted');
      fetchTasks(pagination.page);
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const openCreate = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPriorityFilter('');
  };

  // Stats
  const statCounts = {
    total: pagination.total,
    todo: tasks.filter((t) => t.status === 'todo').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and track your tasks</p>
          </div>
          <button
            onClick={openCreate}
            className="mt-4 sm:mt-0 inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-colors shadow-sm"
          >
            <HiOutlinePlus className="w-5 h-5" />
            <span>New Task</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Total Tasks</p>
            <p className="text-2xl font-bold text-gray-900">{statCounts.total}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">To Do</p>
            <p className="text-2xl font-bold text-gray-600">{statCounts.todo}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">{statCounts.inProgress}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Done</p>
            <p className="text-2xl font-bold text-emerald-600">{statCounts.done}</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-6">
          <SearchFilter
            search={search}
            onSearchChange={setSearch}
            status={statusFilter}
            onStatusChange={setStatusFilter}
            priority={priorityFilter}
            onPriorityChange={setPriorityFilter}
            onClear={clearFilters}
          />
        </div>

        {/* Task Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <HiOutlineClipboardList className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-1">No tasks found</h3>
            <p className="text-sm text-gray-400 mb-6">
              {search || statusFilter || priorityFilter
                ? 'Try adjusting your filters'
                : 'Create your first task to get started'}
            </p>
            {!search && !statusFilter && !priorityFilter && (
              <button
                onClick={openCreate}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-colors"
              >
                <HiOutlinePlus className="w-5 h-5" />
                <span>Create Task</span>
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <TaskCard key={task._id} task={task} onEdit={openEdit} onDelete={handleDelete} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                <button
                  onClick={() => fetchTasks(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => fetchTasks(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdate : handleCreate}
          onClose={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
