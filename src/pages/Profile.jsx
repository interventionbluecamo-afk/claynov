import { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Zap, Check, Edit2, Save, X, LogOut } from 'lucide-react';
import { getCurrentUser, signOut, updateUserProfile } from '../utils/supabaseAuth';
import { toast } from '../components/Toast';

export default function Profile({ onBack, user, setUser }) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isPro, setIsPro] = useState(user?.isPro || false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user?.id) {
      toast.error('User not found');
      return;
    }

    setLoading(true);
    try {
      // Update profile in Supabase
      if (user.id && name !== user.name) {
        await updateUserProfile(user.id, { name });
      }

      // Update local state
      const updatedUser = { ...user, name };
      setUser(updatedUser);
      
      // Update localStorage (for backward compatibility)
      if (user.id) {
        localStorage.setItem('clay_current_user', JSON.stringify(updatedUser));
      }

      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      toast.success('Signed out successfully');
      onBack();
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between max-w-2xl mx-auto">
          <button 
            onClick={onBack}
            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-gray-100 active:scale-95 transition-all"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <span className="text-xl font-bold text-gray-900">Profile</span>
          <div className="w-9" /> {/* Spacer */}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-900 text-white text-2xl font-bold flex items-center justify-center">
              {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {user?.name || 'User'}
              </h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            {isPro && (
              <div className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-sm font-bold rounded-full flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                Pro
              </div>
            )}
          </div>

          {/* Edit Name */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 outline-none transition-all"
                    placeholder="Your name"
                  />
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setName(user?.name || '');
                    }}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-900">{name || 'Not set'}</span>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-all"
                    aria-label="Edit name"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{user?.email}</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
            </div>

            {/* Pro Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Type
              </label>
              <div className={`p-4 rounded-xl border-2 ${
                isPro 
                  ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isPro ? (
                      <>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">Clay Pro</div>
                          <div className="text-sm text-gray-600">Unlimited optimizations</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">Free Account</div>
                          <div className="text-sm text-gray-600">3 free optimizations</div>
                        </div>
                      </>
                    )}
                  </div>
                  {!isPro && (
                    <button
                      onClick={() => {
                        localStorage.setItem('clay_profile_upgrade_click', 'true');
                        onBack();
                      }}
                      className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 active:scale-95 transition-all"
                    >
                      Upgrade to Pro
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="space-y-3">
          <button
            onClick={handleSignOut}
            className="w-full h-14 bg-white border-2 border-gray-200 text-gray-900 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-[0.98] transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

