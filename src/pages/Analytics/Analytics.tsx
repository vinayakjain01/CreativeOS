import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Image,
  Database,
  RefreshCw,
  Layers,
  Sparkles,
  Clock,
  Zap,
  Download,
  Calendar,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { clsx } from 'clsx';
import { mockAnalytics } from '../../data/mockData';

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

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  const templateUsageData = Object.entries(mockAnalytics.templateUsage).map(
    ([name, count], index) => ({
      name,
      count,
      fill: COLORS[index % COLORS.length],
    })
  );

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
          <h1 className="text-heading-xl text-[rgb(var(--color-text-primary))]">Analytics</h1>
          <p className="text-body-md text-[rgb(var(--color-text-secondary))]">
            Track your automation performance and creative generation metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[rgb(var(--color-bg-tertiary))]">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={clsx(
                  'btn btn-sm',
                  timeRange === range ? 'btn-primary' : 'btn-ghost'
                )}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="btn-secondary btn-md">
            <Calendar size={18} />
            Custom
          </button>
          <button className="btn-primary btn-md">
            <Download size={18} />
            Export
          </button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <KPICard
          icon={<Database size={20} className="text-primary-600" />}
          label="Products Synced"
          value={mockAnalytics.productsSynced.toLocaleString()}
          change="+12%"
          positive
        />
        <KPICard
          icon={<Image size={20} className="text-accent-600" />}
          label="Creatives Generated"
          value={mockAnalytics.creativesGenerated.toLocaleString()}
          change="+24%"
          positive
        />
        <KPICard
          icon={<RefreshCw size={20} className="text-success-600" />}
          label="Meta Updates"
          value={mockAnalytics.metaUpdates.toLocaleString()}
          change="+8%"
          positive
        />
        <KPICard
          icon={<Zap size={20} className="text-warning-600" />}
          label="Success Rate"
          value={`${mockAnalytics.automationSuccessRate}%`}
          change="+2.3%"
          positive
        />
        <KPICard
          icon={<Clock size={20} className="text-secondary-500" />}
          label="Avg Generation"
          value={`${mockAnalytics.averageGenerationTime}s`}
          change="-0.5s"
          positive
        />
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Generation Trend */}
        <motion.div variants={itemVariants} className="card-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-heading-m text-[rgb(var(--color-text-primary))]">
              Generation Trend
            </h3>
            <div className="flex items-center gap-4 text-body-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary-500" />
                <span className="text-[rgb(var(--color-text-secondary))]">Generated</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockAnalytics.generationTrend}>
                <defs>
                  <linearGradient id="colorGenerated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-border-primary))" />
                <XAxis dataKey="date" stroke="rgb(var(--color-text-tertiary))" fontSize={12} />
                <YAxis stroke="rgb(var(--color-text-tertiary))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(var(--color-bg-primary))',
                    border: '1px solid rgb(var(--color-border-primary))',
                    borderRadius: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorGenerated)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Sync Trend */}
        <motion.div variants={itemVariants} className="card-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-heading-m text-[rgb(var(--color-text-primary))]">
              Sync Activity
            </h3>
            <div className="flex items-center gap-4 text-body-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent-500" />
                <span className="text-[rgb(var(--color-text-secondary))]">Synced</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockAnalytics.syncTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-border-primary))" />
                <XAxis dataKey="date" stroke="rgb(var(--color-text-tertiary))" fontSize={12} />
                <YAxis stroke="rgb(var(--color-text-tertiary))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(var(--color-bg-primary))',
                    border: '1px solid rgb(var(--color-border-primary))',
                    borderRadius: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Template Usage & Catalog Coverage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Template Usage */}
        <motion.div variants={itemVariants} className="card-lg p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-heading-m text-[rgb(var(--color-text-primary))]">
              Template Usage
            </h3>
            <button className="btn-ghost btn-sm">View All</button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={templateUsageData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-border-primary))" />
                <XAxis type="number" stroke="rgb(var(--color-text-tertiary))" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="rgb(var(--color-text-tertiary))" fontSize={12} width={120} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(var(--color-bg-primary))',
                    border: '1px solid rgb(var(--color-border-primary))',
                    borderRadius: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {templateUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Catalog Coverage */}
        <motion.div variants={itemVariants} className="card-lg p-6">
          <h3 className="text-heading-m text-[rgb(var(--color-text-primary))] mb-4">
            Catalog Coverage
          </h3>
          <div className="flex justify-center mb-6">
            <div className="relative w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Covered', value: mockAnalytics.catalogCoverage },
                      { name: 'Uncovered', value: 100 - mockAnalytics.catalogCoverage },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="rgb(var(--color-bg-tertiary))" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-heading-l font-bold text-[rgb(var(--color-text-primary))]">
                    {mockAnalytics.catalogCoverage}%
                  </div>
                  <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">Coverage</div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-[rgb(var(--color-text-secondary))]">
                Products with creatives
              </span>
              <span className="font-medium text-[rgb(var(--color-text-primary))]">
                {mockAnalytics.creativesGenerated}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-[rgb(var(--color-text-secondary))]">
                Products without creatives
              </span>
              <span className="font-medium text-[rgb(var(--color-text-primary))]">
                {mockAnalytics.productsSynced - mockAnalytics.creativesGenerated}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-[rgb(var(--color-text-secondary))]">
                Total products
              </span>
              <span className="font-medium text-[rgb(var(--color-text-primary))]">
                {mockAnalytics.productsSynced}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Performance Summary */}
      <motion.div variants={itemVariants} className="card-lg p-6">
        <h3 className="text-heading-m text-[rgb(var(--color-text-primary))] mb-4">
          Performance Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 rounded-card-lg bg-[rgb(var(--color-bg-secondary))]">
            <Activity size={24} className="mx-auto mb-2 text-primary-600" />
            <div className="text-heading-m font-bold text-[rgb(var(--color-text-primary))]">
              {mockAnalytics.feedRefreshes}
            </div>
            <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">
              Feed Refreshes
            </div>
          </div>
          <div className="text-center p-4 rounded-card-lg bg-[rgb(var(--color-bg-secondary))]">
            <Layers size={24} className="mx-auto mb-2 text-accent-600" />
            <div className="text-heading-m font-bold text-[rgb(var(--color-text-primary))]">
              {Object.keys(mockAnalytics.templateUsage).length}
            </div>
            <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">
              Active Templates
            </div>
          </div>
          <div className="text-center p-4 rounded-card-lg bg-[rgb(var(--color-bg-secondary))]">
            <Sparkles size={24} className="mx-auto mb-2 text-warning-600" />
            <div className="text-heading-m font-bold text-[rgb(var(--color-text-primary))]">
              3
            </div>
            <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">
              Active Rules
            </div>
          </div>
          <div className="text-center p-4 rounded-card-lg bg-[rgb(var(--color-bg-secondary))]">
            <TrendingUp size={24} className="mx-auto mb-2 text-success-600" />
            <div className="text-heading-m font-bold text-success-600">
              98.5%
            </div>
            <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">
              Uptime
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function KPICard({
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
    <div className="card p-4">
      <div className="flex items-start justify-between mb-2">
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
      <div className="text-heading-m font-bold text-[rgb(var(--color-text-primary))]">{value}</div>
      <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">{label}</div>
    </div>
  );
}
