const cleanUpTransition = () => {
  const imgElements = Array.from(document.querySelectorAll<HTMLImageElement>(`[style*='view-transition-name']`));
  const oldTransitionImg = imgElements.find((el) => el.style.viewTransitionName === '__RVT_transition-img');
  if (oldTransitionImg) {
    oldTransitionImg.style.viewTransitionName = '';
  }
}

function getElementSelector(elm: Element) {
  if (elm.tagName === "BODY") return "BODY";
  const names = [];
  while (elm.parentElement && elm.tagName !== "BODY") {
    if (elm.id) {
      names.unshift("#" + elm.getAttribute("id")); // getAttribute, because `elm.id` could also return a child element with name "id"
      break; // Because ID should be unique, no more is needed. Remove the break, if you always want a full path.
    } else {
      let c = 1, e = elm;
      for (; e.previousElementSibling; e = e.previousElementSibling, c++) ;
      names.unshift(elm.tagName + ":nth-child(" + c + ")");
    }
    elm = elm.parentElement;
  }
  return names.join(">");
}

export const handleHistoryTransitionStarted = (futureKey: string = 'initial') => {
  const routerKey = window.__RVT_routerKey ?? 'initial';

  const bffImgSelector = sessionStorage.getItem(`__RVT_view_transition_image_selector_${routerKey}-${futureKey}`) || '';

  if (bffImgSelector) {
    const clickedImg = document.querySelector<HTMLImageElement>(bffImgSelector);
    if (clickedImg && clickedImg.src) {
      window.__RVT_transitionAttributeValue = clickedImg.src.replace(location.origin || '', '');
      cleanUpTransition();
      clickedImg.style.viewTransitionName = '__RVT_transition-img';
    }
  }
}

export const handleRouteChangeComplete = (_key?: string) => {
  const key = _key ?? 'initial';
  if (typeof window === 'undefined') {
    return;
  }

  window.__RVT_previousRouterKey = window.__RVT_routerKey ?? 'initial';
  window.__RVT_routerKey = key;

  if (window.__RVT_transitionImgSelector) {
    sessionStorage.setItem(`__RVT_view_transition_image_selector_${window.__RVT_previousRouterKey}-${key}`, window.__RVT_transitionImgSelector);

    window.__RVT_transitionImgSelector = undefined;
  }
  // Navigation via back-forward
  const backRouterKey = `${key}-${window.__RVT_previousRouterKey}`;
  const imgSelector = sessionStorage.getItem(`__RVT_view_transition_image_selector_${backRouterKey}`);
  const img = imgSelector ? document.querySelector<HTMLImageElement>(imgSelector) : undefined;

  cleanUpTransition();
  if (img) {
    img.style.viewTransitionName = '__RVT_transition-img';
  } else {
    // Navigation via clicking link
    const transitionImg = document.querySelector<HTMLImageElement>(`[${window.__RVT_transitionAttributeName}="${window.__RVT_transitionAttributeValue}"]`);
    if (transitionImg) {
      const imgSelector = getElementSelector(transitionImg) || '';
      transitionImg.style.viewTransitionName = '__RVT_transition-img';
      sessionStorage.setItem(`__RVT_view_transition_image_selector_${backRouterKey}`, imgSelector);
    }
  }
  window.__RVT_transitionAttributeValue = undefined;
}

export const handleTransitionStarted = ({ element, attributeName, attributeValue }: {
  element?: HTMLElement | null;
  attributeName?: string;
  attributeValue: string;
}) => {
  if (element) {
    const linkSelector = getElementSelector(element);
    window.__RVT_transitionImgSelector = linkSelector;
    window.__RVT_transitionAttributeValue = attributeValue;
    window.__RVT_transitionAttributeName = attributeName;
    const el = document.querySelector<HTMLImageElement>(`[style*='view-transition-name']`);
    if (el) {
      el.style.viewTransitionName = '';
    }
    element.style.viewTransitionName = '__RVT_transition-img';
  }
}