import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Copy,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Link,
  Settings,
  Plus,
  MoreVertical,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { clsx } from 'clsx';
import { mockFeeds } from '../../data/mockData';

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

export default function FeedCenter() {
  const [selectedFeed, setSelectedFeed] = useState(mockFeeds[0]);

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
          <h1 className="text-heading-xl text-[rgb(var(--color-text-primary))]">Feed Center</h1>
          <p className="text-body-md text-[rgb(var(--color-text-secondary))]">
            Generate, validate, and manage your product feeds
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary btn-md">
            <RefreshCw size={18} />
            Refresh All
          </button>
          <button className="btn-primary btn-md">
            <Plus size={18} />
            Create Feed
          </button>
        </div>
      </motion.div>

      {/* Feed Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {mockFeeds.map((feed) => (
          <FeedCard
            key={feed.id}
            feed={feed}
            selected={selectedFeed.id === feed.id}
            onClick={() => setSelectedFeed(feed)}
          />
        ))}
      </motion.div>

      {/* Feed Details */}
      <motion.div variants={itemVariants} className="card-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-heading-m text-[rgb(var(--color-text-primary))]">
            {selectedFeed.name} - Details
          </h3>
          <div className="flex items-center gap-2">
            <button className="btn-secondary btn-sm">
              <Eye size={16} />
              Preview
            </button>
            <button className="btn-secondary btn-sm">
              <Download size={16} />
              Download
            </button>
            <button className="btn-secondary btn-sm">
              <ExternalLink size={16} />
              Open in Meta
            </button>
          </div>
        </div>

        {/* Feed URL */}
        <div className="mb-6">
          <label className="label mb-2 block">Feed URL</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Link size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-tertiary))]" />
              <input
                type="text"
                value={selectedFeed.url}
                readOnly
                className="input pl-10 bg-[rgb(var(--color-bg-secondary))]"
              />
            </div>
            <button className="btn-secondary btn-md">
              <Copy size={18} />
              Copy
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-card-lg bg-[rgb(var(--color-bg-secondary))]">
            <div className="text-caption text-[rgb(var(--color-text-tertiary))] mb-1">Type</div>
            <div className="font-semibold text-[rgb(var(--color-text-primary))]">
              {selectedFeed.type.toUpperCase()}
            </div>
          </div>
          <div className="p-4 rounded-card-lg bg-[rgb(var(--color-bg-secondary))]">
            <div className="text-caption text-[rgb(var(--color-text-tertiary))] mb-1">Products</div>
            <div className="font-semibold text-[rgb(var(--color-text-primary))]">
              {selectedFeed.productsIncluded.toLocaleString()}
            </div>
          </div>
          <div className="p-4 rounded-card-lg bg-[rgb(var(--color-bg-secondary))]">
            <div className="text-caption text-[rgb(var(--color-text-tertiary))] mb-1">Last Generated</div>
            <div className="font-semibold text-[rgb(var(--color-text-primary))]">
              {selectedFeed.lastGenerated.toLocaleTimeString()}
            </div>
          </div>
          <div className="p-4 rounded-card-lg bg-[rgb(var(--color-bg-secondary))]">
            <div className="text-caption text-[rgb(var(--color-text-tertiary))] mb-1">Last Meta Fetch</div>
            <div className="font-semibold text-[rgb(var(--color-text-primary))]">
              {selectedFeed.lastMetaFetch.toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Validation Results */}
        <div className="border-t border-[rgb(var(--color-border-primary))] pt-6">
          <h4 className="text-body-md font-semibold text-[rgb(var(--color-text-primary))] mb-4">
            Feed Validation
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-card-lg border border-success-200 dark:border-success-800 bg-success-50 dark:bg-success-950/30">
              <CheckCircle size={20} className="text-success-600" />
              <div>
                <div className="font-medium text-success-700 dark:text-success-300">Valid Products</div>
                <div className="text-body-sm text-success-600 dark:text-success-400">
                  {selectedFeed.productsIncluded - selectedFeed.errors} products
                </div>
              </div>
            </div>
            {selectedFeed.errors > 0 && (
              <div className="flex items-center gap-3 p-4 rounded-card-lg border border-error-200 dark:border-error-800 bg-error-50 dark:bg-error-950/30">
                <XCircle size={20} className="text-error-600" />
                <div>
                  <div className="font-medium text-error-700 dark:text-error-300">Errors</div>
                  <div className="text-body-sm text-error-600 dark:text-error-400">
                    {selectedFeed.errors} products
                  </div>
                </div>
              </div>
            )}
            {selectedFeed.warnings > 0 && (
              <div className="flex items-center gap-3 p-4 rounded-card-lg border border-warning-200 dark:border-warning-800 bg-warning-50 dark:bg-warning-950/30">
                <AlertTriangle size={20} className="text-warning-600" />
                <div>
                  <div className="font-medium text-warning-700 dark:text-warning-300">Warnings</div>
                  <div className="text-body-sm text-warning-600 dark:text-warning-400">
                    {selectedFeed.warnings} products
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FeedCard({
  feed,
  selected,
  onClick,
}: {
  feed: typeof mockFeeds[0];
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      variants={itemVariants}
      onClick={onClick}
      className={clsx(
        'card-lg p-5 cursor-pointer transition-all hover:shadow-soft-md',
        selected && 'ring-2 ring-primary-500'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={clsx(
              'w-12 h-12 rounded-card-lg flex items-center justify-center',
              feed.type === 'xml' && 'bg-primary-100 dark:bg-primary-900/50',
              feed.type === 'csv' && 'bg-accent-100 dark:bg-accent-900/50',
              feed.type === 'tsv' && 'bg-warning-100 dark:bg-warning-900/50'
            )}
          >
            <FileText
              size={24}
              className={clsx(
                feed.type === 'xml' && 'text-primary-600',
                feed.type === 'csv' && 'text-accent-600',
                feed.type === 'tsv' && 'text-warning-600'
              )}
            />
          </div>
          <div>
            <h3 className="font-semibold text-[rgb(var(--color-text-primary))]">{feed.name}</h3>
            <p className="text-body-sm text-[rgb(var(--color-text-secondary))]">
              {feed.type.toUpperCase()} Feed
            </p>
          </div>
        </div>
        <span
          className={clsx(
            'badge',
            feed.status === 'active' && 'badge-success',
            feed.status === 'inactive' && 'badge-secondary',
            feed.status === 'error' && 'badge-error'
          )}
        >
          {feed.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-caption text-[rgb(var(--color-text-tertiary))]">Products</div>
          <div className="font-medium text-[rgb(var(--color-text-primary))]">
            {feed.productsIncluded.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-caption text-[rgb(var(--color-text-tertiary))]">Last Generated</div>
          <div className="font-medium text-[rgb(var(--color-text-primary))]">
            {feed.lastGenerated.toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[rgb(var(--color-border-primary))]">
        <div className="flex items-center gap-4">
          {feed.errors === 0 && feed.warnings === 0 ? (
            <div className="flex items-center gap-1 text-success-600 text-body-sm">
              <CheckCircle size={14} />
              All valid
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {feed.errors > 0 && (
                <div className="flex items-center gap-1 text-error-600 text-body-sm">
                  <XCircle size={14} />
                  {feed.errors} errors
                </div>
              )}
              {feed.warnings > 0 && (
                <div className="flex items-center gap-1 text-warning-600 text-body-sm">
                  <AlertTriangle size={14} />
                  {feed.warnings} warnings
                </div>
              )}
            </div>
          )}
        </div>
        <button className="btn-ghost btn-sm p-1">
          <MoreVertical size={18} />
        </button>
      </div>
    </motion.div>
  );
}
