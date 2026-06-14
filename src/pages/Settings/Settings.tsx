import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Store,
  Bell,
  Link,
  Shield,
  Palette,
  Globe,
  Moon,
  Sun,
  Check,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Database,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../../hooks/useTheme';
import { mockStores, mockMetaCatalog } from '../../data/mockData';
import { useAsyncData } from '../../hooks/useAsyncData';
import { fetchStores } from '../../services/stores';

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

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('store');

  const { data: stores, loading, error, source, refetch } = useAsyncData(fetchStores, mockStores, []);
  const isDemo = source === 'demo';

  const sections = [
    { id: 'store', label: 'Store Settings', icon: <Store size={20} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={20} /> },
    { id: 'meta', label: 'Meta Integration', icon: <Link size={20} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
    { id: 'security', label: 'Security', icon: <Shield size={20} /> },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-heading-xl text-[rgb(var(--color-text-primary))]">Settings</h1>
        <p className="text-body-md text-[rgb(var(--color-text-secondary))]">
          Manage your account settings and preferences
        </p>
      </motion.div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <motion.div variants={itemVariants} className="w-64 flex-shrink-0">
          <div className="card-lg p-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={clsx(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                  activeSection === section.id
                    ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300'
                    : 'text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-bg-hover))]'
                )}
              >
                {section.icon}
                <span className="flex-1">{section.label}</span>
                {activeSection === section.id && <Check size={16} />}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div variants={itemVariants} className="flex-1">
          {activeSection === 'store' && (
            <div className="card-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-heading-m text-[rgb(var(--color-text-primary))]">
                    Store Settings
                  </h2>
                  {isDemo && (
                    <span className="badge-warning inline-flex items-center gap-1" title="Set Supabase env vars to load live stores">
                      <Database size={12} />
                      Demo data
                    </span>
                  )}
                </div>
                <button className="btn-ghost btn-sm" onClick={refetch} disabled={loading}>
                  <RefreshCw size={16} className={clsx(loading && 'animate-spin')} />
                  Refresh
                </button>
              </div>

              <div className="space-y-6">
                {/* Connected Stores */}
                {error && (
                  <div className="p-3 rounded-lg bg-error-50 dark:bg-error-950/30 border border-error-200 dark:border-error-800 text-body-sm text-[rgb(var(--color-text-primary))]">
                    {error} — showing sample data instead.
                  </div>
                )}

                {loading && stores.length === 0 && (
                  <div className="h-20 rounded-card-lg bg-[rgb(var(--color-bg-tertiary))] animate-pulse" />
                )}

                {!loading && stores.length === 0 && (
                  <div className="p-6 rounded-card-lg border border-dashed border-[rgb(var(--color-border-primary))] text-center">
                    <div className="font-medium text-[rgb(var(--color-text-primary))]">No stores connected</div>
                    <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">
                      Connect a Shopify store to start syncing products.
                    </div>
                  </div>
                )}

                {stores.map((store) => (
                  <div
                    key={store.id}
                    className="p-4 rounded-card-lg bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border-primary))]"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                          <Store size={24} className="text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[rgb(var(--color-text-primary))]">{store.name}</h3>
                          <p className="text-body-sm text-[rgb(var(--color-text-secondary))]">
                            {store.domain} · {store.productsCount.toLocaleString()} products
                          </p>
                        </div>
                      </div>
                      <span className={clsx(store.status === 'connected' ? 'badge-success' : 'badge-secondary')}>
                        {store.status === 'connected' ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <a
                        className="btn-secondary btn-sm"
                        href={`https://${store.domain}/admin`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink size={16} />
                        Open in Shopify
                      </a>
                      <button className="btn-ghost btn-sm text-error-600">Disconnect</button>
                    </div>
                  </div>
                ))}

                {/* Sync Settings */}
                <div>
                  <h3 className="font-semibold text-body-md text-[rgb(var(--color-text-primary))] mb-4">
                    Sync Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-card-lg border border-[rgb(var(--color-border-primary))]">
                      <div>
                        <div className="font-medium text-[rgb(var(--color-text-primary))]">
                          Auto-sync products
                        </div>
                        <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">
                          Automatically sync products from Shopify
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-[rgb(var(--color-bg-tertiary))] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-card-lg border border-[rgb(var(--color-border-primary))]">
                      <div>
                        <div className="font-medium text-[rgb(var(--color-text-primary))]">
                          Sync interval
                        </div>
                        <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">
                          How often to check for updates
                        </div>
                      </div>
                      <select className="input w-40">
                        <option>Every 15 minutes</option>
                        <option>Every 30 minutes</option>
                        <option>Every hour</option>
                        <option>Every 6 hours</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="card-lg p-6">
              <h2 className="text-heading-m text-[rgb(var(--color-text-primary))] mb-6">
                Appearance
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-body-md text-[rgb(var(--color-text-primary))] mb-4">
                    Theme
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'light', label: 'Light', icon: <Sun size={24} /> },
                      { id: 'dark', label: 'Dark', icon: <Moon size={24} /> },
                      { id: 'system', label: 'System', icon: <Globe size={24} /> },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id as typeof theme)}
                        className={clsx(
                          'card p-4 flex flex-col items-center gap-3 hover:shadow-soft transition-all',
                          theme === t.id && 'ring-2 ring-primary-500'
                        )}
                      >
                        <div
                          className={clsx(
                            'w-12 h-12 rounded-lg flex items-center justify-center',
                            theme === t.id
                              ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-600'
                              : 'bg-[rgb(var(--color-bg-tertiary))] text-[rgb(var(--color-text-secondary))]'
                          )}
                        >
                          {t.icon}
                        </div>
                        <span className="font-medium text-[rgb(var(--color-text-primary))]">
                          {t.label}
                        </span>
                        {theme === t.id && <Check size={16} className="text-primary-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'meta' && (
            <div className="card-lg p-6">
              <h2 className="text-heading-m text-[rgb(var(--color-text-primary))] mb-6">
                Meta Integration
              </h2>

              <div className="space-y-6">
                <div className="p-4 rounded-card-lg bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border-primary))]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                        <Link size={24} className="text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[rgb(var(--color-text-primary))]">
                          Meta Business Account
                        </h3>
                        <p className="text-body-sm text-[rgb(var(--color-text-secondary))]">
                          {mockMetaCatalog.businessAccountId}
                        </p>
                      </div>
                    </div>
                    <span className="badge-success">Connected</span>
                  </div>
                  <div className="flex gap-3">
                    <button className="btn-secondary btn-sm">
                      <ExternalLink size={16} />
                      Open Business Manager
                    </button>
                    <button className="btn-ghost btn-sm text-error-600">Reconnect</button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-card-lg border border-[rgb(var(--color-border-primary))]">
                  <div>
                    <div className="font-medium text-[rgb(var(--color-text-primary))]">
                      Auto-refresh catalog
                    </div>
                    <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">
                      Automatically refresh Meta catalog feed
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-[rgb(var(--color-bg-tertiary))] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="card-lg p-6">
              <h2 className="text-heading-m text-[rgb(var(--color-text-primary))] mb-6">
                Notifications
              </h2>

              <div className="space-y-4">
                {[
                  { id: 'generation', label: 'Generation complete', desc: 'Notify when images finish generating' },
                  { id: 'sync', label: 'Sync complete', desc: 'Notify when product sync finishes' },
                  { id: 'errors', label: 'Error alerts', desc: 'Notify when errors occur' },
                  { id: 'updates', label: 'Product updates', desc: 'Notify when products are updated' },
                ].map((n) => (
                  <div
                    key={n.id}
                    className="flex items-center justify-between p-4 rounded-card-lg border border-[rgb(var(--color-border-primary))]"
                  >
                    <div>
                      <div className="font-medium text-[rgb(var(--color-text-primary))]">{n.label}</div>
                      <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">{n.desc}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-[rgb(var(--color-bg-tertiary))] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="card-lg p-6">
              <h2 className="text-heading-m text-[rgb(var(--color-text-primary))] mb-6">
                Security
              </h2>

              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 rounded-card-lg border border-[rgb(var(--color-border-primary))] hover:bg-[rgb(var(--color-bg-hover))] transition-colors text-left">
                  <div>
                    <div className="font-medium text-[rgb(var(--color-text-primary))]">Change password</div>
                    <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">
                      Update your account password
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-[rgb(var(--color-text-tertiary))]" />
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-card-lg border border-[rgb(var(--color-border-primary))] hover:bg-[rgb(var(--color-bg-hover))] transition-colors text-left">
                  <div>
                    <div className="font-medium text-[rgb(var(--color-text-primary))]">Two-factor authentication</div>
                    <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">
                      Add an extra layer of security
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-[rgb(var(--color-text-tertiary))]" />
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-card-lg border border-[rgb(var(--color-border-primary))] hover:bg-[rgb(var(--color-bg-hover))] transition-colors text-left">
                  <div>
                    <div className="font-medium text-[rgb(var(--color-text-primary))]">Active sessions</div>
                    <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">
                      Manage your active login sessions
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-[rgb(var(--color-text-tertiary))]" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
