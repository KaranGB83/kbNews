import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../lib/axios";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../lib/utils";
import AdminUsersTab from "./AdminUsersTab";
import AdminArticlesTab from "./AdminArticlesTab";
import {
  ShieldAlert,
  Users,
  Newspaper,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  ArrowLeft,
  RefreshCw,
  FolderTree,
} from "lucide-react";

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("users"); // "users" | "articles" | "overview"
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const { data } = await axios.get("/admin/stats");
      setStats(data.stats);
    } catch (error) {
      console.error("Failed to load admin stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-base-300">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-warning badge-sm gap-1 font-semibold uppercase tracking-wider">
              <ShieldAlert size={12} /> Admin Console
            </span>
            <span className="text-xs text-base-content/50">
              Django-inspired fast portal manager
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            kbNews <span className="text-primary">Control Center</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            className="btn btn-ghost btn-sm gap-1 text-xs"
            title="Refresh statistics"
          >
            <RefreshCw size={14} className={loadingStats ? "animate-spin" : ""} />
            Refresh
          </button>
          <Link to="/" className="btn btn-outline btn-sm gap-2">
            <ArrowLeft size={16} /> View Live Portal
          </Link>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Users */}
        <div className="stat bg-base-200 border border-base-300 rounded-2xl p-4">
          <div className="stat-figure text-primary">
            <Users size={28} />
          </div>
          <div className="stat-title text-xs font-semibold text-base-content/60">Total Users</div>
          <div className="stat-value text-2xl font-black mt-1">
            {loadingStats ? "..." : stats?.users?.total || 0}
          </div>
          <div className="stat-desc text-xs mt-1 text-base-content/60">
            +{stats?.users?.newLast7Days || 0} joined in last 7 days
          </div>
        </div>

        {/* Verification Status */}
        <div className="stat bg-base-200 border border-base-300 rounded-2xl p-4">
          <div className="stat-figure text-success">
            <CheckCircle size={28} />
          </div>
          <div className="stat-title text-xs font-semibold text-base-content/60">Verified Accounts</div>
          <div className="stat-value text-2xl font-black text-success mt-1">
            {loadingStats ? "..." : stats?.users?.verified || 0}
          </div>
          <div className="stat-desc text-xs mt-1 text-warning flex items-center gap-1 font-medium">
            <AlertCircle size={12} />
            {stats?.users?.unverified || 0} pending verification
          </div>
        </div>

        {/* Total Articles */}
        <div className="stat bg-base-200 border border-base-300 rounded-2xl p-4">
          <div className="stat-figure text-secondary">
            <Newspaper size={28} />
          </div>
          <div className="stat-title text-xs font-semibold text-base-content/60">Total Articles</div>
          <div className="stat-value text-2xl font-black mt-1">
            {loadingStats ? "..." : stats?.articles?.total || 0}
          </div>
          <div className="stat-desc text-xs mt-1 text-base-content/60">
            +{stats?.articles?.newLast7Days || 0} published this week
          </div>
        </div>

        {/* Active Admins */}
        <div className="stat bg-base-200 border border-base-300 rounded-2xl p-4">
          <div className="stat-figure text-warning">
            <ShieldAlert size={28} />
          </div>
          <div className="stat-title text-xs font-semibold text-base-content/60">System Admins</div>
          <div className="stat-value text-2xl font-black text-warning mt-1">
            {loadingStats ? "..." : stats?.users?.admins || 1}
          </div>
          <div className="stat-desc text-xs mt-1 text-base-content/60">
            Current session: {user?.name}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-base-300 mb-6">
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 px-4 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "users"
              ? "border-primary text-primary"
              : "border-transparent text-base-content/60 hover:text-base-content"
          }`}
        >
          <Users size={16} /> Users Management
          <span className="badge badge-sm badge-neutral">
            {stats?.users?.total || 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("articles")}
          className={`pb-3 px-4 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "articles"
              ? "border-primary text-primary"
              : "border-transparent text-base-content/60 hover:text-base-content"
          }`}
        >
          <Newspaper size={16} /> News & Articles
          <span className="badge badge-sm badge-neutral">
            {stats?.articles?.total || 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 px-4 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "overview"
              ? "border-primary text-primary"
              : "border-transparent text-base-content/60 hover:text-base-content"
          }`}
        >
          <TrendingUp size={16} /> Activity & Categories
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "users" && <AdminUsersTab />}

      {activeTab === "articles" && <AdminArticlesTab />}

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Categories breakdown */}
          <div className="bg-base-200 border border-base-300 rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <FolderTree size={20} className="text-primary" /> Articles by Category
            </h3>
            {stats?.articles?.byCategory?.length === 0 ? (
              <p className="text-sm text-base-content/50">No articles published yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {stats?.articles?.byCategory?.map((cat) => (
                  <div key={cat.category} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{cat.category}</span>
                    <span className="badge badge-primary badge-outline font-bold">
                      {cat.count} stories
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Registrations */}
          <div className="bg-base-200 border border-base-300 rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Users size={20} className="text-primary" /> Recent Registrations
            </h3>
            {stats?.recentUsers?.length === 0 ? (
              <p className="text-sm text-base-content/50">No users found.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {stats?.recentUsers?.map((u) => (
                  <div key={u._id} className="flex items-center justify-between text-sm py-1 border-b border-base-300/40 last:border-none">
                    <div>
                      <div className="font-semibold">{u.name}</div>
                      <div className="text-xs text-base-content/50">{u.email}</div>
                    </div>
                    <span className="text-xs text-base-content/60">
                      {formatDate(u.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
