import { motion } from 'framer-motion';
import {
  Store,
  Database,
  RefreshCw,
  Image,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  Zap,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react';
import { clsx } from 'clsx';
import { mockStores, mockMetaCatalog, mockInsights, mockActivities, mockGenerationJobs, mockAnalytics } from '../../data/mockData';

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
  const store = mockStores[0];
  const processingJobs = mockGenerationJobs.filter((j) => j.status === 'processing').length;
  const queuedJobs = mockGenerationJobs.filter((j) => j.status === 'queued').length;
  const failedJobs = mockGenerationJobs.filter((j) => j.status === 'failed').length;

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
                <h2 className="text-heading-xl font-bold mb-2">Welcome back, John</h2>
                <p className="text-primary-100 text-body-lg">
                  Your automation is running smoothly. Everything is up to date.
                </p>
              </div>
              <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-success-400 animate-pulse" />
                <span className="text-body-sm font-medium">All systems operational</span>
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
                    <div className="font-semibold truncate">{store.name}</div>
                  </div>
                  <CheckCircle size={18} className="text-success-400" />
                </div>
                <div className="flex items-center gap-2 text-body-sm">
                  <span className="text-primary-200">Products:</span>
                  <span className="font-medium">{store.productsCount.toLocaleString()}</span>
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
                    <div className="font-semibold">Connected</div>
                  </div>
                  <CheckCircle size={18} className="text-success-400" />
                </div>
                <div className="flex items-center gap-2 text-body-sm">
                  <span className="text-primary-200">Health:</span>
                  <span className="font-medium">{mockMetaCatalog.healthScore}%</span>
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
                  <span className="font-medium">30 min ago</span>
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
          value={mockAnalytics.productsSynced.toLocaleString()}
          change="+12%"
          positive
        />
        <StatCard
          icon={<Image size={20} className="text-accent-600" />}
          label="Creatives Generated"
          value={mockAnalytics.creativesGenerated.toLocaleString()}
          change="+24%"
          positive
        />
        <StatCard
          icon={<Database size={20} className="text-success-600" />}
          label="Meta Updates"
          value={mockAnalytics.metaUpdates.toLocaleString()}
          change="+8%"
          positive
        />
        <StatCard
          icon={<Zap size={20} className="text-warning-600" />}
          label="Success Rate"
          value={`${mockAnalytics.automationSuccessRate}%`}
          change="+2.3%"
          positive
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insights */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="card-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <Sparkles size={18} className="text-white" />
                </div>
                <h3 className="text-heading-m text-[rgb(var(--color-text-primary))]">AI Insights</h3>
              </div>
              <button className="btn-ghost btn-sm">View all</button>
            </div>

            <div className="space-y-3">
              {mockInsights.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={clsx(
                    'flex items-start gap-3 p-4 rounded-card transition-all hover:shadow-soft cursor-pointer group',
                    insight.type === 'action' && 'bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800',
                    insight.type === 'warning' && 'bg-warning-50 dark:bg-warning-950/30 border border-warning-200 dark:border-warning-800',
                    insight.type === 'success' && 'bg-success-50 dark:bg-success-950/30 border border-success-200 dark:border-success-800',
                    insight.type === 'info' && 'bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border-primary))]'
                  )}
                >
                  <div
                    className={clsx(
                      'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                      insight.type === 'action' && 'bg-primary-100 dark:bg-primary-900/50',
                      insight.type === 'warning' && 'bg-warning-100 dark:bg-warning-900/50',
                      insight.type === 'success' && 'bg-success-100 dark:bg-success-900/50',
                      insight.type === 'info' && 'bg-[rgb(var(--color-bg-tertiary))]'
                    )}
                  >
                    {insight.type === 'action' && <Zap size={16} className="text-primary-600 dark:text-primary-400" />}
                    {insight.type === 'warning' && <AlertTriangle size={16} className="text-warning-600 dark:text-warning-400" />}
                    {insight.type === 'success' && <CheckCircle size={16} className="text-success-600 dark:text-success-400" />}
                    {insight.type === 'info' && <Activity size={16} className="text-[rgb(var(--color-text-secondary))]" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-medium text-[rgb(var(--color-text-primary))]">{insight.title}</h4>
                      {insight.action && (
                        <span className="text-caption text-[rgb(var(--color-text-tertiary))]">
                          {insight.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className="text-body-sm text-[rgb(var(--color-text-secondary))] mb-2">
                      {insight.description}
                    </p>
                    {insight.action && (
                      <button className="flex items-center gap-1 text-body-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 group-hover:gap-2 transition-all">
                        {insight.action.label}
                        <ArrowUpRight size={14} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Live Activity Feed */}
        <motion.div variants={itemVariants}>
          <div className="card-lg p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-heading-m text-[rgb(var(--color-text-primary))]">Live Activity</h3>
              <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-success-100 dark:bg-success-900/30">
                <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
                <span className="text-caption font-medium text-success-700 dark:text-success-300">Live</span>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin">
              {mockActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div
                    className={clsx(
                      'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                      activity.type === 'product_sync' && 'bg-primary-100 dark:bg-primary-900/50',
                      activity.type === 'creative_generated' && 'bg-accent-100 dark:bg-accent-900/50',
                      activity.type === 'feed_refresh' && 'bg-warning-100 dark:bg-warning-900/50',
                      activity.type === 'meta_sync' && 'bg-success-100 dark:bg-success-900/50',
                      activity.type === 'rule_applied' && 'bg-secondary-100 dark:bg-secondary-800'
                    )}
                  >
                    {activity.type === 'product_sync' && <Store size={14} className="text-primary-600 dark:text-primary-400" />}
                    {activity.type === 'creative_generated' && <Image size={14} className="text-accent-600 dark:text-accent-400" />}
                    {activity.type === 'feed_refresh' && <RefreshCw size={14} className="text-warning-600 dark:text-warning-400" />}
                    {activity.type === 'meta_sync' && <Database size={14} className="text-success-600 dark:text-success-400" />}
                    {activity.type === 'rule_applied' && <Zap size={14} className="text-secondary-600 dark:text-secondary-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-body-sm text-[rgb(var(--color-text-primary))] truncate">
                      {activity.title}
                    </div>
                    <div className="text-caption text-[rgb(var(--color-text-tertiary))]">
                      {activity.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <div className="card-lg p-6">
          <h3 className="text-heading-m text-[rgb(var(--color-text-primary))] mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickAction
              icon={<RefreshCw size={20} />}
              label="Sync Products"
              description="Import latest from Shopify"
            />
            <QuickAction
              icon={<Image size={20} />}
              label="Generate Images"
              description="Create new product creatives"
            />
            <QuickAction
              icon={<Database size={20} />}
              label="Refresh Feed"
              description="Update Meta catalog"
            />
            <QuickAction
              icon={<TrendingUp size={20} />}
              label="View Analytics"
              description="Check performance metrics"
            />
          </div>
        </div>
      </motion.div>

      {/* Recent Updates */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Generated Images */}
        <div className="card-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-heading-m text-[rgb(var(--color-text-primary))]">Recent Images</h3>
            <button className="btn-ghost btn-sm">
              View all
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-lg bg-[rgb(var(--color-bg-tertiary))] overflow-hidden"
              >
                <img
                  src={`https://images.pexels.com/photos/${10000000 + i * 100000}/pexels-photo-${10000000 + i * 100000}.jpeg?w=100&h=100&fit=crop`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Feed Refresh */}
        <div className="card-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-heading-m text-[rgb(var(--color-text-primary))]">Feed Status</h3>
            <span className="badge-success">Active</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-[rgb(var(--color-text-secondary))]">Last refresh</span>
              <span className="text-body-sm font-medium text-[rgb(var(--color-text-primary))]">30 min ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-[rgb(var(--color-text-secondary))]">Next refresh</span>
              <span className="text-body-sm font-medium text-[rgb(var(--color-text-primary))]">In 90 min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-[rgb(var(--color-text-secondary))]">Products sync</span>
              <span className="text-body-sm font-medium text-[rgb(var(--color-text-primary))]">1,198 / 1,248</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '96%' }} />
            </div>
          </div>
        </div>

        {/* Recent Meta Sync */}
        <div className="card-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-heading-m text-[rgb(var(--color-text-primary))]">Meta Sync</h3>
            <span className="badge-success">Connected</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-[rgb(var(--color-text-secondary))]">Catalog</span>
              <span className="text-body-sm font-medium text-[rgb(var(--color-text-primary))]">Fashion Forward</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-[rgb(var(--color-text-secondary))]">Products</span>
              <span className="text-body-sm font-medium text-[rgb(var(--color-text-primary))]">1,198</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-[rgb(var(--color-text-secondary))]">Health score</span>
              <span className="text-body-sm font-medium text-success-600">96%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill bg-success-500" style={{ width: '96%' }} />
            </div>
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
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
}) {
  return (
    <div className="card p-4 hover-lift">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-[rgb(var(--color-bg-tertiary))] flex items-center justify-center">
          {icon}
        </div>
        {change && (
          <span
            className={clsx(
              'text-caption font-medium',
              positive ? 'text-success-600' : 'text-error-600'
            )}
          >
            {change}
          </span>
        )}
      </div>
      <div className="stat-value text-heading-l">{value}</div>
      <div className="stat-label">{label}</div>
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
