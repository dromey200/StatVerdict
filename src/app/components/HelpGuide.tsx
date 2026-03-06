import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HelpGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TourStep {
  target: string; // CSS selector or ID
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    target: '[data-tour="scanner"]',
    title: '📷 Scanner',
    description: 'Upload gear screenshots for instant AI analysis with grades and recommendations.',
    position: 'bottom'
  },
  {
    target: '[data-tour="tutorial"]',
    title: '🎓 Tutorial',
    description: 'Learn best practices and see a live demo with a step-by-step guide.',
    position: 'bottom'
  },
  {
    target: '[data-tour="guide"]',
    title: '📖 Rating Guide',
    description: 'Understand our S-D grading system and what makes gear worth keeping.',
    position: 'bottom'
  },
  {
    target: '[data-tour="history"]',
    title: '🕒 History',
    description: 'Review all your past scans and track your gear progression over time.',
    position: 'bottom'
  },
  {
    target: '[data-tour="settings"]',
    title: '⚙️ Settings',
    description: 'Customize your preferences and configure auto-save options.',
    position: 'bottom'
  }
];

export function HelpGuide({ isOpen, onClose }: HelpGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }

    const updatePosition = () => {
      const step = tourSteps[currentStep];
      const elements = document.querySelectorAll(step.target);
      
      // Find the visible element (important for mobile vs desktop nav)
      let element: Element | null = null;
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        // Check if element is visible (has dimensions and is in viewport)
        if (rect.width > 0 && rect.height > 0) {
          element = el;
        }
      });
      
      if (element) {
        const rect = element.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const padding = 16;
        
        let top = 0;
        let left = 0;

        if (isMobile) {
          // On mobile, center the tooltip vertically on screen
          // This prevents it from covering the highlighted tabs
          const tooltipHeight = 180; // Approximate height
          top = (viewportHeight - tooltipHeight) / 2;
          left = padding;
        } else {
          // Desktop positioning logic
          const tooltipWidth = 320;
          const tooltipHeight = 200;
          
          switch (step.position) {
            case 'bottom':
              top = rect.bottom + 12;
              left = rect.left + rect.width / 2;
              break;
            case 'top':
              top = rect.top - tooltipHeight - 12;
              left = rect.left + rect.width / 2;
              break;
            case 'left':
              top = rect.top + rect.height / 2;
              left = rect.left - tooltipWidth - 12;
              break;
            case 'right':
              top = rect.top + rect.height / 2;
              left = rect.right + 12;
              break;
          }
          
          // Keep tooltip within viewport bounds on desktop
          if (left - tooltipWidth / 2 < padding) {
            left = tooltipWidth / 2 + padding;
          } else if (left + tooltipWidth / 2 > viewportWidth - padding) {
            left = viewportWidth - tooltipWidth / 2 - padding;
          }
          
          if (top + tooltipHeight > viewportHeight - padding) {
            top = viewportHeight - tooltipHeight - padding;
          } else if (top < padding) {
            top = padding;
          }
        }

        setTooltipPosition({ top, left });

        // Add highlight to element (for desktop only since we use spotlight on mobile)
        if (!isMobile) {
          element.classList.add('tour-highlight');
        }
        setHighlightRect(rect);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
      // Remove highlight from all elements
      document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
      });
    };
  }, [currentStep, isOpen, isMobile]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const step = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      {/* Semi-transparent overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Spotlight highlight - appears above overlay */}
      {highlightRect && (
        <div
          className="fixed pointer-events-none transition-all duration-300 z-45"
          style={{
            top: `${highlightRect.top - (isMobile ? 2 : 4)}px`,
            left: `${highlightRect.left - (isMobile ? 2 : 4)}px`,
            width: `${highlightRect.width + (isMobile ? 4 : 8)}px`,
            height: `${highlightRect.height + (isMobile ? 4 : 8)}px`,
          }}
        >
          <div 
            className={`w-full h-full rounded-lg ${
              isMobile 
                ? 'border-2 border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.4)]' 
                : 'border-4 border-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.4),0_0_20px_rgba(239,68,68,0.6)] animate-pulse'
            }`} 
          />
        </div>
      )}

      {/* Tooltip */}
      <div
        className={`fixed z-50 transition-all duration-300 ${isMobile ? 'left-4 right-4' : ''}`}
        style={
          isMobile 
            ? { top: `${tooltipPosition.top}px` }
            : {
                top: `${tooltipPosition.top}px`,
                left: `${tooltipPosition.left}px`,
                transform: step.position === 'bottom' || step.position === 'top' 
                  ? 'translateX(-50%)' 
                  : step.position === 'left' 
                    ? 'translate(-100%, -50%)' 
                    : 'translateY(-50%)'
              }
        }
      >
        <div className={`relative bg-slate-900 border-2 border-red-500/50 rounded-lg shadow-2xl shadow-red-500/20 p-4 ${isMobile ? 'w-full' : 'max-w-xs'}`}>
          {/* Close button - positioned in top right corner */}
          <button
            onClick={onClose}
            className="bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors p-1.5 rounded border-0 z-10"
            style={{ 
              position: 'absolute',
              top: '8px',
              right: '8px',
              left: 'auto',
              background: 'transparent' 
            }}
            aria-label="Close tour"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header with title - centered */}
          <div className="mb-3">
            <h3 className={`font-bold text-white text-center ${isMobile ? 'text-base' : 'text-lg'}`}>
              {step.title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            {step.description}
          </p>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-500">
              {currentStep + 1} of {tourSteps.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevious}
                disabled={isFirstStep}
                className={`rounded bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${
                  isMobile ? 'p-2' : 'p-1.5'
                }`}
                aria-label="Previous"
              >
                <ChevronLeft className={isMobile ? 'w-5 h-5' : 'w-4 h-4'} />
              </button>
              <button
                onClick={handleNext}
                className={`rounded bg-gradient-to-r from-red-600 to-orange-600 text-white font-medium hover:from-red-500 hover:to-orange-500 transition-all flex items-center gap-1 ${
                  isMobile ? 'px-4 py-2 text-sm' : 'px-3 py-1.5 text-xs'
                }`}
              >
                {isLastStep ? 'Finish' : 'Next'}
                {!isLastStep && <ChevronRight className={isMobile ? 'w-4 h-4' : 'w-3 h-3'} />}
              </button>
            </div>
          </div>
        </div>

        {/* Arrow pointer */}
        {!isMobile && step.position === 'bottom' && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-t-2 border-l-2 border-red-500/50 rotate-45" />
        )}
        {!isMobile && step.position === 'top' && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-b-2 border-r-2 border-red-500/50 rotate-45" />
        )}
        {!isMobile && step.position === 'left' && (
          <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 bg-slate-900 border-t-2 border-r-2 border-red-500/50 rotate-45" />
        )}
        {!isMobile && step.position === 'right' && (
          <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 bg-slate-900 border-b-2 border-l-2 border-red-500/50 rotate-45" />
        )}
      </div>

      {/* CSS for highlight effect */}
      <style>{`
        .tour-highlight {
          position: relative;
          z-index: 45;
          box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.4), 0 0 0 2px rgba(239, 68, 68, 0.8);
          border-radius: 0.5rem;
        }
      `}</style>
    </>
  );
}