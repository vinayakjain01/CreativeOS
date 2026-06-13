import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Database,
  Link,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Copy,
  RefreshCw,
  Settings,
  FileText,
  Activity,
  Shield,
  Store,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { clsx } from 'clsx';
import { mockMetaCatalog, mockFeeds } from '../../data/mockData';

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

export default function MetaCatalog() {
  const [copied, setCopied] = useState(false);

  const copyFeedUrl = () => {
    navigator.clipboard.writeText(mockMetaCatalog.feedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-heading-xl text-[rgb(var(--color-text-primary))]">Meta Catalog</h1>
          <p className="text-body-md text-[rgb(var(--color-text-secondary))]">
            Manage your Meta Commerce integration and catalog sync
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary btn-md">
            <Settings size={18} />
            Settings
          </button>
          <button className="btn-primary btn-md">
            <RefreshCw size={18} />
            Refresh Catalog
          </button>
        </div>
      </motion.div>

      {/* Connection Status */}
      <motion.div variants={itemVariants} className="card-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-card-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow">
              <Database size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-heading-m text-[rgb(var(--color-text-primary))]">{mockMetaCatalog.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
                <span className="text-body-sm text-success-600 font-medium">Connected</span>
              </div>
            </div>
          </div>
          <button className="btn-secondary btn-md">
            <ExternalLink size={18} />
            Open Commerce Manager
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="text-caption text-[rgb(var(--color-text-tertiary))] mb-1">Business Account</div>
            <div className="font-medium text-[rgb(var(--color-text-primary))]">{mockMetaCatalog.businessAccountId}</div>
          </div>
          <div>
            <div className="text-caption text-[rgb(var(--color-text-tertiary))] mb-1">Ad Account</div>
            <div className="font-medium text-[rgb(var(--color-text-primary))]">{mockMetaCatalog.adAccountId}</div>
          </div>
          <div>
            <div className="text-caption text-[rgb(var(--color-text-tertiary))] mb-1">Last Refresh</div>
            <div className="font-medium text-[rgb(var(--color-text-primary))]">
              {mockMetaCatalog.lastRefresh.toLocaleTimeString()}
            </div>
          </div>
          <div>
            <div className="text-caption text-[rgb(var(--color-text-tertiary))] mb-1">Next Refresh</div>
            <div className="font-medium text-[rgb(var(--color-text-primary))]">
              {mockMetaCatalog.nextRefresh.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <Store size={18} className="text-primary-600" />
            <span className="text-caption text-[rgb(var(--color-text-tertiary))]">Products</span>
          </div>
          <div className="text-heading-l font-bold text-[rgb(var(--color-text-primary))]">
            {mockMetaCatalog.productsInFeed.toLocaleString()}
          </div>
          <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">
            in catalog
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <Shield size={18} className="text-success-600" />
            <span className="text-caption text-[rgb(var(--color-text-tertiary))]">Health Score</span>
          </div>
          <div className="text-heading-l font-bold text-success-600">
            {mockMetaCatalog.healthScore}%
          </div>
          <div className="progress-bar mt-2">
            <div
              className="progress-fill bg-success-500"
              style={{ width: `${mockMetaCatalog.healthScore}%` }}
            />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <Activity size={18} className="text-accent-600" />
            <span className="text-caption text-[rgb(var(--color-text-tertiary))]">Images Updated</span>
          </div>
          <div className="text-heading-l font-bold text-[rgb(var(--color-text-primary))]">
            {(mockMetaCatalog.productsInFeed * 0.85).toLocaleString()}
          </div>
          <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">
            Creative images
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle size={18} className="text-warning-600" />
            <span className="text-caption text-[rgb(var(--color-text-tertiary))]">Warnings</span>
          </div>
          <div className="text-heading-l font-bold text-warning-600">
            {mockMetaCatalog.errors.length}
          </div>
          <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">
            issues detected
          </div>
        </div>
      </motion.div>

      {/* Feed URL */}
      <motion.div variants={itemVariants} className="card-lg p-6 mb-6">
        <h3 className="text-heading-m text-[rgb(var(--color-text-primary))] mb-4">Feed URL</h3>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Link size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-tertiary))]" />
            <input
              type="text"
              value={mockMetaCatalog.feedUrl}
              readOnly
              className="input pl-10 pr-4 bg-[rgb(var(--color-bg-secondary))]"
            />
          </div>
          <button
            onClick={copyFeedUrl}
            className={clsx(
              'btn btn-md',
              copied ? 'btn-success' : 'btn-secondary'
            )}
          >
            <Copy size={18} />
            {copied ? 'Copied!' : 'Copy URL'}
          </button>
          <button className="btn-secondary btn-md">
            <FileText size={18} />
            Download
          </button>
        </div>
      </motion.div>

      {/* Errors and Warnings */}
      {mockMetaCatalog.errors.length > 0 && (
        <motion.div variants={itemVariants} className="card-lg p-6 mb-6">
          <h3 className="text-heading-m text-[rgb(var(--color-text-primary))] mb-4">
            Catalog Issues
          </h3>
          <div className="space-y-3">
            {mockMetaCatalog.errors.map((error) => (
              <div
                key={error.id}
                className={clsx(
                  'flex items-start gap-3 p-4 rounded-card-lg border',
                  error.type === 'validation' && 'bg-error-50 dark:bg-error-950/30 border-error-200 dark:border-error-800',
                  error.type === 'warning' && 'bg-warning-50 dark:bg-warning-950/30 border-warning-200 dark:border-warning-800',
                  error.type === 'system' && 'bg-primary-50 dark:bg-primary-950/30 border-primary-200 dark:border-primary-800'
                )}
              >
                {error.type === 'warning' ? (
                  <AlertTriangle size={20} className="text-warning-600 flex-shrink-0" />
                ) : error.type === 'validation' ? (
                  <XCircle size={20} className="text-error-600 flex-shrink-0" />
                ) : (
                  <AlertTriangle size={20} className="text-primary-600 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="font-medium text-[rgb(var(--color-text-primary))]">{error.message}</p>
                  {error.productCount && (
                    <p className="text-body-sm text-[rgb(var(--color-text-secondary))]">
                      {error.productCount} products affected
                    </p>
                  )}
                </div>
                <button className="btn-secondary btn-sm">
                  View Details
                  <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Feeds */}
      <motion.div variants={itemVariants} className="card-lg overflow-hidden">
        <div className="p-6 border-b border-[rgb(var(--color-border-primary))]">
          <h3 className="text-heading-m text-[rgb(var(--color-text-primary))]">Connected Feeds</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="table-cell">Feed Name</th>
                <th className="table-cell">Type</th>
                <th className="table-cell">Products</th>
                <th className="table-cell">Status</th>
                <th className="table-cell">Last Sync</th>
                <th className="table-cell">Issues</th>
                <th className="table-cell w-12"></th>
              </tr>
            </thead>
            <tbody>
              {mockFeeds.map((feed) => (
                <tr key={feed.id} className="table-row">
                  <td className="table-cell">
                    <div className="font-medium text-[rgb(var(--color-text-primary))]">{feed.name}</div>
                  </td>
                  <td className="table-cell">
                    <span className="badge-secondary">{feed.type.toUpperCase()}</span>
                  </td>
                  <td className="table-cell">{feed.productsIncluded.toLocaleString()}</td>
                  <td className="table-cell">
                    <span
                      className={clsx(
                        'badge',
                        feed.status === 'active' && 'badge-success',
                        feed.status === 'inactive' && 'badge-secondary',
                        feed.status === 'error' && 'badge-error'
                      )}
                    >
                      {feed.status.charAt(0).toUpperCase() + feed.status.slice(1)}
                    </span>
                  </td>
                  <td className="table-cell text-body-sm text-[rgb(var(--color-text-secondary))]">
                    {feed.lastGenerated.toLocaleTimeString()}
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      {feed.errors > 0 && (
                        <span className="badge-error">{feed.errors} errors</span>
                      )}
                      {feed.warnings > 0 && (
                        <span className="badge-warning">{feed.warnings} warnings</span>
                      )}
                      {feed.errors === 0 && feed.warnings === 0 && (
                        <CheckCircle size={18} className="text-success-600" />
                      )}
                    </div>
                  </td>
                  <td className="table-cell">
                    <button className="btn-ghost btn-sm p-1">
                      <ExternalLink size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
