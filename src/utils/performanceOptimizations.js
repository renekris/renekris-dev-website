// Performance optimization utilities for the cyberpunk portfolio

/**
 * Intersection Observer for lazy loading and scroll animations
 */
export class IntersectionObserverManager {
  constructor() {
    this.observers = new Map();
    this.isSupported = 'IntersectionObserver' in window;
  }

  /**
   * Create an intersection observer for fade-in animations
   * @param {Function} callback - Callback function when element intersects
   * @param {Object} options - Intersection observer options
   */
  createFadeInObserver(callback, options = {}) {
    if (!this.isSupported) {
      // Fallback for older browsers
      callback({ isIntersecting: true });
      return null;
    }

    const defaultOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1,
      ...options
    };

    return new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          callback(entry);
        }
      });
    }, defaultOptions);
  }

  /**
   * Create an intersection observer for lazy loading images
   * @param {Function} callback - Callback function when image should load
   * @param {Object} options - Intersection observer options
   */
  createLazyLoadObserver(callback, options = {}) {
    if (!this.isSupported) {
      // Fallback for older browsers
      callback({ isIntersecting: true });
      return null;
    }

    const defaultOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0,
      ...options
    };

    return new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry);
        }
      });
    }, defaultOptions);
  }

  /**
   * Observe elements for fade-in animation
   * @param {NodeList|Array} elements - Elements to observe
   * @param {Object} options - Observer options
   */
  observeFadeIn(elements, options = {}) {
    const observer = this.createFadeInObserver((entry) => {
      // Element is now visible, animation handled by CSS
    }, options);

    if (!observer) return;

    elements.forEach(element => {
      element.classList.add('fade-in-on-scroll');
      observer.observe(element);
    });

    this.observers.set('fadeIn', observer);
  }

  /**
   * Clean up all observers
   */
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.isSupported = 'performance' in window;
  }

  /**
   * Mark the start of a performance measurement
   * @param {string} name - Name of the measurement
   */
  markStart(name) {
    if (!this.isSupported) return;
    performance.mark(`${name}-start`);
  }

  /**
   * Mark the end of a performance measurement and calculate duration
   * @param {string} name - Name of the measurement
   */
  markEnd(name) {
    if (!this.isSupported) return;
    
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name)[0];
    this.metrics.set(name, measure.duration);
    
    return measure.duration;
  }

  /**
   * Get all performance metrics
   */
  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  /**
   * Log performance metrics to console (development only)
   */
  logMetrics() {
    if (process.env.NODE_ENV === 'development') {
      console.group('🚀 Performance Metrics');
      this.metrics.forEach((duration, name) => {
        const color = duration < 100 ? 'green' : duration < 500 ? 'orange' : 'red';
        console.log(`%c${name}: ${duration.toFixed(2)}ms`, `color: ${color}`);
      });
      console.groupEnd();
    }
  }
}

/**
 * Debounce utility for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute immediately on first call
 */
export function debounce(func, wait, immediate = false) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

/**
 * Throttle utility for performance optimization
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit time in milliseconds
 */
export function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Lazy load images with intersection observer
 * @param {string} selector - CSS selector for images to lazy load
 * @param {Object} options - Lazy loading options
 */
export function initLazyLoading(selector = '[data-src]', options = {}) {
  const images = document.querySelectorAll(selector);
  if (images.length === 0) return;

  const observerManager = new IntersectionObserverManager();
  const observer = observerManager.createLazyLoadObserver((entry) => {
    const img = entry.target;
    const src = img.dataset.src;
    
    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
      img.classList.remove('loading-skeleton');
      observer.unobserve(img);
    }
  }, options);

  if (!observer) {
    // Fallback: load all images immediately
    images.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.remove('loading-skeleton');
      }
    });
    return;
  }

  images.forEach(img => {
    img.classList.add('loading-skeleton');
    observer.observe(img);
  });
}

/**
 * Optimize animations for better performance
 * @param {NodeList|Array} elements - Elements with animations
 */
export function optimizeAnimations(elements) {
  elements.forEach(element => {
    // Add GPU acceleration classes
    element.classList.add('gpu-accelerated');
    
    // Use will-change property for better performance
    if (element.style.transform) {
      element.classList.add('will-change-transform');
    }
    
    if (element.style.opacity !== undefined) {
      element.classList.add('will-change-opacity');
    }
  });
}

/**
 * Preload critical resources
 * @param {Array} resources - Array of resource URLs to preload
 * @param {string} type - Type of resource (font, image, script, style)
 */
export function preloadResources(resources, type = 'image') {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    link.as = type;
    
    if (type === 'font') {
      link.crossOrigin = 'anonymous';
    }
    
    document.head.appendChild(link);
  });
}

/**
 * Memory cleanup utility
 */
export class MemoryManager {
  constructor() {
    this.cleanupFunctions = new Set();
  }

  /**
   * Register a cleanup function
   * @param {Function} cleanupFn - Function to call during cleanup
   */
  registerCleanup(cleanupFn) {
    this.cleanupFunctions.add(cleanupFn);
  }

  /**
   * Execute all cleanup functions
   */
  cleanup() {
    this.cleanupFunctions.forEach(fn => {
      try {
        fn();
      } catch (error) {
        console.warn('Cleanup function failed:', error);
      }
    });
    this.cleanupFunctions.clear();
  }
}

/**
 * Device capabilities detection
 */
export const deviceCapabilities = {
  // Check if device supports hardware acceleration
  supportsHardwareAcceleration() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  },

  // Check if device has touch capability
  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  // Check if device prefers reduced motion
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Estimate device performance tier
  getPerformanceTier() {
    const cores = navigator.hardwareConcurrency || 2;
    const memory = navigator.deviceMemory || 2;
    const connection = navigator.connection?.effectiveType;
    
    if (cores >= 4 && memory >= 4 && connection === '4g') {
      return 'high';
    } else if (cores >= 2 && memory >= 2) {
      return 'medium';
    }
    return 'low';
  },

  // Get optimal animation settings based on device capabilities
  getOptimalAnimationSettings() {
    const tier = this.getPerformanceTier();
    const reducedMotion = this.prefersReducedMotion();
    
    if (reducedMotion) {
      return {
        enableAnimations: false,
        maxConcurrentAnimations: 0,
        animationDuration: 0
      };
    }
    
    switch (tier) {
      case 'high':
        return {
          enableAnimations: true,
          maxConcurrentAnimations: 10,
          animationDuration: 1
        };
      case 'medium':
        return {
          enableAnimations: true,
          maxConcurrentAnimations: 5,
          animationDuration: 0.8
        };
      default:
        return {
          enableAnimations: true,
          maxConcurrentAnimations: 2,
          animationDuration: 0.5
        };
    }
  }
};

// Export singleton instances
export const observerManager = new IntersectionObserverManager();
export const performanceMonitor = new PerformanceMonitor();
export const memoryManager = new MemoryManager();

// Auto-cleanup on page unload
window.addEventListener('beforeunload', () => {
  observerManager.cleanup();
  memoryManager.cleanup();
});

// Initialize lazy loading on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  initLazyLoading();
  
  // Initialize fade-in animations for elements with the class
  const fadeElements = document.querySelectorAll('.fade-in-on-scroll');
  if (fadeElements.length > 0) {
    observerManager.observeFadeIn(fadeElements);
  }
});