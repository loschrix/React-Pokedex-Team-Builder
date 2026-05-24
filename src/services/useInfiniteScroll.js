import { useEffect, useRef } from "react";

export function useInfiniteScroll({ onLoadMore, hasMore, isLoading }) {
    const loaderRef = useRef(null);
    const stateRef = useRef({ hasMore, isLoading, onLoadMore });

    useEffect(() => {
        stateRef.current = { hasMore, isLoading, onLoadMore };
    }, [hasMore, isLoading, onLoadMore]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const target = entries[0];
            const latestState = stateRef.current;

            if (target.isIntersecting && latestState.hasMore && !latestState.isLoading) {
                latestState.onLoadMore();
            }
        }, {
            root: null,
            rootMargin: "160px",
            threshold: 0.1
        });

        const currentLoader = loaderRef.current;

        if (currentLoader) {
            observer.observe(currentLoader);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    return loaderRef;
}
