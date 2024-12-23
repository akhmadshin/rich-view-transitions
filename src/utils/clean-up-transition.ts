export const cleanUpTransition = () => {
  const imgElements = Array.from(document.querySelectorAll<HTMLImageElement>(`[style*='view-transition-name']`));
  const oldTransitionImg = imgElements.find((el) => el.style.viewTransitionName === '__RVT_transition-img');
  if (oldTransitionImg) {
    oldTransitionImg.style.viewTransitionName = '';
  }
}