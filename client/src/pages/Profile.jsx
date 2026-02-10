import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineUser, HiOutlineMail, HiOutlineCalendar, HiOutlinePencil } from 'react-icons/hi';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/profile');
        setProfile(data);
        setForm({ name: data.name, bio: data.bio || '' });
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (form.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (form.name.length > 50) {
      newErrors.name = 'Name cannot exceed 50 characters';
    }
    if (form.bio.length > 200) {
      newErrors.bio = 'Bio cannot exceed 200 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const { data } = await API.put('/profile', { name: form.name, bio: form.bio });
      setProfile(data);
      updateUser({ ...user, name: data.name, bio: data.bio });
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({ name: profile.name, bio: profile.bio || '' });
    setErrors({});
    setEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account information</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-10">
            <div className="flex items-center space-x-5">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30">
                <span className="text-3xl font-bold text-white">
                  {profile?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{profile?.name}</h2>
                <p className="text-brand-200">{profile?.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Body */}
          <div className="p-6">
            {!editing ? (
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <HiOutlineUser className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Name</p>
                    <p className="text-sm font-medium text-gray-900">{profile?.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <HiOutlineMail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                    <p className="text-sm font-medium text-gray-900">{profile?.email}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <HiOutlinePencil className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Bio</p>
                    <p className="text-sm text-gray-700">
                      {profile?.bio || (
                        <span className="text-gray-400 italic">No bio added yet</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <HiOutlineCalendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Member Since</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(profile?.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setEditing(true)}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-colors"
                  >
                    <HiOutlinePencil className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm`}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Tell us a bit about yourself..."
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.bio ? 'border-red-300' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm resize-none`}
                  />
                  <div className="flex justify-between mt-1">
                    {errors.bio && <p className="text-xs text-red-500">{errors.bio}</p>}
                    <p className="text-xs text-gray-400 ml-auto">{form.bio.length}/200</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
