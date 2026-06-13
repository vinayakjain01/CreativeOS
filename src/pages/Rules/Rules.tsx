import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Play,
  Pause,
  MoreVertical,
  ChevronRight,
  GitBranch,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Trash2,
  Edit3,
  Copy,
  Layers,
  ArrowRight,
  GripVertical,
} from 'lucide-react';
import { clsx } from 'clsx';
import { mockRules } from '../../data/mockData';
import type { Rule, RuleCondition, RuleAction } from '../../types';

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

export default function Rules() {
  const [rules, setRules] = useState(mockRules);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === id ? { ...rule, active: !rule.active } : rule
      )
    );
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
          <h1 className="text-heading-xl text-[rgb(var(--color-text-primary))]">Rules Engine</h1>
          <p className="text-body-md text-[rgb(var(--color-text-secondary))]">
            Automate creative generation with condition-based rules
          </p>
        </div>
        <button
          onClick={() => {
            setEditingRule(null);
            setShowBuilder(true);
          }}
          className="btn-primary btn-md"
        >
          <Plus size={18} />
          Create Rule
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
              <GitBranch size={20} className="text-primary-600" />
            </div>
            <div>
              <div className="text-heading-m font-bold text-[rgb(var(--color-text-primary))]">{rules.length}</div>
              <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">Total Rules</div>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success-100 dark:bg-success-900/50 flex items-center justify-center">
              <Play size={20} className="text-success-600" />
            </div>
            <div>
              <div className="text-heading-m font-bold text-[rgb(var(--color-text-primary))]">
                {rules.filter((r) => r.active).length}
              </div>
              <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">Active</div>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning-100 dark:bg-warning-900/50 flex items-center justify-center">
              <Zap size={20} className="text-warning-600" />
            </div>
            <div>
              <div className="text-heading-m font-bold text-[rgb(var(--color-text-primary))]">
                {rules.reduce((acc, r) => acc + r.appliedCount, 0)}
              </div>
              <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">Times Applied</div>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-100 dark:bg-accent-900/50 flex items-center justify-center">
              <Layers size={20} className="text-accent-600" />
            </div>
            <div>
              <div className="text-heading-m font-bold text-[rgb(var(--color-text-primary))]">5</div>
              <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">Templates Linked</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Rules List */}
      <motion.div variants={itemVariants} className="space-y-4">
        {rules
          .sort((a, b) => a.priority - b.priority)
          .map((rule, index) => (
            <RuleCard
              key={rule.id}
              rule={rule}
              index={index}
              onToggle={() => toggleRule(rule.id)}
              onEdit={() => {
                setEditingRule(rule);
                setShowBuilder(true);
              }}
            />
          ))}
      </motion.div>

      {/* Rule Builder Modal */}
      <AnimatePresence>
        {showBuilder && (
          <RuleBuilderModal
            rule={editingRule}
            onClose={() => {
              setShowBuilder(false);
              setEditingRule(null);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function RuleCard({
  rule,
  index,
  onToggle,
  onEdit,
}: {
  rule: Rule;
  index: number;
  onToggle: () => void;
  onEdit: () => void;
}) {
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      className={clsx(
        'card-lg overflow-hidden transition-all',
        !rule.active && 'opacity-60'
      )}
    >
      <div className="flex items-start gap-4 p-6">
        {/* Priority */}
        <div className="w-8 h-8 rounded-lg bg-[rgb(var(--color-bg-tertiary))] flex items-center justify-center text-body-sm font-medium text-[rgb(var(--color-text-secondary))] flex-shrink-0">
          {rule.priority}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="font-semibold text-[rgb(var(--color-text-primary))]">{rule.name}</h3>
            <span
              className={clsx(
                'badge',
                rule.active ? 'badge-success' : 'badge-secondary'
              )}
            >
              {rule.active ? 'Active' : 'Paused'}
            </span>
          </div>

          {/* Conditions */}
          <div className="mb-4">
            <div className="text-caption text-[rgb(var(--color-text-tertiary))] uppercase tracking-wide mb-2">
              When
            </div>
            <div className="flex flex-wrap gap-2">
              {rule.conditions.map((condition, i) => (
                <ConditionBlock
                  key={condition.id}
                  condition={condition}
                  showConjunction={i < rule.conditions.length - 1}
                  conjunction={rule.conditions[i + 1]?.conjunction}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div>
            <div className="text-caption text-[rgb(var(--color-text-tertiary))] uppercase tracking-wide mb-2">
              Then
            </div>
            <div className="flex flex-wrap gap-2">
              {rule.actions.map((action) => (
                <ActionBlock key={action.id} action={action} />
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="text-right flex-shrink-0">
          <div className="text-heading-m font-bold text-[rgb(var(--color-text-primary))]">
            {rule.appliedCount}
          </div>
          <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">times applied</div>
        </div>

        {/* Actions Menu */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowActions(!showActions)}
            className="btn-ghost btn-sm p-2"
          >
            <MoreVertical size={18} />
          </button>
          <AnimatePresence>
            {showActions && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowActions(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="dropdown right-0 z-50"
                >
                  <button onClick={onEdit} className="dropdown-item w-full">
                    <Edit3 size={16} />
                    Edit Rule
                  </button>
                  <button onClick={onToggle} className="dropdown-item w-full">
                    {rule.active ? <Pause size={16} /> : <Play size={16} />}
                    {rule.active ? 'Pause Rule' : 'Activate Rule'}
                  </button>
                  <button className="dropdown-item w-full">
                    <Copy size={16} />
                    Duplicate
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
    </motion.div>
  );
}

function ConditionBlock({
  condition,
  showConjunction,
  conjunction,
}: {
  condition: RuleCondition;
  showConjunction: boolean;
  conjunction?: 'and' | 'or';
}) {
  const fieldLabels: Record<string, string> = {
    discount: 'Discount',
    tags: 'Tags',
    price: 'Price',
    collection: 'Collection',
  };

  const operatorLabels: Record<string, string> = {
    equals: '=',
    contains: 'contains',
    greater_than: '>',
    less_than: '<',
    starts_with: 'starts with',
    ends_with: 'ends with',
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800">
        <span className="font-medium text-primary-700 dark:text-primary-300">
          {fieldLabels[condition.field] || condition.field}
        </span>
        <span className="text-primary-500">{operatorLabels[condition.operator]}</span>
        <span className="font-medium text-primary-700 dark:text-primary-300">
          {condition.value}
          {condition.field === 'discount' || condition.field === 'price' ? '%' : ''}
        </span>
      </div>
      {showConjunction && (
        <span
          className={clsx(
            'px-2 py-1 rounded text-body-sm font-medium',
            conjunction === 'and' ? 'bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300' : 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300'
          )}
        >
          {conjunction?.toUpperCase()}
        </span>
      )}
    </div>
  );
}

function ActionBlock({ action }: { action: RuleAction }) {
  const typeLabels: Record<string, string> = {
    apply_template: 'Apply Template',
    add_badge: 'Add Badge',
    set_price: 'Set Price',
    update_feed: 'Update Feed',
  };

  const typeIcons: Record<string, React.ReactNode> = {
    apply_template: <Layers size={14} />,
    add_badge: <Zap size={14} />,
    set_price: <AlertTriangle size={14} />,
    update_feed: <GitBranch size={14} />,
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent-50 dark:bg-accent-950/30 border border-accent-200 dark:border-accent-800">
      <span className="text-accent-600 dark:text-accent-400">{typeIcons[action.type]}</span>
      <span className="font-medium text-accent-700 dark:text-accent-300">
        {typeLabels[action.type]}
      </span>
    </div>
  );
}

function RuleBuilderModal({ rule, onClose }: { rule: Rule | null; onClose: () => void }) {
  const [name, setName] = useState(rule?.name || '');
  const [conditions, setConditions] = useState<RuleCondition[]>(
    rule?.conditions || [
      { id: 'c1', field: 'tags', operator: 'contains', value: '' },
    ]
  );
  const [actions, setActions] = useState<RuleAction[]>(
    rule?.actions || [
      { id: 'a1', type: 'apply_template', config: {} },
    ]
  );

  const addCondition = () => {
    setConditions([
      ...conditions,
      { id: `c${Date.now()}`, field: 'tags', operator: 'contains', value: '', conjunction: 'and' },
    ]);
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter((c) => c.id !== id));
  };

  const updateCondition = (id: string, updates: Partial<RuleCondition>) => {
    setConditions(
      conditions.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] overflow-y-auto z-50"
      >
        <div className="card-lg p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-heading-l text-[rgb(var(--color-text-primary))]">
              {rule ? 'Edit Rule' : 'Create Rule'}
            </h2>
            <button onClick={onClose} className="btn-ghost btn-sm">
              Close
            </button>
          </div>

          {/* Rule Name */}
          <div className="mb-6">
            <label className="label mb-2 block">Rule Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Apply Sale Template to Discounted Items"
              className="input"
            />
          </div>

          {/* Conditions */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="label">When these conditions are met</label>
              <button onClick={addCondition} className="btn-ghost btn-sm">
                <Plus size={16} />
                Add Condition
              </button>
            </div>
            <div className="space-y-3">
              {conditions.map((condition, index) => (
                <motion.div
                  key={condition.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3"
                >
                  {index > 0 && (
                    <select
                      value={condition.conjunction || 'and'}
                      onChange={(e) =>
                        updateCondition(condition.id, {
                          conjunction: e.target.value as 'and' | 'or',
                        })
                      }
                      className="input w-24"
                    >
                      <option value="and">AND</option>
                      <option value="or">OR</option>
                    </select>
                  )}
                  <select
                    value={condition.field}
                    onChange={(e) =>
                      updateCondition(condition.id, { field: e.target.value })
                    }
                    className="input flex-1"
                  >
                    <option value="tags">Tags</option>
                    <option value="discount">Discount</option>
                    <option value="price">Price</option>
                    <option value="collection">Collection</option>
                  </select>
                  <select
                    value={condition.operator}
                    onChange={(e) =>
                      updateCondition(condition.id, {
                        operator: e.target.value as RuleCondition['operator'],
                      })
                    }
                    className="input w-32"
                  >
                    <option value="equals">equals</option>
                    <option value="contains">contains</option>
                    <option value="greater_than">greater than</option>
                    <option value="less_than">less than</option>
                  </select>
                  <input
                    type="text"
                    value={condition.value.toString()}
                    onChange={(e) =>
                      updateCondition(condition.id, { value: e.target.value })
                    }
                    className="input flex-1"
                    placeholder="Value..."
                  />
                  {conditions.length > 1 && (
                    <button
                      onClick={() => removeCondition(condition.id)}
                      className="btn-ghost btn-sm text-error-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center mb-6">
            <div className="w-10 h-10 rounded-full bg-[rgb(var(--color-bg-tertiary))] flex items-center justify-center">
              <ArrowRight size={20} className="text-[rgb(var(--color-text-secondary))]" />
            </div>
          </div>

          {/* Actions */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="label">Then do these actions</label>
              <button className="btn-ghost btn-sm">
                <Plus size={16} />
                Add Action
              </button>
            </div>
            <div className="space-y-3">
              {actions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[rgb(var(--color-bg-secondary))]"
                >
                  <GripVertical size={18} className="text-[rgb(var(--color-text-tertiary))]" />
                  <select
                    value={action.type}
                    className="input flex-1"
                  >
                    <option value="apply_template">Apply Template</option>
                    <option value="add_badge">Add Badge</option>
                    <option value="update_feed">Update Feed</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[rgb(var(--color-border-primary))]">
            <button onClick={onClose} className="btn-secondary btn-md">
              Cancel
            </button>
            <button className="btn-primary btn-md">
              <CheckCircle size={18} />
              Save Rule
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
