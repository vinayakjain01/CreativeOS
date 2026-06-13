import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  Package,
  Layers,
  GitBranch,
  Image,
  Database,
  Zap,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { clsx } from 'clsx';

const steps = [
  { id: 1, title: 'Connect Shopify', icon: <Store size={24} />, description: 'Connect your Shopify store to sync products' },
  { id: 2, title: 'Sync Products', icon: <Package size={24} />, description: 'Import your product catalog' },
  { id: 3, title: 'Create Template', icon: <Layers size={24} />, description: 'Design your first creative template' },
  { id: 4, title: 'Create Rule', icon: <GitBranch size={24} />, description: 'Set up automation rules' },
  { id: 5, title: 'Generate Creatives', icon: <Image size={24} />, description: 'Generate AI-powered images' },
  { id: 6, title: 'Connect Meta', icon: <Database size={24} />, description: 'Link your Meta Business account' },
  { id: 7, title: 'Launch Automation', icon: <Zap size={24} />, description: 'Enable automated sync and updates' },
];

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const progress = (completedSteps.length / steps.length) * 100;

  const completeStep = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
    if (stepId < steps.length) {
      setCurrentStep(stepId + 1);
    } else {
      onComplete();
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg-secondary))] flex flex-col">
      {/* Header */}
      <header className="h-16 px-6 flex items-center justify-between border-b border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="font-semibold text-heading-m text-[rgb(var(--color-text-primary))]">CreativeOS</span>
        </div>
        <button onClick={skipOnboarding} className="btn-ghost btn-sm">
          Skip setup
        </button>
      </header>

      {/* Progress Bar */}
      <div className="px-6 py-4 bg-[rgb(var(--color-bg-primary))] border-b border-[rgb(var(--color-border-primary))]">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-body-sm text-[rgb(var(--color-text-secondary))]">Getting Started</span>
            <span className="text-body-sm font-medium text-[rgb(var(--color-text-primary))]">
              {Math.round(progress)}% complete
            </span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Steps Sidebar */}
        <aside className="w-80 border-r border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] p-6 hidden lg:block">
          <div className="space-y-2">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={clsx(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                  currentStep === step.id && 'bg-primary-50 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-800',
                  completedSteps.includes(step.id) && 'bg-success-50 dark:bg-success-950/30',
                  currentStep !== step.id && !completedSteps.includes(step.id) && 'hover:bg-[rgb(var(--color-bg-hover))]'
                )}
              >
                <div
                  className={clsx(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    completedSteps.includes(step.id) && 'bg-success-500 text-white',
                    currentStep === step.id && !completedSteps.includes(step.id) && 'bg-primary-500 text-white',
                    currentStep !== step.id && !completedSteps.includes(step.id) && 'bg-[rgb(var(--color-bg-tertiary))] text-[rgb(var(--color-text-tertiary))]'
                  )}
                >
                  {completedSteps.includes(step.id) ? <Check size={20} /> : step.icon}
                </div>
                <div className="text-left">
                  <div
                    className={clsx(
                      'font-medium text-body-sm',
                      (currentStep === step.id || completedSteps.includes(step.id))
                        ? 'text-[rgb(var(--color-text-primary))]'
                        : 'text-[rgb(var(--color-text-tertiary))]'
                    )}
                  >
                    {step.title}
                  </div>
                  <div className="text-caption text-[rgb(var(--color-text-tertiary))]">
                    Step {step.id}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Step Content */}
        <main className="flex-1 p-6 flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-xl w-full"
              >
                <StepContent step={steps[currentStep - 1]} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-[rgb(var(--color-border-primary))]">
            <button
              onClick={goBack}
              disabled={currentStep === 1}
              className="btn-secondary btn-md"
            >
              <ArrowLeft size={18} />
              Back
            </button>
            <div className="flex items-center gap-3">
              {currentStep < steps.length && (
                <button onClick={() => completeStep(currentStep)} className="btn-ghost btn-md">
                  Skip for now
                </button>
              )}
              <button
                onClick={() => completeStep(currentStep)}
                className="btn-primary btn-md"
              >
                {currentStep === steps.length ? (
                  <>
                    Complete Setup
                    <Check size={18} />
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StepContent({ step }: { step: typeof steps[0] }) {
  return (
    <div className="text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-card-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow">
        {step.icon}
      </div>
      <h2 className="text-heading-xl text-[rgb(var(--color-text-primary))] mb-3">{step.title}</h2>
      <p className="text-body-lg text-[rgb(var(--color-text-secondary))] mb-8">
        {step.description}
      </p>

      {step.id === 1 && (
        <div className="card-lg p-6">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-[rgb(var(--color-bg-secondary))] mb-4">
            <Store size={32} className="text-primary-600" />
            <div className="flex-1 text-left">
              <div className="font-medium text-[rgb(var(--color-text-primary))]">Shopify Store</div>
              <div className="text-body-sm text-[rgb(var(--color-text-secondary))]">
                Connect your Shopify store to get started
              </div>
            </div>
          </div>
          <button className="w-full btn-primary btn-lg">
            <ExternalLink size={18} />
            Connect Shopify Store
          </button>
        </div>
      )}

      {step.id === 2 && (
        <div className="card-lg p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-[rgb(var(--color-text-secondary))]">Products to sync</span>
              <span className="font-medium text-[rgb(var(--color-text-primary))]">All products</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-[rgb(var(--color-text-secondary))]">Estimated time</span>
              <span className="font-medium text-[rgb(var(--color-text-primary))]">~2 minutes</span>
            </div>
          </div>
        </div>
      )}

      {step.id === 3 && (
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-4 aspect-square flex items-center justify-center bg-[rgb(var(--color-bg-tertiary)))] hover:border-primary-500 cursor-pointer transition-colors">
              <span className="text-body-sm text-[rgb(var(--color-text-secondary))]">Template {i}</span>
            </div>
          ))}
        </div>
      )}

      {step.id === 6 && (
        <div className="card-lg p-6">
          <button className="w-full btn-primary btn-lg">
            <Database size={18} />
            Connect Meta Business
          </button>
        </div>
      )}

      {step.id === 7 && (
        <div className="card-lg p-6">
          <div className="space-y-4">
            {[
              { label: 'Auto-sync products', checked: true },
              { label: 'Auto-generate creatives', checked: true },
              { label: 'Auto-update Meta catalog', checked: true },
            ].map((item) => (
              <label key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-[rgb(var(--color-bg-secondary))] cursor-pointer">
                <span className="text-body-md text-[rgb(var(--color-text-primary))]">{item.label}</span>
                <input
                  type="checkbox"
                  defaultChecked={item.checked}
                  className="w-5 h-5 rounded border-[rgb(var(--color-border-primary))]"
                />
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
