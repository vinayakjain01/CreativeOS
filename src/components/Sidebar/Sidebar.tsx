import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Layers,
  GitBranch,
  Image,
  Sparkles,
  Database,
  FileText,
  Settings,
  ChevronLeft,
  Search,
  Store,
  ChevronDown,
  Command,
  Zap,
  Activity,
  Shield,
  BarChart3,
} from 'lucide-react';
import { clsx } from 'clsx';
import { mockStores } from '../../data/mockData';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'products', label: 'Products', icon: <Package size={20} />, badge: 5 },
  { id: 'templates', label: 'Templates', icon: <Layers size={20} /> },
  { id: 'rules', label: 'Rules Engine', icon: <GitBranch size={20} /> },
  { id: 'generation', label: 'Image Generation', icon: <Image size={20} />, badge: 3 },
  { id: 'creatives', label: 'Generated Creatives', icon: <Sparkles size={20} /> },
  { id: 'meta', label: 'Meta Catalog', icon: <Database size={20} /> },
  { id: 'feeds', label: 'Feed Center', icon: <FileText size={20} /> },
  {
    id: 'automation',
    label: 'Automation',
    icon: <Zap size={20} />,
    children: [
      { id: 'automation-queue', label: 'Queue Monitoring', icon: <Activity size={18} /> },
      { id: 'automation-analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
    ],
  },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  { id: 'admin', label: 'Admin', icon: <Shield size={20} /> },
];

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ currentPage, onNavigate, collapsed, onToggleCollapse }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState(mockStores[0]);

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredNavItems = navItems.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.children?.some((child) =>
        child.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 280 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen bg-[rgb(var(--color-bg-primary))] border-r border-[rgb(var(--color-border-primary))] flex flex-col z-40"
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-[rgb(var(--color-border-primary))]">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <span className="font-semibold text-heading-m text-[rgb(var(--color-text-primary))]">
                CreativeOS
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto">
            <Sparkles size={20} className="text-white" />
          </div>
        )}
      </div>

      {/* Store Switcher */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-3 py-3 border-b border-[rgb(var(--color-border-primary))]"
        >
          <button
            onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-[rgb(var(--color-bg-secondary))] hover:bg-[rgb(var(--color-bg-hover))] transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <Store size={16} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-body-sm font-medium text-[rgb(var(--color-text-primary))] truncate">
                {selectedStore.name}
              </div>
              <div className="text-caption text-[rgb(var(--color-text-tertiary))]">
                {selectedStore.productsCount} products
              </div>
            </div>
            <ChevronDown
              size={16}
              className={clsx(
                'text-[rgb(var(--color-text-tertiary))] transition-transform',
                storeDropdownOpen && 'rotate-180'
              )}
            />
          </button>

          <AnimatePresence>
            {storeDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 rounded-card-lg border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] shadow-soft-lg overflow-hidden"
              >
                {mockStores.map((store) => (
                  <button
                    key={store.id}
                    onClick={() => {
                      setSelectedStore(store);
                      setStoreDropdownOpen(false);
                    }}
                    className={clsx(
                      'w-full flex items-center gap-2 px-3 py-2 hover:bg-[rgb(var(--color-bg-hover))] transition-colors',
                      selectedStore.id === store.id && 'bg-primary-50 dark:bg-primary-950/30'
                    )}
                  >
                    <div className="w-8 h-8 rounded-lg bg-[rgb(var(--color-bg-tertiary))] flex items-center justify-center">
                      <Store size={14} className="text-[rgb(var(--color-text-secondary))]" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-body-sm text-[rgb(var(--color-text-primary))]">{store.name}</div>
                      <div className="text-caption text-[rgb(var(--color-text-tertiary))]">
                        {store.productsCount} products
                      </div>
                    </div>
                    {selectedStore.id === store.id && (
                      <div className="w-2 h-2 rounded-full bg-primary-500" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Search */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-3 py-2"
        >
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-tertiary))]" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 pr-10 bg-[rgb(var(--color-bg-secondary))]"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-caption text-[rgb(var(--color-text-tertiary))]">
              <Command size={12} />
              <span>K</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-2">
        <ul className="space-y-1">
          {filteredNavItems.map((item) => (
            <li key={item.id}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className={clsx(
                      'w-full sidebar-item',
                      expandedItems.includes(item.id) && 'bg-[rgb(var(--color-bg-hover))]'
                    )}
                  >
                    {item.icon}
                    <AnimatePresence mode="wait">
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="flex-1 text-left"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {!collapsed && item.children && (
                      <ChevronDown
                        size={16}
                        className={clsx(
                          'transition-transform',
                          expandedItems.includes(item.id) && 'rotate-180'
                        )}
                      />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedItems.includes(item.id) && !collapsed && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-4 mt-1 space-y-1"
                      >
                        {item.children.map((child) => (
                          <li key={child.id}>
                            <button
                              onClick={() => onNavigate(child.id)}
                              className={clsx(
                                'w-full sidebar-item text-body-sm',
                                currentPage === child.id && 'sidebar-item-active'
                              )}
                            >
                              {child.icon}
                              <span>{child.label}</span>
                            </button>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <button
                  onClick={() => {
                    onNavigate(item.id);
                    if (item.children) {
                      toggleExpanded(item.id);
                    }
                  }}
                  className={clsx(
                    'w-full sidebar-item relative',
                    currentPage === item.id && 'sidebar-item-active',
                    collapsed && 'justify-center'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  {item.icon}
                  <AnimatePresence mode="wait">
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex-1 text-left"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {item.badge && !collapsed && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-1.5 py-0.5 text-caption bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                  {item.badge && collapsed && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"
                    />
                  )}
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapse Button */}
      <div className="border-t border-[rgb(var(--color-border-primary))] p-3">
        <button
          onClick={onToggleCollapse}
          className="w-full sidebar-item justify-center"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            size={20}
            className={clsx('transition-transform', collapsed && 'rotate-180')}
          />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
}
