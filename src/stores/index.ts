import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  storesRepo,
  productsRepo,
  templatesRepo,
  rulesRepo,
  jobsRepo,
  insightsRepo,
  activitiesRepo,
  metaCatalogsRepo,
  feedsRepo,
  type Store,
  type Product,
  type Template,
  type Rule,
  type GenerationJob,
  type Insight,
  type Activity,
  type MetaCatalogConnection,
  type Feed,
} from '../repositories';
import type { DataSource } from '../hooks/useAsyncData';

// ──────────────────────────────────────────────────────────────────────────
// STORES STORE
// ──────────────────────────────────────────────────────────────────────────

interface StoresState {
  stores: Store[];
  primaryStore: Store | null;
  loading: boolean;
  error: string | null;
  source: DataSource;
  fetch: () => Promise<void>;
  fetchPrimary: () => Promise<void>;
  disconnect: (id: string) => Promise<void>;
}

export const useStoresStore = create<StoresState>()(
  devtools(
    (set) => ({
      stores: [],
      primaryStore: null,
      loading: false,
      error: null,
      source: 'demo',

      fetch: async () => {
        set({ loading: true, error: null });
        try {
          const result = await storesRepo.fetchAll();
          set({ stores: result.data, source: result.source, loading: false });
        } catch (err) {
          set({ error: (err as Error).message, loading: false, stores: [] });
        }
      },

      fetchPrimary: async () => {
        set({ loading: true, error: null });
        try {
          const result = await storesRepo.fetchPrimary();
          set({ primaryStore: result.data, source: result.source, loading: false });
        } catch (err) {
          set({ error: (err as Error).message, loading: false, primaryStore: null });
        }
      },

      disconnect: async (id: string) => {
        try {
          await storesRepo.disconnect(id);
          set((state) => ({
            stores: state.stores.map((s) =>
              s.id === id ? { ...s, status: 'disconnected' as const } : s
            ),
          }));
        } catch (err) {
          set({ error: (err as Error).message });
        }
      },
    }),
    { name: 'stores-store' }
  )
);

// ──────────────────────────────────────────────────────────────────────────
// PRODUCTS STORE
// ──────────────────────────────────────────────────────────────────────────

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  source: DataSource;
  fetch: () => Promise<void>;
  fetchByStore: (storeId: string) => Promise<void>;
  count: () => Promise<number>;
}

export const useProductsStore = create<ProductsState>()(
  devtools(
    (set) => ({
      products: [],
      loading: false,
      error: null,
      source: 'demo',

      fetch: async () => {
        set({ loading: true, error: null });
        try {
          const result = await productsRepo.fetchAll();
          set({ products: result.data, source: result.source, loading: false });
        } catch (err) {
          set({ error: (err as Error).message, loading: false, products: [] });
        }
      },

      fetchByStore: async (storeId: string) => {
        set({ loading: true, error: null });
        try {
          const result = await productsRepo.fetchByStore(storeId);
          set({ products: result.data, source: result.source, loading: false });
        } catch (err) {
          set({ error: (err as Error).message, loading: false, products: [] });
        }
      },

      count: async () => {
        const result = await productsRepo.count();
        return result.data;
      },
    }),
    { name: 'products-store' }
  )
);

// ──────────────────────────────────────────────────────────────────────────
// TEMPLATES STORE
// ──────────────────────────────────────────────────────────────────────────

interface TemplatesState {
  templates: Template[];
  loading: boolean;
  error: string | null;
  source: DataSource;
  fetch: () => Promise<void>;
  create: (template: Omit<Template, 'id' | 'createdAt'>) => Promise<void>;
  update: (id: string, updates: Partial<Template>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useTemplatesStore = create<TemplatesState>()(
  devtools(
    (set, get) => ({
      templates: [],
      loading: false,
      error: null,
      source: 'demo',

      fetch: async () => {
        set({ loading: true, error: null });
        try {
          const result = await templatesRepo.fetchAll();
          set({ templates: result.data, source: result.source, loading: false });
        } catch (err) {
          set({ error: (err as Error).message, loading: false, templates: [] });
        }
      },

      create: async (template) => {
        try {
          const result = await templatesRepo.create(template);
          set((state) => ({ templates: [...state.templates, result.data] }));
        } catch (err) {
          set({ error: (err as Error).message });
        }
      },

      update: async (id, updates) => {
        try {
          const result = await templatesRepo.update(id, updates);
          set((state) => ({
            templates: state.templates.map((t) =>
              t.id === id ? result.data : t
            ),
          }));
        } catch (err) {
          set({ error: (err as Error).message });
        }
      },

      remove: async (id) => {
        try {
          await templatesRepo.delete(id);
          set((state) => ({
            templates: state.templates.filter((t) => t.id !== id),
          }));
        } catch (err) {
          set({ error: (err as Error).message });
        }
      },
    }),
    { name: 'templates-store' }
  )
);

// ──────────────────────────────────────────────────────────────────────────
// RULES STORE
// ──────────────────────────────────────────────────────────────────────────

interface RulesState {
  rules: Rule[];
  loading: boolean;
  error: string | null;
  source: DataSource;
  fetch: () => Promise<void>;
  create: (rule: Omit<Rule, 'id' | 'createdAt' | 'appliedCount'>) => Promise<void>;
  toggle: (id: string, active: boolean) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useRulesStore = create<RulesState>()(
  devtools(
    (set) => ({
      rules: [],
      loading: false,
      error: null,
      source: 'demo',

      fetch: async () => {
        set({ loading: true, error: null });
        try {
          const result = await rulesRepo.fetchAll();
          set({ rules: result.data, source: result.source, loading: false });
        } catch (err) {
          set({ error: (err as Error).message, loading: false, rules: [] });
        }
      },

      create: async (rule) => {
        try {
          const result = await rulesRepo.create(rule);
          set((state) => ({ rules: [...state.rules, result.data] }));
        } catch (err) {
          set({ error: (err as Error).message });
        }
      },

      toggle: async (id, active) => {
        try {
          await rulesRepo.toggle(id, active);
          set((state) => ({
            rules: state.rules.map((r) =>
              r.id === id ? { ...r, active } : r
            ),
          }));
        } catch (err) {
          set({ error: (err as Error).message });
        }
      },

      remove: async (id) => {
        try {
          await rulesRepo.delete(id);
          set((state) => ({
            rules: state.rules.filter((r) => r.id !== id),
          }));
        } catch (err) {
          set({ error: (err as Error).message });
        }
      },
    }),
    { name: 'rules-store' }
  )
);

// ──────────────────────────────────────────────────────────────────────────
// JOBS STORE
// ──────────────────────────────────────────────────────────────────────────

interface JobsState {
  jobs: GenerationJob[];
  loading: boolean;
  error: string | null;
  source: DataSource;
  counts: { total: number; queued: number; processing: number; completed: number; failed: number };
  fetch: () => Promise<void>;
  fetchCounts: () => Promise<void>;
}

export const useJobsStore = create<JobsState>()(
  devtools(
    (set) => ({
      jobs: [],
      loading: false,
      error: null,
      source: 'demo',
      counts: { total: 0, queued: 0, processing: 0, completed: 0, failed: 0 },

      fetch: async () => {
        set({ loading: true, error: null });
        try {
          const result = await jobsRepo.fetchAll();
          set({ jobs: result.data, source: result.source, loading: false });
        } catch (err) {
          set({ error: (err as Error).message, loading: false, jobs: [] });
        }
      },

      fetchCounts: async () => {
        try {
          const counts = await jobsRepo.counts();
          set({ counts });
        } catch (err) {
          set({ error: (err as Error).message });
        }
      },
    }),
    { name: 'jobs-store' }
  )
);

// ──────────────────────────────────────────────────────────────────────────
// INSIGHTS STORE
// ──────────────────────────────────────────────────────────────────────────

interface InsightsState {
  insights: Insight[];
  loading: boolean;
  error: string | null;
  source: DataSource;
  fetch: () => Promise<void>;
  dismiss: (id: string) => Promise<void>;
  markRead: (id: string) => Promise<void>;
}

export const useInsightsStore = create<InsightsState>()(
  devtools(
    (set) => ({
      insights: [],
      loading: false,
      error: null,
      source: 'demo',

      fetch: async () => {
        set({ loading: true, error: null });
        try {
          const result = await insightsRepo.fetchAll();
          set({ insights: result.data, source: result.source, loading: false });
        } catch (err) {
          set({ error: (err as Error).message, loading: false, insights: [] });
        }
      },

      dismiss: async (id) => {
        try {
          await insightsRepo.dismiss(id);
          set((state) => ({
            insights: state.insights.filter((i) => i.id !== id),
          }));
        } catch (err) {
          set({ error: (err as Error).message });
        }
      },

      markRead: async (id) => {
        try {
          await insightsRepo.markRead(id);
          // Don't filter, just mark as read (we could add isRead to Insight if needed)
        } catch (err) {
          set({ error: (err as Error).message });
        }
      },
    }),
    { name: 'insights-store' }
  )
);

// ──────────────────────────────────────────────────────────────────────────
// ACTIVITIES STORE
// ──────────────────────────────────────────────────────────────────────────

interface ActivitiesState {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  source: DataSource;
  fetch: () => Promise<void>;
  add: (activity: Omit<Activity, 'id' | 'timestamp'>) => Promise<void>;
}

export const useActivitiesStore = create<ActivitiesState>()(
  devtools(
    (set) => ({
      activities: [],
      loading: false,
      error: null,
      source: 'demo',

      fetch: async () => {
        set({ loading: true, error: null });
        try {
          const result = await activitiesRepo.fetchAll();
          set({ activities: result.data, source: result.source, loading: false });
        } catch (err) {
          set({ error: (err as Error).message, loading: false, activities: [] });
        }
      },

      add: async (activity) => {
        try {
          await activitiesRepo.create(activity);
          // Optimistically add to the list
          set((state) => ({
            activities: [
              {
                ...activity,
                id: `temp-${Date.now()}`,
                timestamp: new Date(),
              },
              ...state.activities,
            ].slice(0, 20),
          }));
        } catch (err) {
          set({ error: (err as Error).message });
        }
      },
    }),
    { name: 'activities-store' }
  )
);

// ──────────────────────────────────────────────────────────────────────────
// META CATALOGS STORE
// ──────────────────────────────────────────────────────────────────────────

interface MetaCatalogsState {
  catalogs: MetaCatalogConnection[];
  loading: boolean;
  error: string | null;
  source: DataSource;
  fetch: () => Promise<void>;
}

export const useMetaCatalogsStore = create<MetaCatalogsState>()(
  devtools(
    (set) => ({
      catalogs: [],
      loading: false,
      error: null,
      source: 'demo',

      fetch: async () => {
        set({ loading: true, error: null });
        try {
          const result = await metaCatalogsRepo.fetchAll();
          set({ catalogs: result.data, source: result.source, loading: false });
        } catch (err) {
          set({ error: (err as Error).message, loading: false, catalogs: [] });
        }
      },
    }),
    { name: 'meta-catalogs-store' }
  )
);

// ──────────────────────────────────────────────────────────────────────────
// FEEDS STORE
// ──────────────────────────────────────────────────────────────────────────

interface FeedsState {
  feeds: Feed[];
  loading: boolean;
  error: string | null;
  source: DataSource;
  fetch: () => Promise<void>;
}

export const useFeedsStore = create<FeedsState>()(
  devtools(
    (set) => ({
      feeds: [],
      loading: false,
      error: null,
      source: 'demo',

      fetch: async () => {
        set({ loading: true, error: null });
        try {
          const result = await feedsRepo.fetchAll();
          set({ feeds: result.data, source: result.source, loading: false });
        } catch (err) {
          set({ error: (err as Error).message, loading: false, feeds: [] });
        }
      },
    }),
    { name: 'feeds-store' }
  )
);

// ──────────────────────────────────────────────────────────────────────────
// DASHBOARD AGGREGATE STORE
// ──────────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  primaryStore: { name: string; productsCount: number } | null;
  storesConnected: number;
  productsSynced: number;
  creativesGenerated: number;
  metaUpdates: number;
  successRate: number;
  processing: number;
  queued: number;
  failed: number;
  lastSync: Date | null;
}

interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  source: DataSource;
  fetch: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set) => ({
      stats: null,
      loading: false,
      error: null,
      source: 'demo',

      fetch: async () => {
        set({ loading: true, error: null });
        try {
          const [storesResult, productsResult, jobsResult] = await Promise.all([
            storesRepo.fetchAll(),
            productsRepo.count(),
            jobsRepo.counts(),
          ]);

          const terminal = jobsResult.completed + jobsResult.failed;
          const successRate = terminal > 0
            ? Math.round((jobsResult.completed / terminal) * 1000) / 10
            : 100;

          const primaryStore = storesResult.data[0] || null;

          const stats: DashboardStats = {
            primaryStore: primaryStore
              ? { name: primaryStore.name, productsCount: primaryStore.productsCount }
              : null,
            storesConnected: storesResult.data.length,
            productsSynced: productsResult.data,
            creativesGenerated: jobsResult.completed,
            metaUpdates: jobsResult.completed,
            successRate,
            processing: jobsResult.processing,
            queued: jobsResult.queued,
            failed: jobsResult.failed,
            lastSync: primaryStore?.lastSync || null,
          };

          set({ stats, source: storesResult.source, loading: false });
        } catch (err) {
          set({ error: (err as Error).message, loading: false, stats: null });
        }
      },
    }),
    { name: 'dashboard-store' }
  )
);
