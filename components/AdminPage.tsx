import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

export default function AdminPage() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.is_admin) {
      loadUsers();
    }
  }, [user]);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    const { users: fetchedUsers, error: err } = await getAllUsers();
    if (err) {
      setError(err);
    } else {
      setUsers(fetchedUsers);
    }
    setLoading(false);
  };

  if (!user?.is_admin) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-black text-white mb-4">Access Denied</h1>
          <p className="text-slate-400">You don't have admin privileges</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 px-4 py-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white mb-2">
              ADMIN <span className="text-red-600">PANEL</span>
            </h1>
            <p className="text-slate-400 text-sm">View all users and credentials</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadUsers}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl transition-all text-sm"
            >
              Refresh
            </button>
            <button
              onClick={logout}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl transition-all text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-600/10 border border-red-600/20 text-red-400 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Users Table */}
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-4 md:p-6 overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-slate-400">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="pb-3 text-xs font-black uppercase tracking-widest text-slate-400">ID</th>
                    <th className="pb-3 text-xs font-black uppercase tracking-widest text-slate-400">Username</th>
                    <th className="pb-3 text-xs font-black uppercase tracking-widest text-slate-400">Email</th>
                    <th className="pb-3 text-xs font-black uppercase tracking-widest text-slate-400">Admin</th>
                    <th className="pb-3 text-xs font-black uppercase tracking-widest text-slate-400">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 text-xs font-mono text-slate-300">{u.id.slice(0, 8)}...</td>
                      <td className="py-3 text-sm font-bold text-white">{u.username}</td>
                      <td className="py-3 text-sm text-slate-400">{u.email || '-'}</td>
                      <td className="py-3">
                        {u.is_admin ? (
                          <span className="bg-red-600/20 text-red-400 px-2 py-1 rounded text-xs font-bold">YES</span>
                        ) : (
                          <span className="text-slate-500 text-xs">No</span>
                        )}
                      </td>
                      <td className="py-3 text-xs text-slate-500">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-xs text-slate-600">
          <p>Total Users: {users.length}</p>
          <p className="mt-2 text-red-500/60">Note: Passwords are hashed and cannot be viewed</p>
        </div>
      </div>
    </div>
  );
}

