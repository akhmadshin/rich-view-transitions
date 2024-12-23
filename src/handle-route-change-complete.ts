import { getElementSelector } from './utils/get-element-selector';
import { cleanUpTransition } from './utils/clean-up-transition';

export const handleRouteChangeComplete = (routerKey?: string) => {
  const key = routerKey ?? 'initial';
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
