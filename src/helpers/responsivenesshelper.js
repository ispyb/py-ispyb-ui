import { ContainerSize, ContainerWidth } from 'constants';

/**
 * Calculates the size of the window width based in the innerWidth and then returns the equivalent container size: ExtraSmall, Small, Medium, Large or ExtraLarge
 * @param {window} window the window object that has as attribute innerWidth https://www.w3schools.com/jsref/prop_win_innerheight.asp
 * @return {CONTAINERWITH} size the size of the container:
 */
export function getContainerSize(window) {
  const width = window.innerWidth;
  if (width) {
    if (width < ContainerWidth.ExtraSmall) {
      return ContainerSize.ExtraSmall;
    }
    if (width < ContainerWidth.Small) {
      return ContainerSize.Small;
    }
    if (width < ContainerWidth.Medium) {
      return ContainerSize.Medium;
    }
    if (width < ContainerWidth.Large) {
      return ContainerSize.Large;
    }
    if (width < ContainerWidth.ExtraLarge) {
      return ContainerSize.ExtraLarge;
    }
  }
  return ContainerSize.Medium;
}
