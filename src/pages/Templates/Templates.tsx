import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Grid,
  List,
  MoreHorizontal,
  Eye,
  Edit3,
  Trash2,
  Copy,
  BarChart3,
  Star,
  TrendingUp,
  Users,
  X,
  Database,
  PackageOpen,
} from 'lucide-react';
import { clsx } from 'clsx';
import { mockTemplates } from '../../data/mockData';
import { fetchTemplates } from '../../services/templates';
import { useAsyncData } from '../../hooks/useAsyncData';
import type { Template, TemplateCategory } from '../../types';

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

export default function Templates() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | 'all'>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const { data: templates, loading, source } = useAsyncData(fetchTemplates, mockTemplates, []);
  const isDemo = source === 'demo';

  const categories: { id: TemplateCategory | 'all'; label: string; count: number }[] = [
    { id: 'all', label: 'All Templates', count: templates.length },
    { id: 'sale', label: 'Sale', count: templates.filter((t) => t.category === 'sale').length },
    { id: 'new-arrival', label: 'New Arrival', count: templates.filter((t) => t.category === 'new-arrival').length },
    { id: 'bestseller', label: 'Bestseller', count: templates.filter((t) => t.category === 'bestseller').length },
    { id: 'seasonal', label: 'Seasonal', count: templates.filter((t) => t.category === 'seasonal').length },
    { id: 'discount', label: 'Discount', count: templates.filter((t) => t.category === 'discount').length },
    { id: 'custom', label: 'Custom', count: templates.filter((t) => t.category === 'custom').length },
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === 'all' || template.category === activeCategory;
    return matchesSearch && matchesCategory;
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
          <div className="flex items-center gap-2">
            <h1 className="text-heading-xl text-[rgb(var(--color-text-primary))]">Templates</h1>
            {isDemo && (
              <span className="badge-warning inline-flex items-center gap-1" title="Set Supabase env vars to load live templates">
                <Database size={12} />
                Demo data
              </span>
            )}
          </div>
          <p className="text-body-md text-[rgb(var(--color-text-secondary))]">
            Create and manage your creative templates
          </p>
        </div>
        <button className="btn-primary btn-md">
          <Plus size={18} />
          New Template
        </button>
      </motion.div>

      {/* Search and View Controls */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-tertiary))]" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={clsx('btn btn-sm', viewMode === 'grid' ? 'btn-primary' : 'btn-secondary')}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={clsx('btn btn-sm', viewMode === 'list' ? 'btn-primary' : 'btn-secondary')}
          >
            <List size={18} />
          </button>
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div variants={itemVariants} className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-1">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={clsx(
              'btn btn-sm whitespace-nowrap',
              activeCategory === category.id ? 'btn-primary' : 'btn-secondary'
            )}
          >
            {category.label}
            <span
              className={clsx(
                'px-1.5 py-0.5 rounded text-caption',
                activeCategory === category.id
                  ? 'bg-white/20'
                  : 'bg-[rgb(var(--color-bg-tertiary))]'
              )}
            >
              {category.count}
            </span>
          </button>
        ))}
      </motion.div>

      {/* Templates Grid/List */}
      {loading && templates.length === 0 ? (
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={`sk-${i}`} className="card overflow-hidden">
              <div className="aspect-[4/3] bg-[rgb(var(--color-bg-tertiary))] animate-pulse" />
              <div className="p-4">
                <div className="h-4 w-2/3 rounded bg-[rgb(var(--color-bg-tertiary))] animate-pulse" />
              </div>
            </div>
          ))}
        </motion.div>
      ) : filteredTemplates.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="card-lg p-12 flex flex-col items-center text-center gap-3"
        >
          <div className="w-12 h-12 rounded-xl bg-[rgb(var(--color-bg-tertiary))] flex items-center justify-center">
            <PackageOpen size={24} className="text-[rgb(var(--color-text-tertiary))]" />
          </div>
          <div>
            <div className="font-medium text-[rgb(var(--color-text-primary))]">
              {searchQuery || activeCategory !== 'all' ? 'No templates match your filters' : 'No templates yet'}
            </div>
            <div className="text-caption text-[rgb(var(--color-text-secondary))]">
              {searchQuery || activeCategory !== 'all'
                ? 'Try a different search or category.'
                : 'Create your first template to start generating creatives.'}
            </div>
          </div>
        </motion.div>
      ) : viewMode === 'grid' ? (
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onPreview={() => {
                setSelectedTemplate(template);
                setShowPreview(true);
              }}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="card-lg overflow-hidden">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="table-cell">Template</th>
                <th className="table-cell">Category</th>
                <th className="table-cell">Usage</th>
                <th className="table-cell">CTR</th>
                <th className="table-cell">Conversions</th>
                <th className="table-cell w-12"></th>
              </tr>
            </thead>
            <tbody>
              {filteredTemplates.map((template) => (
                <tr key={template.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-[rgb(var(--color-bg-tertiary))]">
                        <img
                          src={template.thumbnail}
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="font-medium text-[rgb(var(--color-text-primary))]">
                        {template.name}
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="badge-secondary">{template.category}</span>
                  </td>
                  <td className="table-cell">{template.usageCount}</td>
                  <td className="table-cell"> {template.performance.ctr}%</td>
                  <td className="table-cell">{template.performance.conversions}</td>
                  <td className="table-cell">
                    <button className="btn-ghost btn-sm p-1">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && selectedTemplate && (
          <TemplatePreviewModal
            template={selectedTemplate}
            onClose={() => {
              setShowPreview(false);
              setSelectedTemplate(null);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TemplateCard({
  template,
  onPreview,
}: {
  template: Template;
  onPreview: () => void;
}) {
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      className="card overflow-hidden group hover-lift"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[rgb(var(--color-bg-tertiary))]">
        <img
          src={template.thumbnail}
          alt={template.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-3 right-3">
          <span
            className={clsx(
              'badge',
              template.category === 'sale' && 'badge-error',
              template.category === 'new-arrival' && 'badge-primary',
              template.category === 'bestseller' && 'badge-warning',
              template.category === 'seasonal' && 'badge-success',
              template.category === 'discount' && 'badge-error'
            )}
          >
            {template.category}
          </span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <button
            onClick={onPreview}
            className="flex-1 btn btn-sm bg-white/90 text-secondary-900 hover:bg-white"
          >
            <Eye size={16} />
            Preview
          </button>
          <button className="btn btn-sm bg-white/90 text-secondary-900 hover:bg-white">
            <Edit3 size={16} />
          </button>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium text-[rgb(var(--color-text-primary))]">{template.name}</h3>
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="btn-ghost btn-sm p-1"
            >
              <MoreHorizontal size={18} />
            </button>
            <AnimatePresence>
              {showActions && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowActions(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="dropdown right-0 z-50"
                  >
                    <button className="dropdown-item w-full">
                      <Edit3 size={16} />
                      Edit
                    </button>
                    <button className="dropdown-item w-full">
                      <Copy size={16} />
                      Duplicate
                    </button>
                    <button className="dropdown-item w-full">
                      <BarChart3 size={16} />
                      Analytics
                    </button>
                    <div className="border-t border-[rgb(var(--color-border-primary))] my-1" />
                    <button className="dropdown-item w-full text-error-600">
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-4 text-caption text-[rgb(var(--color-text-secondary))]">
          <div className="flex items-center gap-1">
            <Users size={14} />
            {template.usageCount} uses
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp size={14} />
            {template.performance.ctr}% CTR
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TemplatePreviewModal({
  template,
  onClose,
}: {
  template: Template;
  onClose: () => void;
}) {
  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl z-50"
      >
        <div className="card-lg overflow-hidden bg-[rgb(var(--color-bg-primary))]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[rgb(var(--color-border-primary))]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-[rgb(var(--color-bg-tertiary))]">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-[rgb(var(--color-text-primary))]">{template.name}</h3>
                <p className="text-caption text-[rgb(var(--color-text-secondary))]">
                  {template.category} template
                </p>
              </div>
            </div>
            <button onClick={onClose} className="btn-ghost btn-sm">
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex">
            {/* Preview */}
            <div className="flex-1 p-6 bg-[rgb(var(--color-bg-secondary))]">
              <div className="aspect-square max-w-md mx-auto rounded-card-lg overflow-hidden bg-[rgb(var(--color-bg-tertiary))] shadow-soft-lg">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-80 p-6 border-l border-[rgb(var(--color-border-primary))]">
              <h4 className="font-semibold text-body-md text-[rgb(var(--color-text-primary))] mb-4">
                Performance
              </h4>
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-body-sm text-[rgb(var(--color-text-secondary))]">
                    <Users size={16} />
                    Usage
                  </div>
                  <div className="font-medium text-[rgb(var(--color-text-primary))]">
                    {template.usageCount}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-body-sm text-[rgb(var(--color-text-secondary))]">
                    <TrendingUp size={16} />
                    CTR
                  </div>
                  <div className="font-medium text-success-600">{template.performance.ctr}%</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-body-sm text-[rgb(var(--color-text-secondary))]">
                    <Star size={16} />
                    Conversions
                  </div>
                  <div className="font-medium text-[rgb(var(--color-text-primary))]">
                    {template.performance.conversions}
                  </div>
                </div>
              </div>

              <div className="border-t border-[rgb(var(--color-border-primary))] pt-4 mb-6">
                <h4 className="font-semibold text-body-md text-[rgb(var(--color-text-primary))] mb-3">
                  Applied Rules
                </h4>
                <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">
                  This template is applied when matching rules trigger.
                </div>
              </div>

              <div className="space-y-2">
                <button className="btn-primary btn-md w-full">
                  <Edit3 size={16} />
                  Edit Template
                </button>
                <button className="btn-secondary btn-md w-full">
                  Apply to Products
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
