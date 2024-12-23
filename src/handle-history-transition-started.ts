import { cleanUpTransition } from './utils/clean-up-transition';

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
