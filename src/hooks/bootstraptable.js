const ContainerWidth = {
  ExtraSmall: 768,
  Small: 992,
  Medium: 1200,
  Large: 10000,
};

const ContainerSize = {
  ExtraSmall: 'xs',
  Small: 'sm',
  Medium: 'md',
  Large: 'lg',
};

function getContainerSize(window) {
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

/**
 * This hook allows to make the bootstrapTable columns responsive and will hide or show depending of the window size
 * @param {*} columns
 * @returns
 */
export default function useResponsiveColumns(columns) {
  const size = getContainerSize(window);
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];

    if (column.responsiveHeaderStyle) {
      if (column.responsiveHeaderStyle[size]) {
        column.headerStyle = (c) => c.responsiveHeaderStyle[size];
        if (column.responsiveHeaderStyle[size].hidden) {
          column.hidden = column.responsiveHeaderStyle[size].hidden;
        }
      }
    }
  }
  return columns;
}
