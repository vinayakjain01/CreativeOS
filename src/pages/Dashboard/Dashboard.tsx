import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Store,
  Database,
  RefreshCw,
  Image,
  Sparkles,
  CheckCircle,
  Clock,
  TrendingUp,
  Zap,
  ArrowUpRight,
  DatabaseIcon,
} from 'lucide-react';
import { clsx } from 'clsx';
import {
  useDashboardStore,
  useStoresStore,
  useJobsStore,
  useActivitiesStore,
  useInsightsStore,
} from '../../stores';
import { useAuth } from '../../lib/auth';
import { getSupabase } from '../../lib/supabase';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const { user } = useAuth();
  const { stats, loading: statsLoading, source, fetch: fetchStats } = useDashboardStore();
  const { primaryStore, fetchPrimary } = useStoresStore();
  const { counts, fetchCounts } = useJobsStore();
  const { activities, fetch: fetchActivities } = useActivitiesStore();
  const { insights, fetch: fetchInsights } = useInsightsStore();

  const isDemo = source === 'demo' || !getSupabase();
  const greetingName = user?.email ? user.email.split('@')[0] : 'there';

  useEffect(() => {
    if (getSupabase()) {
      fetchStats();
      fetchPrimary();
      fetchCounts();
      fetchActivities();
      fetchInsights();
    }
  }, [fetchStats, fetchPrimary, fetchCounts, fetchActivities, fetchInsights]);

  const processingJobs = stats?.processing ?? counts.processing;
  const queuedJobs = stats?.queued ?? counts.queued;
  const storeName = primaryStore?.name || stats?.primaryStore?.name || 'No store connected';
  const storeProducts = primaryStore?.productsCount || stats?.primaryStore?.productsCount || 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-6 space-y-6"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="relative overflow-hidden">
        <div className="card-lg p-6 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-heading-xl font-bold mb-2 capitalize">
                  Welcome back, {greetingName}
                </h2>
                <p className="text-primary-100 text-body-lg">
                  {statsLoading
                    ? 'Loading your dashboard...'
                    : isDemo
                    ? 'Demo mode — connect Supabase for live data'
                    : 'Your automation is running smoothly. Everything is up to date.'}
                </p>
              </div>
              <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-success-400 animate-pulse" />
                <span className="text-body-sm font-medium">
                  {isDemo ? 'Demo data' : 'All systems operational'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Connected Store */}
              <div className="p-4 rounded-card bg-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <Store size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="text-caption text-primary-200">Connected Store</div>
                    <div className="font-semibold truncate">{storeName}</div>
                  </div>
                  {primaryStore && <CheckCircle size={18} className="text-success-400" />}
                </div>
                <div className="flex items-center gap-2 text-body-sm">
                  <span className="text-primary-200">Products:</span>
                  <span className="font-medium">{storeProducts.toLocaleString()}</span>
                </div>
              </div>

              {/* Meta Catalog */}
              <div className="p-4 rounded-card bg-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <Database size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="text-caption text-primary-200">Meta Catalog</div>
                    <div className="font-semibold">{isDemo ? 'Demo' : 'Connected'}</div>
                  </div>
                  {isDemo && <DatabaseIcon size={18} className="text-warning-300" />}
                </div>
                <div className="flex items-center gap-2 text-body-sm">
                  <span className="text-primary-200">Health:</span>
                  <span className="font-medium">{stats ? '96%' : '—'}</span>
                </div>
              </div>

              {/* Feed Status */}
              <div className="p-4 rounded-card bg-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <RefreshCw size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="text-caption text-primary-200">Feed Status</div>
                    <div className="font-semibold">Active</div>
                  </div>
                  <Clock size={18} className="text-primary-300" />
                </div>
                <div className="flex items-center gap-2 text-body-sm">
                  <span className="text-primary-200">Last sync:</span>
                  <span className="font-medium">
                    {stats?.lastSync ? stats.lastSync.toLocaleTimeString() : '30 min ago'}
                  </span>
                </div>
              </div>

              {/* Generation Queue */}
              <div className="p-4 rounded-card bg-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <Image size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="text-caption text-primary-200">Generation Queue</div>
                    <div className="font-semibold">{processingJobs + queuedJobs} pending</div>
                  </div>
                  {processingJobs > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-success-400 animate-ping" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 text-body-sm">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-300" />
                    <span className="text-primary-200">Processing:</span>
                    <span className="font-medium">{processingJobs}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                    <span className="text-primary-200">Queued:</span>
                    <span className="font-medium">{queuedJobs}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-gradient-to-br from-white/5 to-transparent" />
          <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-gradient-to-tl from-white/5 to-transparent" />
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Sparkles size={20} className="text-primary-600" />}
          label="Products Synced"
          value={stats?.productsSynced?.toLocaleString() ?? '0'}
          change={stats ? '+12%' : undefined}
          positive
          loading={statsLoading}
        />
        <StatCard
          icon={<Image size={20} className="text-accent-600" />}
          label="Creatives Generated"
          value={stats?.creativesGenerated?.toLocaleString() ?? '0'}
          change={stats ? '+24%' : undefined}
          positive
          loading={statsLoading}
        />
        <StatCard
          icon={<Database size={20} className="text-success-600" />}
          label="Meta Updates"
          value={stats?.metaUpdates?.toLocaleString() ?? '0'}
          change={stats ? '+8%' : undefined}
          positive
          loading={statsLoading}
        />
        <StatCard
          icon={<Zap size={20} className="text-warning-600" />}
          label="Success Rate"
          value={stats ? `${stats.successRate}%` : '—'}
          change={stats ? '+2.3%' : undefined}
          positive
          loading={statsLoading}
        />
      </motion.div>

      {/* AI Insights */}
      <motion.div variants={itemVariants} className="lg:col-span-2">
        <div className="card-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <h3 className="text-heading-m text-[rgb(var(--color-text-primary))]">Insights</h3>
              {isDemo && (
                <span className="badge-warning">Demo</span>
              )}
            </div>
          </div>

          {insights.length === 0 ? (
            <div className="text-center py-8 text-[rgb(var(--color-text-secondary))]">
              <Sparkles size={32} className="mx-auto mb-2 opacity-30" />
              <p>No insights yet. Connect your store to see AI-powered insights.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {insights.slice(0, 5).map((insight) => (
                <div
                  key={insight.id}
                  className={clsx(
                    'flex items-start gap-3 p-4 rounded-card transition-all hover:shadow-soft cursor-pointer group',
                    insight.type === 'action' && 'bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800',
                    insight.type === 'warning' && 'bg-warning-50 dark:bg-warning-950/30 border border-warning-200 dark:border-warning-800',
                    insight.type === 'success' && 'bg-success-50 dark:bg-success-950/30 border border-success-200 dark:border-success-800',
                    insight.type === 'info' && 'bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border-primary))]'
                  )}
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-[rgb(var(--color-text-primary))]">{insight.title}</h4>
                    <p className="text-body-sm text-[rgb(var(--color-text-secondary))]">{insight.description}</p>
                    {insight.action && (
                      <button className="flex items-center gap-1 text-body-sm font-medium text-primary-600 hover:text-primary-700 group-hover:gap-2 transition-all mt-2">
                        {insight.action.label}
                        <ArrowUpRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Live Activity Feed */}
      <motion.div variants={itemVariants}>
        <div className="card-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-heading-m text-[rgb(var(--color-text-primary))]">Live Activity</h3>
            {!isDemo && (
              <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-success-100 dark:bg-success-900/30">
                <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
                <span className="text-caption font-medium text-success-700 dark:text-success-300">Live</span>
              </div>
            )}
          </div>

          {activities.length === 0 ? (
            <div className="text-center py-8 text-[rgb(var(--color-text-secondary))]">
              <TrendingUp size={32} className="mx-auto mb-2 opacity-30" />
              <p>No recent activity. Sync your store to see live updates.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center flex-shrink-0">
                    {activity.type === 'product_sync' && <Store size={14} className="text-primary-600" />}
                    {activity.type === 'creative_generated' && <Image size={14} className="text-accent-600" />}
                    {activity.type === 'feed_refresh' && <RefreshCw size={14} className="text-warning-600" />}
                    {activity.type === 'meta_sync' && <Database size={14} className="text-success-600" />}
                    {activity.type === 'rule_applied' && <Zap size={14} className="text-secondary-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-body-sm text-[rgb(var(--color-text-primary))] truncate">
                      {activity.title}
                    </div>
                    <div className="text-caption text-[rgb(var(--color-text-tertiary))]">
                      {activity.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <div className="card-lg p-6">
          <h3 className="text-heading-m text-[rgb(var(--color-text-primary))] mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickAction icon={<RefreshCw size={20} />} label="Sync Products" description="Import latest from Shopify" />
            <QuickAction icon={<Image size={20} />} label="Generate Images" description="Create new product creatives" />
            <QuickAction icon={<Database size={20} />} label="Refresh Feed" description="Update Meta catalog" />
            <QuickAction icon={<TrendingUp size={20} />} label="View Analytics" description="Check performance metrics" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatCard({
  icon,
  label,
  value,
  change,
  positive,
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
  loading?: boolean;
}) {
  return (
    <div className="card p-4 hover-lift">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-[rgb(var(--color-bg-tertiary))] flex items-center justify-center">
          {icon}
        </div>
        {change && (
          <span className={clsx('text-caption font-medium', positive ? 'text-success-600' : 'text-error-600')}>
            {change}
          </span>
        )}
      </div>
      {loading ? (
        <div className="h-8 w-20 rounded bg-[rgb(var(--color-bg-tertiary))] animate-pulse" />
      ) : (
        <div className="text-heading-l font-bold text-[rgb(var(--color-text-primary))]">{value}</div>
      )}
      <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">{label}</div>
    </div>
  );
}

function QuickAction({
  icon,
  label,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <button className="card p-4 text-left hover-lift hover-scale group">
      <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center mb-3 group-hover:bg-primary-200 dark:group-hover:bg-primary-900/70 transition-colors">
        <span className="text-primary-600 dark:text-primary-400">{icon}</span>
      </div>
      <div className="font-medium text-[rgb(var(--color-text-primary))] mb-1">{label}</div>
      <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">{description}</div>
    </button>
  );
}
