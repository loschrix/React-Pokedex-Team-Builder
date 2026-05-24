import { useEffect, useRef } from "react";

export function useInfiniteScroll({ onLoadMore, hasMore, isLoading }) {
    const loaderRef = useRef(null);

    // save the latest state in a ref
    // the observer always sees the current data without needing to be restarted
    const stateRef = useRef({ hasMore, isLoading, onLoadMore });

    // update the ref's content on every change
    useEffect(() => {
        stateRef.current = { hasMore, isLoading, onLoadMore };
    }, [hasMore, isLoading, onLoadMore]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const target = entries[0];

            // extract the current state from our stateRef
            const { hasMore, isLoading, onLoadMore } = stateRef.current;

            if (target.isIntersecting && hasMore && !isLoading) {
                onLoadMore();
            }
        }, {
            root: null,
            rootMargin: '100px',
            threshold: 0.1
        });

        const currentLoader = loaderRef.current;
        if (currentLoader) {
            observer.observe(currentLoader);
        }

        return () => {
            // safer to use disconnect() to completely clear the observer
            observer.disconnect();
        };
    }, [isLoading]); // empty dependency array - the observer is created only once

    return loaderRef;
}