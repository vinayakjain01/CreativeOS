import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Moon,
  Bell,
  Settings,
  HelpCircle,
  Search,
  Command,
  User,
  ChevronDown,
  LogOut,
  Shield,
  Store,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../../hooks/useTheme';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const notifications = [
    { id: '1', title: '32 products need creative updates', time: '2 hours ago', unread: true },
    { id: '2', title: 'Meta feed refreshed successfully', time: '4 hours ago', unread: true },
    { id: '3', title: 'New rule applied to 12 products', time: '1 day ago', unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-[rgb(var(--color-bg-primary))]/80 backdrop-blur-xl border-b border-[rgb(var(--color-border-primary))]">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left - Title */}
        <div>
          <h1 className="text-heading-m text-[rgb(var(--color-text-primary))]">{title}</h1>
          {subtitle && (
            <p className="text-body-sm text-[rgb(var(--color-text-secondary))]">{subtitle}</p>
          )}
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <button className="btn-ghost btn-sm" onClick={() => setShowSearch(true)}>
            <Search size={18} />
            <span className="hidden lg:block">Search</span>
            <div className="hidden md:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[rgb(var(--color-bg-tertiary))] text-caption text-[rgb(var(--color-text-tertiary))]">
              <Command size={10} />
              <span>K</span>
            </div>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="btn-ghost btn-sm"
            title={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <motion.div
              initial={false}
              animate={{ rotate: resolvedTheme === 'dark' ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </motion.div>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="btn-ghost btn-sm relative"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-error-500 text-white text-caption flex items-center justify-center rounded-full"
                >
                  {unreadCount}
                </motion.span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-80 rounded-card-lg border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] shadow-soft-lg overflow-hidden z-50"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[rgb(var(--color-border-primary))]">
                      <h3 className="font-semibold text-[rgb(var(--color-text-primary))]">Notifications</h3>
                      <button className="text-body-sm text-primary-600 hover:text-primary-700">Mark all read</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notification) => (
                        <button
                          key={notification.id}
                          className={clsx(
                            'w-full flex items-start gap-3 px-4 py-3 hover:bg-[rgb(var(--color-bg-hover))] transition-colors text-left',
                            notification.unread && 'bg-primary-50/50 dark:bg-primary-950/20'
                          )}
                        >
                          <div
                            className={clsx(
                              'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                              notification.unread ? 'bg-primary-500' : 'bg-transparent'
                            )}
                          />
                          <div>
                            <p className="text-body-md text-[rgb(var(--color-text-primary))]">
                              {notification.title}
                            </p>
                            <p className="text-caption text-[rgb(var(--color-text-tertiary))]">
                              {notification.time}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="px-4 py-3 border-t border-[rgb(var(--color-border-primary))]">
                      <button className="w-full btn-secondary btn-sm">View all notifications</button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Help */}
          <button className="btn-ghost btn-sm hidden lg:block">
            <HelpCircle size={18} />
            <span>Help</span>
          </button>

          {/* Settings */}
          <button className="btn-ghost btn-sm hidden lg:block">
            <Settings size={18} />
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-[rgb(var(--color-border-primary))] mx-2" />

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[rgb(var(--color-bg-hover))] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <span className="text-white text-body-sm font-medium">JD</span>
              </div>
              <div className="hidden md:block text-left">
                <div className="text-body-sm font-medium text-[rgb(var(--color-text-primary))]">John Doe</div>
                <div className="text-caption text-[rgb(var(--color-text-tertiary))]">Admin</div>
              </div>
              <ChevronDown size={16} className="text-[rgb(var(--color-text-tertiary))]" />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-card-lg border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] shadow-soft-lg overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-[rgb(var(--color-border-primary))]">
                      <div className="text-body-md font-medium text-[rgb(var(--color-text-primary))]">
                        John Doe
                      </div>
                      <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">
                        john@fashionforward.com
                      </div>
                    </div>
                    <div className="py-1">
                      <button className="dropdown-item w-full">
                        <User size={16} />
                        <span>Profile</span>
                      </button>
                      <button className="dropdown-item w-full">
                        <Store size={16} />
                        <span>Store Settings</span>
                      </button>
                      <button className="dropdown-item w-full">
                        <Shield size={16} />
                        <span>Admin Settings</span>
                      </button>
                    </div>
                    <div className="border-t border-[rgb(var(--color-border-primary))] py-1">
                      <button className="dropdown-item w-full text-error-600">
                        <LogOut size={16} />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <AnimatePresence>
        {showSearch && (
          <>
            <div
              className="fixed inset-0 bg-black/30 dark:bg-black/50 z-50"
              onClick={() => setShowSearch(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-xl z-50"
            >
              <div className="relative rounded-card-lg border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] shadow-soft-lg overflow-hidden">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-tertiary))]" />
                <input
                  type="text"
                  placeholder="Search products, templates, rules..."
                  autoFocus
                  className="w-full pl-12 pr-4 py-4 text-body-lg bg-transparent outline-none"
                />
                <div className="border-t border-[rgb(var(--color-border-primary))] px-4 py-3">
                  <div className="text-body-sm text-[rgb(var(--color-text-secondary))] mb-2">
                    Quick Actions
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Generate Images', 'Sync Products', 'New Rule', 'Add Template'].map(
                      (action) => (
                        <button
                          key={action}
                          className="px-3 py-1.5 rounded-lg text-body-sm bg-[rgb(var(--color-bg-tertiary))] hover:bg-[rgb(var(--color-bg-hover))] transition-colors"
                        >
                          {action}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
