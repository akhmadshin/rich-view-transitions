import { getElementSelector } from './utils/get-element-selector';

export interface StartViewTransitionProps {
  element?: HTMLElement | null;
  attributeName?: string;
  attributeValue: string;
}

export const handleTransitionStarted = ({ element, attributeName, attributeValue }: StartViewTransitionProps) => {
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
