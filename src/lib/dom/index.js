// @flow

export function isSmallScreen (): bool {
  return window.innerWidth <= 480;
}

export function addEvent (event: string, cb: Function) {
  window.addEventListener(event, cb, false);
  return () => window.removeEventListener(event, cb, false);
}

export function isDescendant (parent: Element, child: Element): bool {
  let node = child.parentNode;

  while (node != null) {
    if (node === parent) {
      return true;
    }

    node = node.parentNode;
  }

  return false;
}
