let __RVT_routerKey = 'initial';
let __RVT_previousRouterKey = undefined;
let __RVT_transitionElementSelector = undefined;
let __RVT_transitionAttributeName = undefined;
let __RVT_transitionAttributeValue = undefined;

const cleanUpTransition = () => {
  const imgElements = Array.from(document.querySelectorAll<HTMLImageElement>(`[style*='view-transition-name']`));
  const oldTransitionImg = imgElements.find((el) => el.style.viewTransitionName === '__RVT_transition-img');
  if (oldTransitionImg) {
    oldTransitionImg.style.viewTransitionName = '';
  }
}

const getElementSelector = (elm: Element) => {
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
  const routerKey = __RVT_routerKey ?? 'initial';
  const bffImgSelector = sessionStorage.getItem(`__RVT_view_transition_image_selector_${routerKey}-${futureKey}`) || '';

  if (bffImgSelector) {
    const clickedImg = document.querySelector<HTMLImageElement>(bffImgSelector);
    if (clickedImg && clickedImg.src) {
      __RVT_transitionAttributeValue = clickedImg.src.replace(location.origin || '', '');
      cleanUpTransition();
      clickedImg.style.viewTransitionName = '__RVT_transition-img';
    }
  }
}

export const handleRouteChangeComplete = (_key?: string) => {
  const key = _key ?? 'initial';
  __RVT_previousRouterKey = __RVT_routerKey ?? 'initial';
  __RVT_routerKey = key;

  if (__RVT_transitionElementSelector) {
    sessionStorage.setItem(`__RVT_view_transition_image_selector_${__RVT_previousRouterKey}-${key}`, __RVT_transitionElementSelector);
    __RVT_transitionElementSelector = undefined;
  }
  // Navigation via back-forward
  const backRouterKey = `${key}-${__RVT_previousRouterKey}`;
  const imgSelector = sessionStorage.getItem(`__RVT_view_transition_image_selector_${backRouterKey}`);
  const img = imgSelector ? document.querySelector<HTMLImageElement>(imgSelector) : undefined;

  cleanUpTransition();
  if (img) {
    img.style.viewTransitionName = '__RVT_transition-img';
  } else {
    // Navigation via clicking link
    const transitionImg = document.querySelector<HTMLImageElement>(`[${__RVT_transitionAttributeName}="${__RVT_transitionAttributeValue}"]`);
    if (transitionImg) {
      const imgSelector = getElementSelector(transitionImg) || '';
      transitionImg.style.viewTransitionName = '__RVT_transition-img';
      sessionStorage.setItem(`__RVT_view_transition_image_selector_${backRouterKey}`, imgSelector);
    }
  }
  __RVT_transitionAttributeValue = undefined;
}

export const handleTransitionStarted = ({ element, attributeName, attributeValue }: {
  element?: HTMLElement | null;
  attributeName?: string;
  attributeValue: string;
}) => {
  if (element) {
    const linkSelector = getElementSelector(element);
    __RVT_transitionElementSelector = linkSelector;
    __RVT_transitionAttributeValue = attributeValue;
    __RVT_transitionAttributeName = attributeName;
    const el = document.querySelector<HTMLImageElement>(`[style*='view-transition-name']`);
    if (el) {
      el.style.viewTransitionName = '';
    }
    element.style.viewTransitionName = '__RVT_transition-img';
  }
}