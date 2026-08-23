"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * Read a browser-only value without a hydration mismatch and without the
 * setState-inside-an-effect pattern.
 *
 * The server snapshot is what renders on the server and on the first client
 * pass; React then swaps in the real client snapshot. That is exactly what
 * useSyncExternalStore is for, and unlike an effect it does not schedule an
 * extra render pass on every mount.
 */
export function useClientValue<T>(getClientSnapshot: () => T, serverValue: T): T {
  return useSyncExternalStore(noopSubscribe, getClientSnapshot, () => serverValue);
}

/**
 * Same idea, but the value is cached so the snapshot is referentially stable.
 * useSyncExternalStore re-invokes getSnapshot on every render and throws if it
 * keeps returning a fresh object.
 */
export function makeCachedSnapshot<T>(read: () => T) {
  let cache: { value: T } | null = null;
  return {
    get(): T {
      if (!cache) cache = { value: read() };
      return cache.value;
    },
    invalidate() {
      cache = null;
    },
  };
}
