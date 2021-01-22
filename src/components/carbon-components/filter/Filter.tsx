import React, { Component } from 'react';
import { FilterRowsData } from 'carbon-components-react';

class RLJEFilter extends Component {

  render() {
    return (
      <div className="row">
        <div className="col-4">
          <form>
            <div className="form-group">
              <input className="form-control mb-4 float-right" id="myInput" type="text" placeholder="Filter.."></input>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default RLJEFilter;