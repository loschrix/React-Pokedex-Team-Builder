import { render } from '@testing-library/react';
import { useInfiniteScroll } from '../useInfiniteScroll.js';

function HookHarness(props) {
  const ref = useInfiniteScroll(props);
  return <div data-testid="loader" ref={ref} />;
}

describe('useInfiniteScroll', () => {
  test('triggers load when intersecting and can load more', () => {
    const onLoadMore = jest.fn();
    const { getByTestId } = render(
      <HookHarness onLoadMore={onLoadMore} hasMore isLoading={false} />
    );

    const observer = global.IntersectionObserver.instances[0];

    expect(observer.observe).toHaveBeenCalledWith(getByTestId('loader'));

    observer.trigger([{ isIntersecting: true }]);

    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  test('does not trigger load when loading or exhausted', () => {
    const onLoadMore = jest.fn();
    const { rerender } = render(
      <HookHarness onLoadMore={onLoadMore} hasMore isLoading />
    );

    const observer = global.IntersectionObserver.instances[0];
    observer.trigger([{ isIntersecting: true }]);

    rerender(<HookHarness onLoadMore={onLoadMore} hasMore={false} isLoading={false} />);
    observer.trigger([{ isIntersecting: true }]);

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  test('disconnects observer on unmount', () => {
    const onLoadMore = jest.fn();
    const { unmount } = render(
      <HookHarness onLoadMore={onLoadMore} hasMore isLoading={false} />
    );

    const observer = global.IntersectionObserver.instances[0];
    unmount();

    expect(observer.disconnect).toHaveBeenCalledTimes(1);
  });
});
