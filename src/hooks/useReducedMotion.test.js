import { renderHook } from '@testing-library/react';
import { useReducedMotion } from './useReducedMotion';

describe('useReducedMotion', () => {
  let mockMatchMedia;

  beforeEach(() => {
    mockMatchMedia = {
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    };

    window.matchMedia = jest.fn(() => mockMatchMedia);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns false when prefers-reduced-motion is not set', () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('returns true when prefers-reduced-motion is set', () => {
    mockMatchMedia.matches = true;
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it('sets up event listener on mount', () => {
    renderHook(() => useReducedMotion());
    expect(mockMatchMedia.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('cleans up event listener on unmount', () => {
    const { unmount } = renderHook(() => useReducedMotion());
    unmount();
    expect(mockMatchMedia.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('updates when media query changes', () => {
    const { result, rerender } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);

    const changeHandler = mockMatchMedia.addEventListener.mock.calls[0][1];
    changeHandler({ matches: true });

    rerender();
    expect(result.current).toBe(true);
  });

  it('queries correct media query', () => {
    renderHook(() => useReducedMotion());
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
  });
});
