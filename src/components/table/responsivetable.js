import React from 'react';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import styles from './ResponsiveTable.module.css';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min';

import BootstrapTable2 from 'react-bootstrap-table-next';

import paginationFactory from 'react-bootstrap-table2-paginator';

const { SearchBar } = Search;

export const ContainerWidth = {
  ExtraSmall: 768,
  Small: 992,
  Medium: 1200,
  Large: 10000,
};

export const ContainerSize = {
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

class ResponsiveTable extends React.Component {
  constructor() {
    super();
    this.state = {
      width: 800,
      height: 182,
    };

    this.getSearchBar = this.getSearchBar.bind(this);
  }

  updateDimensions() {
    if (window.innerWidth < 500) {
      this.setState({ width: 450, height: 102 });
    } else {
      const update_width = window.innerWidth - 100;
      const update_height = Math.round(update_width / 4.4);
      this.setState({ width: update_width, height: update_height });
    }
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  /**
   * This method will calculate the headerStyle based on the ResposiveHeaderStyle and the size of the window
   * @param {array} columns BootstrapTable2 columns
   */
  configure(columns) {
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

  /**
   * This depends also in the size of the screen
   */
  getSearchBarStyle() {
    const size = getContainerSize(window);
    switch (size) {
      case 'xs':
        return { width: '100%', float: 'center' };
      case 'sm':
        return { width: '100%', float: 'center' };
      case 'md':
        return { width: '300', float: 'right' };
      case 'lg':
        return { width: '500px', float: 'right' };
      default:
        return { width: '100%', float: 'center' };
    }
  }

  getSearchBar(props) {
    const { SearchBar } = Search;
    if (this.props.search === false) {
      return null;
    }
    return (
      <div style={this.getSearchBarStyle()}>
        <SearchBar {...props.searchProps} />
      </div>
    );
  }

  render() {
    if (!this.props.data) {
      return null;
    }

    return (
      <ToolkitProvider
        keyField={this.props.keyField}
        data={this.props.data}
        columns={this.configure(this.props.columns)}
        filter={this.props.filter}
        expandRow={this.props.expandRow}
        search={{
          searchFormatted: true,
        }}
      >
        {(props) => (
          <div>
            {this.props.menu}
            <BootstrapTable2
              selectRow={this.props.selectRow}
              expandRow={this.props.expandRow}
              rowStyle={this.props.rowStyle}
              filter={this.props.filter}
              {...props.baseProps}
              pagination={paginationFactory(this.props.pageOptions)}
            />
          </div>
        )}
      </ToolkitProvider>
    );
  }
}

export default ResponsiveTable;
