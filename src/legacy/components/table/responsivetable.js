import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';

import BootstrapTable2 from 'react-bootstrap-table-next';
import React from 'react';
import { getContainerSize } from 'legacy/helpers/responsivenesshelper.js';
import paginationFactory from 'react-bootstrap-table2-paginator';

class ResponsiveTable extends React.Component {
  constructor() {
    super();
    this.state = {
      width: 800,
      height: 182,
    };
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

  render() {
    if (!this.props.data) {
      return null;
    }

    return (
      <div>
        <BootstrapTable2
          selectRow={this.props.selectRow}
          expandRow={this.props.expandRow}
          rowStyle={this.props.rowStyle}
          filter={this.props.filter}
          pagination={paginationFactory(this.props.pageOptions)}
        />
      </div>
    );
  }
}

export default ResponsiveTable;
