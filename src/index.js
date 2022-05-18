import { useEffect, useCallback, useRef } from "react";

const overrideSystemHandling = (e) => {
  if (e) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) {
      e.stopPropagation();
    } else if (window.event) {
      window.event.cancelBubble = true;
    }
  }
};

const BLACKLISTED_DOM_TARGETS = ["TEXTAREA", "INPUT"];

const overrideSystem = true;

export const useShortcutKeys = (keys, callback) => {
  if (!Array.isArray(keys))
    throw new Error(
      "The first parameter to `useKey` must be an ordered array of `KeyboardEvent.key` strings."
    );

  if (!keys.length)
    throw new Error(
      "The first parameter to `useKey` must contain atleast one `KeyboardEvent.key` string."
    );

  if (!callback || typeof callback !== "function")
    throw new Error(
      "The second parameter to `useKey` must be a function that will be envoked when the keys are pressed."
    );

  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  const heldKeys = useRef([]);

  const flushHeldKeys = useCallback(() => {
    heldKeys.current = [];
  }, []);

  const keyDownListener = useCallback(
    (event) => {
      const { key, target, repeat } = event;
      if (repeat) return;
      if (BLACKLISTED_DOM_TARGETS.includes(target.tagName)) return;
      if (!keys.includes(key)) return;

      if (overrideSystem) {
        overrideSystemHandling(event);
      }

      const nextHeldKeys = [...new Set([...heldKeys.current, key])];

      if (nextHeldKeys.join() === keys.join()) {
        callback(keys);
        flushHeldKeys();
        return;
      }

      heldKeys.current = nextHeldKeys;
      return;
    },
    [keys, callback, flushHeldKeys]
  );

  const keyupListener = useCallback(
    (event) => {
      const { key, target } = event;
      if (BLACKLISTED_DOM_TARGETS.includes(target.tagName)) return;
      if (!keys.includes(key)) return;

      const raisedKeyHeldIndex = heldKeys.current.indexOf(key);
      if (!(raisedKeyHeldIndex >= 0)) return;

      let nextHeldKeys = [];
      let loopIndex;
      for (loopIndex = 0; loopIndex < heldKeys.current.length; ++loopIndex) {
        if (loopIndex !== raisedKeyHeldIndex) {
          nextHeldKeys.push(heldKeys.current[loopIndex]);
        }
      }
      heldKeys.current = nextHeldKeys;

      return false;
    },
    [keys]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyDownListener);
    document.addEventListener("keyup", keyupListener);
    return () => {
      document.removeEventListener("keydown", keyDownListener);
      document.removeEventListener("keyup", keyupListener);
    };
  }, [keyDownListener, keyupListener, keys]);

  return {
    flushHeldKeys,
  };
};
