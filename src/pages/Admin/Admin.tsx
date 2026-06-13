import { motion } from 'framer-motion';
import {
  Shield,
  Users,
  Store,
  CreditCard,
  Activity,
  TrendingUp,
  AlertTriangle,
  Database,
  RefreshCw,
} from 'lucide-react';
import { mockStores, mockAnalytics } from '../../data/mockData';

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

export default function Admin() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-heading-xl text-[rgb(var(--color-text-primary))]">Admin</h1>
        <p className="text-body-md text-[rgb(var(--color-text-secondary))]">
          Manage your CreativeOS workspace and view system status
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
              <Store size={20} className="text-primary-600" />
            </div>
            <div>
              <div className="text-heading-m font-bold text-[rgb(var(--color-text-primary))]">
                {mockStores.length}
              </div>
              <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">Stores</div>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-accent-100 dark:bg-accent-900/50 flex items-center justify-center">
              <Users size={20} className="text-accent-600" />
            </div>
            <div>
              <div className="text-heading-m font-bold text-[rgb(var(--color-text-primary))]">3</div>
              <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">Team Members</div>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-success-100 dark:bg-success-900/50 flex items-center justify-center">
              <Activity size={20} className="text-success-600" />
            </div>
            <div>
              <div className="text-heading-m font-bold text-success-600">98.5%</div>
              <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">System Health</div>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-warning-100 dark:bg-warning-900/50 flex items-center justify-center">
              <CreditCard size={20} className="text-warning-600" />
            </div>
            <div>
              <div className="text-heading-m font-bold text-[rgb(var(--color-text-primary))]">Pro</div>
              <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">Plan</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* System Status */}
      <motion.div variants={itemVariants} className="card-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-heading-m text-[rgb(var(--color-text-primary))]">System Status</h2>
              <p className="text-body-sm text-[rgb(var(--color-text-secondary))]">
                All systems operational
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success-100 dark:bg-success-900/30">
            <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
            <span className="text-body-sm font-medium text-success-700 dark:text-success-300">Healthy</span>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { name: 'API Server', status: 'operational', uptime: '99.98%' },
            { name: 'Image Generation', status: 'operational', uptime: '99.95%' },
            { name: 'Meta Integration', status: 'operational', uptime: '99.90%' },
            { name: 'Shopify Sync', status: 'operational', uptime: '99.99%' },
            { name: 'Database', status: 'operational', uptime: '99.99%' },
          ].map((service) => (
            <div
              key={service.name}
              className="flex items-center justify-between p-4 rounded-card-lg bg-[rgb(var(--color-bg-secondary))]"
            >
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-success-500" />
                <span className="font-medium text-[rgb(var(--color-text-primary))]">{service.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-body-sm text-[rgb(var(--color-text-secondary))]">
                  {service.uptime} uptime
                </span>
                <span className="badge-success text-caption">{service.status}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stores */}
      <motion.div variants={itemVariants} className="card-lg overflow-hidden mb-6">
        <div className="p-6 border-b border-[rgb(var(--color-border-primary))]">
          <h3 className="text-heading-m text-[rgb(var(--color-text-primary))]">Connected Stores</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="table-cell">Store</th>
                <th className="table-cell">Platform</th>
                <th className="table-cell">Products</th>
                <th className="table-cell">Health</th>
                <th className="table-cell">Last Sync</th>
                <th className="table-cell">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockStores.map((store) => (
                <tr key={store.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                        <Store size={18} className="text-primary-600" />
                      </div>
                      <div>
                        <div className="font-medium text-[rgb(var(--color-text-primary))]">{store.name}</div>
                        <div className="text-caption text-[rgb(var(--color-text-tertiary))]">{store.domain}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="badge-secondary">{store.platform}</span>
                  </td>
                  <td className="table-cell">{store.productsCount.toLocaleString()}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-20 progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${store.healthScore}%` }}
                        />
                      </div>
                      <span className="text-body-sm">{store.healthScore}%</span>
                    </div>
                  </td>
                  <td className="table-cell text-body-sm text-[rgb(var(--color-text-secondary))]">
                    {store.lastSync.toLocaleTimeString()}
                  </td>
                  <td className="table-cell">
                    <span className="badge-success">
                      {store.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Usage Overview */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Billing Period */}
        <div className="card-lg p-6">
          <h3 className="text-heading-m text-[rgb(var(--color-text-primary))] mb-4">
            Current Billing Period
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-card-lg bg-[rgb(var(--color-bg-secondary))]">
              <div>
                <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">Plan</div>
                <div className="text-heading-m font-bold text-[rgb(var(--color-text-primary))]">Pro</div>
              </div>
              <div className="text-right">
                <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">Price</div>
                <div className="text-heading-m font-bold text-[rgb(var(--color-text-primary))]">$99/mo</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-[rgb(var(--color-text-secondary))]">
                Images Generated
              </span>
              <span className="font-medium text-[rgb(var(--color-text-primary))]">
                {mockAnalytics.creativesGenerated} / 2,000
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(mockAnalytics.creativesGenerated / 2000) * 100}%` }}
              />
            </div>
            <button className="w-full btn-secondary btn-md">
              <CreditCard size={18} />
              Manage Subscription
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card-lg p-6">
          <h3 className="text-heading-m text-[rgb(var(--color-text-primary))] mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full btn-secondary btn-md justify-between">
              <div className="flex items-center gap-3">
                <RefreshCw size={18} />
                Sync All Stores
              </div>
              <TrendingUp size={18} className="text-[rgb(var(--color-text-tertiary))]" />
            </button>
            <button className="w-full btn-secondary btn-md justify-between">
              <div className="flex items-center gap-3">
                <Database size={18} />
                Export Data
              </div>
              <TrendingUp size={18} className="text-[rgb(var(--color-text-tertiary))]" />
            </button>
            <button className="w-full btn-secondary btn-md justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle size={18} />
                View Error Logs
              </div>
              <TrendingUp size={18} className="text-[rgb(var(--color-text-tertiary))]" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
