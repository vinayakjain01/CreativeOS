import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Image,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Activity,
  Zap,
  PlayIcon,
  Pause,
  Settings,
  TrendingUp,
  Cpu,
  HardDrive,
  Wifi,
  MoreVertical,
  RefreshCcw,
} from 'lucide-react';
import { clsx } from 'clsx';
import { mockGenerationJobs } from '../../data/mockData';

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

export default function Generation() {
  const [activeTab, setActiveTab] = useState<'all' | 'processing' | 'queued' | 'completed' | 'failed'>('all');

  const stats = {
    processing: mockGenerationJobs.filter((j) => j.status === 'processing').length,
    queued: mockGenerationJobs.filter((j) => j.status === 'queued').length,
    completed: mockGenerationJobs.filter((j) => j.status === 'completed').length,
    failed: mockGenerationJobs.filter((j) => j.status === 'failed').length,
  };

  const filteredJobs = mockGenerationJobs.filter((job) => {
    if (activeTab === 'all') return true;
    return job.status === activeTab;
  });

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
          <h1 className="text-heading-xl text-[rgb(var(--color-text-primary))]">Image Generation Center</h1>
          <p className="text-body-md text-[rgb(var(--color-text-secondary))]">
            Monitor and manage your creative generation queue
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary btn-md">
            <Settings size={18} />
            Settings
          </button>
          <button className="btn-primary btn-md">
            <PlayIcon size={18} />
            Start Generation
          </button>
        </div>
      </motion.div>

      {/* System Health */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-success-100 dark:bg-success-900/50 flex items-center justify-center">
              <Cpu size={20} className="text-success-600" />
            </div>
            <div className="flex-1">
              <div className="text-caption text-[rgb(var(--color-text-tertiary))]">Worker Status</div>
              <div className="font-medium text-[rgb(var(--color-text-primary))]">Healthy</div>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-success-500 animate-pulse" />
          </div>
          <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">
            4/4 workers active
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
              <Activity size={20} className="text-primary-600" />
            </div>
            <div className="flex-1">
              <div className="text-caption text-[rgb(var(--color-text-tertiary))]">Processing Speed</div>
              <div className="font-medium text-[rgb(var(--color-text-primary))]">4.2s</div>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '45%' }} />
          </div>
          <div className="text-caption text-[rgb(var(--color-text-tertiary))] mt-1">avg per image</div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-warning-100 dark:bg-warning-900/50 flex items-center justify-center">
              <HardDrive size={20} className="text-warning-600" />
            </div>
            <div className="flex-1">
              <div className="text-caption text-[rgb(var(--color-text-tertiary))]">Queue Length</div>
              <div className="font-medium text-[rgb(var(--color-text-primary))]">{stats.processing + stats.queued}</div>
            </div>
          </div>
          <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">
            ~{(stats.processing + stats.queued) * 4.2 / 60} min remaining
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-accent-100 dark:bg-accent-900/50 flex items-center justify-center">
              <TrendingUp size={20} className="text-accent-600" />
            </div>
            <div className="flex-1">
              <div className="text-caption text-[rgb(var(--color-text-tertiary))]">Success Rate</div>
              <div className="font-medium text-success-600">98.5%</div>
            </div>
          </div>
          <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">
            {mockGenerationJobs.filter((j) => j.status === 'completed').length} today
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
        {[
          { id: 'all', label: 'All Jobs', count: mockGenerationJobs.length },
          { id: 'processing', label: 'Processing', count: stats.processing },
          { id: 'queued', label: 'Queued', count: stats.queued },
          { id: 'completed', label: 'Completed', count: stats.completed },
          { id: 'failed', label: 'Failed', count: stats.failed },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={clsx(
              'btn btn-sm whitespace-nowrap',
              activeTab === tab.id ? 'btn-primary' : 'btn-secondary'
            )}
          >
            {tab.label}
            <span
              className={clsx(
                'px-1.5 py-0.5 rounded text-caption',
                activeTab === tab.id
                  ? 'bg-white/20'
                  : 'bg-[rgb(var(--color-bg-tertiary))]'
              )}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </motion.div>

      {/* Jobs List */}
      <motion.div variants={itemVariants}>
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </motion.div>

      {/* Empty State */}
      {filteredJobs.length === 0 && (
        <motion.div
          variants={itemVariants}
          className="empty-state"
        >
          <Image size={64} className="empty-state-icon" />
          <h3 className="empty-state-title">No jobs found</h3>
          <p className="empty-state-description">
            {activeTab === 'all'
              ? 'Start generating images to see jobs here.'
              : `No ${activeTab} jobs at the moment.`}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

function JobCard({ job }: { job: typeof mockGenerationJobs[0] }) {
  const statusConfig = {
    processing: {
      icon: <RefreshCw size={18} className="animate-spin" />,
      label: 'Processing',
      className: 'bg-primary-100 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800',
      progressBar: true,
    },
    queued: {
      icon: <Clock size={18} />,
      label: 'Queued',
      className: 'bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 border-secondary-200 dark:border-secondary-700',
      progressBar: false,
    },
    completed: {
      icon: <CheckCircle size={18} />,
      label: 'Completed',
      className: 'bg-success-100 dark:bg-success-950/30 text-success-700 dark:text-success-300 border-success-200 dark:border-success-800',
      progressBar: false,
    },
    failed: {
      icon: <XCircle size={18} />,
      label: 'Failed',
      className: 'bg-error-100 dark:bg-error-950/30 text-error-700 dark:text-error-300 border-error-200 dark:border-error-800',
      progressBar: false,
    },
  };

  const config = statusConfig[job.status];

  return (
    <div className={clsx('card-lg p-4 border', config.className)}>
      <div className="flex items-start gap-4">
        {/* Progress Circle */}
        <div className="relative w-12 h-12 flex-shrink-0">
          {job.status === 'processing' ? (
            <>
              <svg className="w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  className="fill-none stroke-current opacity-20"
                  strokeWidth="4"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  className="fill-none stroke-current transition-all duration-500"
                  strokeWidth="4"
                  strokeDasharray={`${job.progress * 1.256} 125.6`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-caption font-medium">
                {job.progress}%
              </div>
            </>
          ) : (
            <div className="w-12 h-12 rounded-full bg-[rgb(var(--color-bg-tertiary))] flex items-center justify-center">
              {config.icon}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="font-medium text-[rgb(var(--color-text-primary))] truncate">
                {job.productName}
              </h3>
              <p className="text-body-sm text-[rgb(var(--color-text-secondary))]">
                Template: {job.template}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={clsx('badge', job.status === 'completed' && 'badge-success', job.status === 'failed' && 'badge-error', job.status === 'processing' && 'badge-primary', job.status === 'queued' && 'badge-secondary')}>
                {config.label}
              </span>
              <button className="btn-ghost btn-sm p-1">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          {job.status === 'processing' && (
            <div className="mt-3">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${job.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1 text-caption text-[rgb(var(--color-text-tertiary))]">
                <span>Processing image...</span>
                <span>~{(100 - job.progress) * 0.04} sec remaining</span>
              </div>
            </div>
          )}

          {job.status === 'failed' && job.error && (
            <div className="flex items-center gap-2 mt-2 text-body-sm text-error-600">
              <AlertTriangle size={14} />
              {job.error}
              <button className="btn-ghost btn-sm text-primary-600">
                <RefreshCcw size={14} />
                Retry
              </button>
            </div>
          )}

          {job.status === 'completed' && job.completedAt && (
            <div className="text-caption text-[rgb(var(--color-text-tertiary))] mt-1">
              Completed at {job.completedAt.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
