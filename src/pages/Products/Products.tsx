import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  CheckSquare,
  Square,
  MoreHorizontal,
  Image,
  RefreshCw,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Database,
  PackageOpen,
} from 'lucide-react';
import { clsx } from 'clsx';
import { mockProducts } from '../../data/mockData';
import { fetchProducts } from '../../services/products';
import { useAsyncData } from '../../hooks/useAsyncData';
import type { Product } from '../../types';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function Products() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<keyof Product>('lastUpdated');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showActions, setShowActions] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 8;

  const {
    data: products,
    loading,
    error,
    source,
    refetch,
  } = useAsyncData(fetchProducts, mockProducts, []);

  const isDemo = source === 'demo';

  const filters = [
    { id: 'all', label: 'All Products', count: products.length },
    { id: 'active', label: 'Active', count: products.filter((p) => p.status === 'active').length },
    { id: 'draft', label: 'Draft', count: products.filter((p) => p.status === 'draft').length },
    { id: 'needs-creative', label: 'Needs Creative', count: products.filter((p) => p.creativeStatus === 'none' || p.creativeStatus === 'pending').length },
    { id: 'synced', label: 'Synced', count: products.filter((p) => p.feedStatus === 'synced').length },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      !activeFilter ||
      activeFilter === 'all' ||
      (activeFilter === 'active' && product.status === 'active') ||
      (activeFilter === 'draft' && product.status === 'draft') ||
      (activeFilter === 'needs-creative' && (product.creativeStatus === 'none' || product.creativeStatus === 'pending')) ||
      (activeFilter === 'synced' && product.feedStatus === 'synced');
    return matchesSearch && matchesFilter;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (aVal === undefined || bVal === undefined) return 0;
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    if (aVal instanceof Date && bVal instanceof Date) {
      return sortDirection === 'asc'
        ? aVal.getTime() - bVal.getTime()
        : bVal.getTime() - aVal.getTime();
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const allSelected =
    selectedProducts.length === paginatedProducts.length &&
    paginatedProducts.length > 0;
  const someSelected =
    selectedProducts.length > 0 && selectedProducts.length < paginatedProducts.length;

  const toggleSelectAll = () => {
    if (allSelected || someSelected) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(paginatedProducts.map((p) => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getCreativeStatusBadge = (status: Product['creativeStatus']) => {
    const config = {
      generated: { icon: <CheckCircle size={14} />, className: 'badge-success', label: 'Generated' },
      pending: { icon: <Clock size={14} />, className: 'badge-warning', label: 'Pending' },
      failed: { icon: <XCircle size={14} />, className: 'badge-error', label: 'Failed' },
      none: { icon: <AlertCircle size={14} />, className: 'badge-secondary', label: 'None' },
    };
    const { icon, className, label } = config[status];
    return (
      <span className={clsx(className, 'inline-flex items-center gap-1')}>
        {icon}
        {label}
      </span>
    );
  };

  const getFeedStatusBadge = (status: Product['feedStatus']) => {
    const config = {
      synced: { icon: <CheckCircle size={14} />, className: 'badge-success', label: 'Synced' },
      pending: { icon: <Clock size={14} />, className: 'badge-warning', label: 'Pending' },
      error: { icon: <XCircle size={14} />, className: 'badge-error', label: 'Error' },
      not_synced: { icon: <AlertCircle size={14} />, className: 'badge-secondary', label: 'Not Synced' },
    };
    const { icon, className, label } = config[status];
    return (
      <span className={clsx(className, 'inline-flex items-center gap-1')}>
        {icon}
        {label}
      </span>
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
          <div className="flex items-center gap-2">
            <h1 className="text-heading-xl text-[rgb(var(--color-text-primary))]">Products</h1>
            {isDemo && (
              <span className="badge-warning inline-flex items-center gap-1" title="Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to load live data">
                <Database size={12} />
                Demo data
              </span>
            )}
          </div>
          <p className="text-body-md text-[rgb(var(--color-text-secondary))]">
            {loading
              ? 'Loading products…'
              : `${products.length} products${isDemo ? ' (sample)' : ' from your Shopify store'}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary btn-md" onClick={refetch} disabled={loading}>
            <RefreshCw size={18} className={clsx(loading && 'animate-spin')} />
            {loading ? 'Refreshing…' : 'Sync Products'}
          </button>
          <button className="btn-primary btn-md">
            <Sparkles size={18} />
            Generate Images
          </button>
        </div>
      </motion.div>

      {/* Error banner — failed to reach the backend */}
      {error && (
        <motion.div
          variants={itemVariants}
          className="card-lg p-4 mb-6 bg-error-50 dark:bg-error-950/30 border-error-200 dark:border-error-800"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-error-600 shrink-0" />
              <div>
                <div className="font-medium text-[rgb(var(--color-text-primary))]">
                  Couldn’t load live products
                </div>
                <div className="text-caption text-[rgb(var(--color-text-secondary))]">
                  {error} — showing sample data instead.
                </div>
              </div>
            </div>
            <button className="btn-secondary btn-sm" onClick={refetch}>
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        </motion.div>
      )}

      {/* Filters & Search */}
      <motion.div variants={itemVariants} className="card-lg p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-tertiary))]" />
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Filter buttons */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id === 'all' ? null : filter.id)}
                className={clsx(
                  'btn btn-sm whitespace-nowrap',
                  (filter.id === 'all' ? !activeFilter : activeFilter === filter.id)
                    ? 'btn-primary'
                    : 'btn-secondary'
                )}
              >
                {filter.label}
                <span
                  className={clsx(
                    'px-1.5 py-0.5 rounded text-caption',
                    (filter.id === 'all' ? !activeFilter : activeFilter === filter.id)
                      ? 'bg-white/20'
                      : 'bg-[rgb(var(--color-bg-tertiary))]'
                  )}
                >
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          {/* More filters */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={clsx('btn btn-sm', showFilters ? 'btn-primary' : 'btn-secondary')}
          >
            <Filter size={18} />
            Filters
            <ChevronDown
              size={16}
              className={clsx('transition-transform', showFilters && 'rotate-180')}
            />
          </button>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-[rgb(var(--color-border-primary))]"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="label mb-1 block">Collection</label>
                  <select className="input">
                    <option>All Collections</option>
                    <option>Ethnic Wear</option>
                    <option>Kurtis</option>
                    <option>Bridal</option>
                    <option>Men</option>
                  </select>
                </div>
                <div>
                  <label className="label mb-1 block">Discount</label>
                  <select className="input">
                    <option>Any</option>
                    <option>No Discount</option>
                    <option>1-20%</option>
                    <option>21-40%</option>
                    <option>40%+</option>
                  </select>
                </div>
                <div>
                  <label className="label mb-1 block">Creative Status</label>
                  <select className="input">
                    <option>All</option>
                    <option>Generated</option>
                    <option>Pending</option>
                    <option>Failed</option>
                    <option>None</option>
                  </select>
                </div>
                <div>
                  <label className="label mb-1 block">Feed Status</label>
                  <select className="input">
                    <option>All</option>
                    <option>Synced</option>
                    <option>Pending</option>
                    <option>Error</option>
                    <option>Not Synced</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="card-lg p-4 mb-4 bg-primary-50 dark:bg-primary-950/30 border-primary-200 dark:border-primary-800"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckSquare size={20} className="text-primary-600" />
                <span className="font-medium text-[rgb(var(--color-text-primary))]">
                  {selectedProducts.length} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-secondary btn-sm">
                  <Image size={16} />
                  Generate Images
                </button>
                <button className="btn-secondary btn-sm">
                  <Layers size={16} />
                  Apply Template
                </button>
                <button className="btn-secondary btn-sm">
                  <Download size={16} />
                  Export
                </button>
                <button className="btn-secondary btn-sm">
                  <RefreshCw size={16} />
                  Sync to Meta
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <motion.div variants={itemVariants} className="card-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="table-cell w-12">
                  <button
                    onClick={toggleSelectAll}
                    className="w-5 h-5 rounded flex items-center justify-center border border-[rgb(var(--color-border-secondary))] hover:bg-[rgb(var(--color-bg-hover))] transition-colors"
                  >
                    {allSelected && <CheckSquare size={14} className="text-primary-600" />}
                    {someSelected && <Square size={14} className="text-primary-600" />}
                    {!allSelected && !someSelected && <Square size={14} className="text-transparent" />}
                  </button>
                </th>
                <th className="table-cell w-12"></th>
                <th
                  onClick={() => handleSort('name')}
                  className="table-cell cursor-pointer hover:bg-[rgb(var(--color-bg-hover))] min-w-[200px]"
                >
                  <div className="flex items-center gap-2">
                    Product
                    <ChevronDown
                      size={14}
                      className={clsx(
                        'transition-transform',
                        sortField === 'name' && sortDirection === 'asc' && 'rotate-180'
                      )}
                    />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('price')}
                  className="table-cell cursor-pointer hover:bg-[rgb(var(--color-bg-hover))]"
                >
                  <div className="flex items-center gap-2">
                    Price
                    <ChevronDown
                      size={14}
                      className={clsx(
                        'transition-transform',
                        sortField === 'price' && sortDirection === 'asc' && 'rotate-180'
                      )}
                    />
                  </div>
                </th>
                <th className="table-cell">Collection</th>
                <th className="table-cell">Status</th>
                <th className="table-cell">Creative</th>
                <th className="table-cell">Feed</th>
                <th
                  onClick={() => handleSort('lastUpdated')}
                  className="table-cell cursor-pointer hover:bg-[rgb(var(--color-bg-hover))]"
                >
                  <div className="flex items-center gap-2">
                    Updated
                    <ChevronDown
                      size={14}
                      className={clsx(
                        'transition-transform',
                        sortField === 'lastUpdated' && sortDirection === 'asc' && 'rotate-180'
                      )}
                    />
                  </div>
                </th>
                <th className="table-cell w-12"></th>
              </tr>
            </thead>
            <tbody>
              {loading &&
                products.length === 0 &&
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={`skeleton-${i}`} className="table-row">
                    <td className="table-cell" colSpan={10}>
                      <div className="h-10 rounded-lg bg-[rgb(var(--color-bg-tertiary))] animate-pulse" />
                    </td>
                  </tr>
                ))}

              {!loading && paginatedProducts.length === 0 && (
                <tr>
                  <td className="table-cell" colSpan={10}>
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                      <div className="w-12 h-12 rounded-xl bg-[rgb(var(--color-bg-tertiary))] flex items-center justify-center">
                        <PackageOpen size={24} className="text-[rgb(var(--color-text-tertiary))]" />
                      </div>
                      <div>
                        <div className="font-medium text-[rgb(var(--color-text-primary))]">
                          {searchQuery || activeFilter ? 'No products match your filters' : 'No products yet'}
                        </div>
                        <div className="text-caption text-[rgb(var(--color-text-secondary))]">
                          {searchQuery || activeFilter
                            ? 'Try clearing the search or filters.'
                            : 'Connect a Shopify store and sync to see products here.'}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}

              {paginatedProducts.map((product) => (
                <motion.tr
                  key={product.id}
                  variants={itemVariants}
                  className={clsx(
                    'table-row',
                    selectedProducts.includes(product.id) &&
                      'bg-primary-50/50 dark:bg-primary-950/20'
                  )}
                >
                  <td className="table-cell">
                    <button
                      onClick={() => toggleSelect(product.id)}
                      className="w-5 h-5 rounded flex items-center justify-center border border-[rgb(var(--color-border-secondary))] hover:bg-[rgb(var(--color-bg-hover))] transition-colors"
                    >
                      {selectedProducts.includes(product.id) ? (
                        <CheckSquare size={14} className="text-primary-600" />
                      ) : (
                        <Square size={14} className="text-transparent" />
                      )}
                    </button>
                  </td>
                  <td className="table-cell">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-[rgb(var(--color-bg-tertiary))]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="table-cell">
                    <div>
                      <div className="font-medium text-[rgb(var(--color-text-primary))] truncate max-w-xs">
                        {product.name}
                      </div>
                      <div className="text-caption text-[rgb(var(--color-text-tertiary))]">
                        {product.sku}
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div>
                      <div className="font-medium text-[rgb(var(--color-text-primary))]">
                        Rs. {product.price.toLocaleString()}
                      </div>
                      {product.compareAtPrice && (
                        <div className="flex items-center gap-2">
                          <span className="text-caption text-[rgb(var(--color-text-tertiary))] line-through">
                            Rs. {product.compareAtPrice.toLocaleString()}
                          </span>
                          {product.discount && (
                            <span className="badge-error text-caption">-{product.discount}%</span>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="badge-secondary">{product.collection}</span>
                  </td>
                  <td className="table-cell">
                    <span
                      className={clsx(
                        'badge',
                        product.status === 'active' && 'badge-success',
                        product.status === 'draft' && 'badge-secondary',
                        product.status === 'archived' && 'badge-warning'
                      )}
                    >
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </span>
                  </td>
                  <td className="table-cell">{getCreativeStatusBadge(product.creativeStatus)}</td>
                  <td className="table-cell">{getFeedStatusBadge(product.feedStatus)}</td>
                  <td className="table-cell text-caption text-[rgb(var(--color-text-secondary))]">
                    {product.lastUpdated.toLocaleDateString()}
                  </td>
                  <td className="table-cell">
                    <div className="relative">
                      <button
                        onClick={() => setShowActions(showActions === product.id ? null : product.id)}
                        className="btn-ghost btn-sm p-1"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                      <AnimatePresence>
                        {showActions === product.id && (
                          <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setShowActions(null)}
                            />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="dropdown right-0 z-50"
                            >
                              <button className="dropdown-item w-full">
                                <Image size={16} />
                                Generate Creative
                              </button>
                              <button className="dropdown-item w-full">
                                <Layers size={16} />
                                Apply Template
                              </button>
                              <button className="dropdown-item w-full">
                                <Edit3 size={16} />
                                Edit Product
                              </button>
                              <button className="dropdown-item w-full">
                                <ExternalLink size={16} />
                                View in Shopify
                              </button>
                              <div className="border-t border-[rgb(var(--color-border-primary))] my-1" />
                              <button className="dropdown-item w-full text-error-600">
                                <Trash2 size={16} />
                                Delete Creative
                              </button>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[rgb(var(--color-border-primary))]">
          <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
            {Math.min(currentPage * ITEMS_PER_PAGE, sortedProducts.length)} of{' '}
            {sortedProducts.length} products
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn-ghost btn-sm"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={clsx(
                    'btn btn-sm w-8',
                    currentPage === page ? 'btn-primary' : 'btn-ghost'
                  )}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="btn-ghost btn-sm"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
