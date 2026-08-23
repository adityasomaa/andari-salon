"use client";

/**
 * One owner for "something is covering the page".
 *
 * Three separate things want to lock scrolling (mobile menu, popovers, the
 * page-transition curtain) and they overlap in time, so a boolean would race.
 * A counter does not. Lenis subscribes to the same counter, which is how the
 * brief's "turn smooth scroll off while a calendar or popup is open" is met.
 *
 * It also holds the mutual exclusion the layering rules need: opening the
 * mobile menu closes every popover, so the calendar and the menu are never on
 * screen at the same time.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type UIState = {
  locks: number;
  locked: boolean;
  menuOpen: boolean;
  /** Id of the popover that currently owns the screen, if any. */
  openPopover: string | null;
  setMenuOpen: (open: boolean) => void;
  requestPopover: (id: string) => void;
  closePopover: (id?: string) => void;
  addLock: () => () => void;
};

const Ctx = createContext<UIState | null>(null);

export function UIStateProvider({ children }: { children: ReactNode }) {
  const [locks, setLocks] = useState(0);
  const [menuOpen, setMenuOpenState] = useState(false);
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  const addLock = useCallback(() => {
    setLocks((n) => n + 1);
    let released = false;
    return () => {
      if (released) return;
      released = true;
      setLocks((n) => Math.max(0, n - 1));
    };
  }, []);

  const requestPopover = useCallback((id: string) => {
    // A popover can never open behind the mobile menu: the menu closes first.
    setMenuOpenState(false);
    setOpenPopover(id);
  }, []);

  const closePopover = useCallback((id?: string) => {
    setOpenPopover((cur) => (id == null || cur === id ? null : cur));
  }, []);

  const setMenuOpen = useCallback((open: boolean) => {
    if (open) setOpenPopover(null);
    setMenuOpenState(open);
  }, []);

  // Body lock. Scroll position is restored on release so closing a menu does
  // not throw the visitor back to the top.
  const scrollY = useRef(0);
  const locked = locks > 0;
  useEffect(() => {
    const body = document.body;
    if (locked) {
      scrollY.current = window.scrollY;
      body.dataset.scrollLocked = "true";
      body.style.top = `-${scrollY.current}px`;
      body.style.position = "fixed";
      body.style.width = "100%";
    } else if (body.dataset.scrollLocked === "true") {
      delete body.dataset.scrollLocked;
      body.style.position = "";
      body.style.top = "";
      body.style.width = "";
      window.scrollTo(0, scrollY.current);
    }
  }, [locked]);

  const value = useMemo<UIState>(
    () => ({
      locks,
      locked,
      menuOpen,
      openPopover,
      setMenuOpen,
      requestPopover,
      closePopover,
      addLock,
    }),
    [locks, locked, menuOpen, openPopover, setMenuOpen, requestPopover, closePopover, addLock],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUIState(): UIState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useUIState must be used inside UIStateProvider");
  return ctx;
}

/** Hold a scroll lock for as long as `active` is true. */
export function useScrollLock(active: boolean) {
  const { addLock } = useUIState();
  useEffect(() => {
    if (!active) return;
    return addLock();
  }, [active, addLock]);
}
