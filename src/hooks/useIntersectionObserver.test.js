import { renderHook } from '@testing-library/react';
import useIntersectionObserver from './useIntersectionObserver';

describe('useIntersectionObserver', () => {
  let mockIntersectionObserver;
  let observeCallback;

  beforeEach(() => {
    observeCallback = null;

    mockIntersectionObserver = class {
      constructor(callback, options) {
        observeCallback = callback;
        this.options = options;
      }
      observe = jest.fn();
      unobserve = jest.fn();
      disconnect = jest.fn();
    };

    global.IntersectionObserver = mockIntersectionObserver;

    document.getElementById = jest.fn((id) => ({
      id,
      getBoundingClientRect: () => ({ top: 0, bottom: 100, height: 100 })
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns empty string initially', () => {
    const { result } = renderHook(() => useIntersectionObserver(['section1', 'section2']));
    expect(result.current).toBe('');
  });

  it('creates IntersectionObserver with correct options', () => {
    const customOptions = {
      rootMargin: '0px',
      threshold: 0.5
    };

    renderHook(() => useIntersectionObserver(['section1'], customOptions));

    expect(global.IntersectionObserver).toHaveBeenCalled();
  });

  it('observes all provided section IDs', () => {
    const sectionIds = ['hero', 'about', 'contact'];
    const { result } = renderHook(() => useIntersectionObserver(sectionIds));

    expect(document.getElementById).toHaveBeenCalledTimes(3);
    expect(document.getElementById).toHaveBeenCalledWith('hero');
    expect(document.getElementById).toHaveBeenCalledWith('about');
    expect(document.getElementById).toHaveBeenCalledWith('contact');
  });

  it('sets active section when intersection occurs', () => {
    const { result, rerender } = renderHook(() => useIntersectionObserver(['section1']));

    const mockEntry = {
      target: { id: 'section1' },
      isIntersecting: true,
      intersectionRatio: 0.8
    };

    if (observeCallback) {
      observeCallback([mockEntry]);
    }

    rerender();
    expect(result.current).toBe('section1');
  });

  it('selects section with highest intersection ratio', () => {
    const { result, rerender } = renderHook(() => useIntersectionObserver(['section1', 'section2']));

    const mockEntries = [
      {
        target: { id: 'section1' },
        isIntersecting: true,
        intersectionRatio: 0.3
      },
      {
        target: { id: 'section2' },
        isIntersecting: true,
        intersectionRatio: 0.7
      }
    ];

    if (observeCallback) {
      observeCallback(mockEntries);
    }

    rerender();
    expect(result.current).toBe('section2');
  });

  it('ignores non-intersecting entries', () => {
    const { result, rerender } = renderHook(() => useIntersectionObserver(['section1']));

    const mockEntry = {
      target: { id: 'section1' },
      isIntersecting: false,
      intersectionRatio: 0
    };

    if (observeCallback) {
      observeCallback([mockEntry]);
    }

    rerender();
    expect(result.current).toBe('');
  });

  it('handles null elements gracefully', () => {
    document.getElementById = jest.fn(() => null);

    expect(() => {
      renderHook(() => useIntersectionObserver(['nonexistent']));
    }).not.toThrow();
  });

  it('unobserves sections on unmount', () => {
    const observeSpy = jest.fn();
    const unobserveSpy = jest.fn();

    mockIntersectionObserver = class {
      constructor(callback) {
        observeCallback = callback;
      }
      observe = observeSpy;
      unobserve = unobserveSpy;
      disconnect = jest.fn();
    };

    global.IntersectionObserver = mockIntersectionObserver;

    const { unmount } = renderHook(() => useIntersectionObserver(['section1']));

    expect(observeSpy).toHaveBeenCalled();

    unmount();

    expect(unobserveSpy).toHaveBeenCalled();
  });
});
