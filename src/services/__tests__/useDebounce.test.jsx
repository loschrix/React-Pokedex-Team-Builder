import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce.js';

describe('useDebounce', () => {
  test('updates value after configured delay', () => {
    jest.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'pi', delay: 500 } }
    );

    expect(result.current).toBe('pi');

    rerender({ value: 'pikachu', delay: 500 });
    expect(result.current).toBe('pi');

    act(() => {
      jest.advanceTimersByTime(499);
    });
    expect(result.current).toBe('pi');

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe('pikachu');
  });

  test('cleans pending timeout when value changes', () => {
    jest.useFakeTimers();
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    const { rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 500 } }
    );

    rerender({ value: 'b', delay: 500 });

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
