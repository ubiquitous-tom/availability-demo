import React, { Component } from 'react';

import './DatatableSkeleton.scss';
import { DataTableSkeleton } from 'carbon-components-react';

class RLJEDataTableSkeleton extends Component {
  constructor(props:any) {
    super(props);

    this.state = {
      style: {
        width: '100%'
      }
    }
  }

  skeletonProps = () => ({
    headers: [
      'Optional table headers (headers)',
      [
        { key: 'id' },
        { key: 'contentId' },
        { key: 'contentType' },
        { key: 'publishedDate' },
        { key: 'sunriseDate' },
        { key: 'sunsetDate' },
      ],
      ','
    ],
    rowCount: 10,
    zebra: false,
    compact: false,
    showHeader: true,
    showToolbar: true,
  });

  render() {
    return (
      <div className="container mt-5">
        <div className="row mt-5">
          <div style={{ width: '100%' }}>
            <DataTableSkeleton {...this.skeletonProps} />
            <br />
          </div>
        </div>
      </div>
    );
  }
}

export default RLJEDataTableSkeleton;