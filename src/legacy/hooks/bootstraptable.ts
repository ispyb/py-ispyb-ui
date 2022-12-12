import React, { CSSProperties } from 'react';
import { ColumnDescription } from 'react-bootstrap-table-next';

const ContainerWidth = {
  ExtraSmall: 768,
  Small: 992,
  Medium: 1200,
  Large: 10000,
};

function getStyle(window: Window, responsiveStyle: ResponsiveStyle) {
  const width = window.innerWidth;
  if (width) {
    if (width < ContainerWidth.ExtraSmall) {
      return responsiveStyle.xs;
    }
    if (width < ContainerWidth.Small) {
      return responsiveStyle.sm;
    }
    if (width < ContainerWidth.Medium) {
      return responsiveStyle.md;
    }
    if (width < ContainerWidth.Large) {
      return responsiveStyle.lg;
    }
  }
  return responsiveStyle.md;
}

export interface ResponsiveStyle {
  xs?: CSSProperties & { hidden?: boolean };
  sm?: React.CSSProperties & { hidden?: boolean };
  md?: React.CSSProperties & { hidden?: boolean };
  lg?: React.CSSProperties & { hidden?: boolean };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ResponsiveColumnDescription<T extends object = any, E = any>
  extends ColumnDescription<T, E> {
  responsiveHeaderStyle?: ResponsiveStyle;
}

/**
 * This hook allows to make the bootstrapTable columns responsive and will hide or show depending of the window size
 * @param {*} columns
 * @returns
 */
export default function useResponsiveColumns(
  columns: ResponsiveColumnDescription[]
) {
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];

    if (column.responsiveHeaderStyle) {
      const style = getStyle(window, column.responsiveHeaderStyle);
      if (style) {
        column.headerStyle = style;
        if (style.hidden) {
          column.hidden = style.hidden;
        }
      }
    }
  }
  return columns;
}
