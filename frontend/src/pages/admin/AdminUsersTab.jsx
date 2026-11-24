import { useState, useEffect } from "react";
import axios from "../../lib/axios";
import toast from "react-hot-toast";
import { formatDate } from "../../lib/utils";
import {
  Search,
  UserPlus,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  Shield,
  ShieldCheck,
  User,
  Zap,
} from "lucide-react";

const AdminUsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [role, setRole] = useState("all");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Form states
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    isVerified: true,
  });

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    isVerified: false,
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search.trim()) params.search = search.trim();
      if (status !== "all") params.status = status;
      if (role !== "all") params.role = role;

      const { data } = await axios.get("/admin/users", { params });
      setUsers(data.users);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, status, role]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      fetchUsers();
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Quick 1-click verify toggle
  const handleToggleVerify = async (user) => {
    try {
      const { data } = await axios.patch(`/admin/users/${user._id}/verify`);
      toast.success(data.message);
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, isVerified: data.isVerified } : u))
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to toggle verification");
    }
  };

  // Delete user
  const handleDelete = async (user) => {
    if (!window.confirm(`Are you sure you want to delete user "${user.name}" (${user.email})? This will also remove their articles.`)) {
      return;
    }
    try {
      await axios.delete(`/admin/users/${user._id}`);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  // Create user
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/admin/users", createForm);
      toast.success("User created successfully!");
      setShowAddModal(false);
      setCreateForm({
        name: "",
        email: "",
        password: "",
        role: "user",
        isVerified: true,
      });
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create user");
    }
  };

  // Open edit modal
  const openEditModal = (u) => {
    setEditingUser(u);
    setEditForm({
      name: u.name,
      email: u.email,
      password: "",
      role: u.role || (u.isAdmin ? "admin" : "user"),
      isVerified: Boolean(u.isVerified),
    });
  };

  // Update user
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: editForm.name,
        email: editForm.email,
        role: editForm.role,
        isVerified: editForm.isVerified,
      };
      if (editForm.password.trim()) {
        payload.password = editForm.password;
      }
      await axios.put(`/admin/users/${editingUser._id}`, payload);
      toast.success("User updated successfully!");
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top action bar: Search, filters, add user */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-base-200 p-4 rounded-xl border border-base-300">
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="input input-sm input-bordered w-full pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="select select-sm select-bordered"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Statuses</option>
            <option value="verified">Verified Only</option>
            <option value="unverified">Unverified Only</option>
          </select>

          <select
            className="select select-sm select-bordered"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="user">Regular Users</option>
          </select>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary btn-sm gap-2 whitespace-nowrap"
        >
          <UserPlus size={16} /> Add User
        </button>
      </div>

      {/* Users Data Table */}
      <div className="overflow-x-auto bg-base-200 border border-base-300 rounded-xl shadow-sm">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-300/60 text-xs text-base-content/70">
              <th>User</th>
              <th>Role</th>
              <th>Status (Manual Verify)</th>
              <th>Articles</th>
              <th>Joined Date</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-12">
                  <span className="loading loading-spinner loading-md text-primary" />
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-12 text-base-content/50">
                  No users found matching your filters.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const isAdmin = u.role === "admin" || u.isAdmin;
                return (
                  <tr key={u._id} className="hover">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-primary/20 text-primary rounded-full w-9 h-9 font-bold text-sm">
                            {u.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                        </div>
                        <div>
                          <div className="font-bold flex items-center gap-1.5">
                            {u.name}
                            {isAdmin && (
                              <Shield size={14} className="text-warning inline" title="Admin User" />
                            )}
                          </div>
                          <div className="text-xs text-base-content/60">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      {isAdmin ? (
                        <span className="badge badge-warning badge-sm gap-1 font-semibold">
                          <ShieldCheck size={12} /> Admin
                        </span>
                      ) : (
                        <span className="badge badge-ghost badge-sm gap-1">
                          <User size={12} /> User
                        </span>
                      )}
                    </td>

                    <td>
                      <div className="flex items-center gap-2">
                        {u.isVerified ? (
                          <span className="badge badge-success badge-sm gap-1 text-white font-medium">
                            <CheckCircle size={12} /> Verified
                          </span>
                        ) : (
                          <span className="badge badge-warning badge-sm gap-1 font-medium">
                            <XCircle size={12} /> Unverified
                          </span>
                        )}

                        {/* Fast 1-click manual verification button */}
                        <button
                          onClick={() => handleToggleVerify(u)}
                          className={`btn btn-xs gap-1 ${
                            u.isVerified ? "btn-ghost text-base-content/50" : "btn-success btn-outline"
                          }`}
                          title={u.isVerified ? "Revoke verification" : "Manually verify this user"}
                        >
                          <Zap size={11} />
                          {u.isVerified ? "Revoke" : "Verify Now"}
                        </button>
                      </div>
                    </td>

                    <td>
                      <span className="badge badge-neutral badge-sm">
                        {u.articleCount || 0}
                      </span>
                    </td>

                    <td className="text-xs text-base-content/70">
                      {formatDate(u.createdAt)}
                    </td>

                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(u)}
                          className="btn btn-ghost btn-xs text-info"
                          title="Edit User"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(u)}
                          className="btn btn-ghost btn-xs text-error"
                          title="Delete User"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <span className="text-xs text-base-content/60">
            Showing {users.length} of {total} users
          </span>
          <div className="join">
            <button
              className="join-item btn btn-sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <button className="join-item btn btn-sm btn-active">
              Page {page} of {totalPages}
            </button>
            <button
              className="join-item btn btn-sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* MODAL: ADD USER */}
      {showAddModal && (
        <div className="modal modal-open">
          <div className="modal-box bg-base-200 border border-base-300 max-w-md">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <UserPlus size={20} className="text-primary" /> Fast Provision User
            </h3>
            <form onSubmit={handleCreateSubmit} className="flex flex-col gap-3">
              <div className="form-control">
                <label className="label py-1"><span className="label-text text-xs">Full Name</span></label>
                <input
                  type="text"
                  required
                  className="input input-bordered input-sm"
                  placeholder="Karan Sharma"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="label-text text-xs">Email</span></label>
                <input
                  type="email"
                  required
                  className="input input-bordered input-sm"
                  placeholder="user@example.com"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="label-text text-xs">Password</span></label>
                <input
                  type="password"
                  required
                  className="input input-bordered input-sm"
                  placeholder="Temporary or initial password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="label-text text-xs">Role</span></label>
                <select
                  className="select select-bordered select-sm"
                  value={createForm.role}
                  onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                >
                  <option value="user">Regular User</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="form-control mt-2">
                <label className="cursor-pointer flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-sm"
                    checked={createForm.isVerified}
                    onChange={(e) => setCreateForm({ ...createForm, isVerified: e.target.checked })}
                  />
                  <span className="label-text text-sm font-medium">
                    Pre-verify user (No email verification needed)
                  </span>
                </label>
              </div>

              <div className="modal-action mt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-ghost btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT USER */}
      {editingUser && (
        <div className="modal modal-open">
          <div className="modal-box bg-base-200 border border-base-300 max-w-md">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Edit2 size={18} className="text-primary" /> Edit User ({editingUser.name})
            </h3>
            <form onSubmit={handleUpdateSubmit} className="flex flex-col gap-3">
              <div className="form-control">
                <label className="label py-1"><span className="label-text text-xs">Full Name</span></label>
                <input
                  type="text"
                  required
                  className="input input-bordered input-sm"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="label-text text-xs">Email</span></label>
                <input
                  type="email"
                  required
                  className="input input-bordered input-sm"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="label-text text-xs">Reset Password (leave empty to keep current)</span></label>
                <input
                  type="password"
                  className="input input-bordered input-sm"
                  placeholder="New password..."
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="label-text text-xs">Role</span></label>
                <select
                  className="select select-bordered select-sm"
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                >
                  <option value="user">Regular User</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="form-control mt-2">
                <label className="cursor-pointer flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-success checkbox-sm"
                    checked={editForm.isVerified}
                    onChange={(e) => setEditForm({ ...editForm, isVerified: e.target.checked })}
                  />
                  <span className="label-text text-sm font-medium">Verified Status</span>
                </label>
              </div>

              <div className="modal-action mt-4">
                <button type="button" onClick={() => setEditingUser(null)} className="btn btn-ghost btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersTab;
