import { useEffect, useRef, useState } from "react";

const useInfiniteScroll = (callback, hasMore) => {
  const [sentinel, setSentinel] = useState(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!sentinel || !hasMore) return;

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(sentinel);

    return () => observerRef.current?.disconnect();
  }, [callback, hasMore, sentinel]);

  return setSentinel;
};

export default useInfiniteScroll;