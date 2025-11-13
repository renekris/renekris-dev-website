import { renderHook, act } from '@testing-library/react';
import useScrollPosition from './useScrollPosition';

describe('useScrollPosition', () => {
  let rafCallbacks = [];
  
  beforeEach(() => {
    rafCallbacks = [];
    
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0
    });
    
    global.requestAnimationFrame = jest.fn((cb) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns initial scroll position of 0', () => {
    const { result } = renderHook(() => useScrollPosition());
    expect(result.current.scrollY).toBe(0);
    expect(result.current.scrollProgress).toBe(0);
    expect(result.current.scrollDirection).toBe(null);
  });

  it('updates scroll position on scroll event', () => {
    const { result } = renderHook(() => useScrollPosition());

    act(() => {
      window.scrollY = 100;
      window.dispatchEvent(new Event('scroll'));
      rafCallbacks.forEach(cb => cb());
    });

    expect(result.current.scrollY).toBe(100);
  });

  it('throttles scroll updates with requestAnimationFrame', async () => {
    const { result } = renderHook(() => useScrollPosition());

    act(() => {
      window.scrollY = 100;
      window.dispatchEvent(new Event('scroll'));
      rafCallbacks.forEach(cb => cb());
    });

    expect(result.current.scrollY).toBe(100);

    act(() => {
      window.scrollY = 300;
      window.dispatchEvent(new Event('scroll'));
      rafCallbacks.forEach(cb => cb());
    });

    expect(result.current.scrollY).toBe(300);
  });

  it('cleans up event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useScrollPosition());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});