import React, { Component } from "react";

import {
  DatePicker,
  DatePickerInput
} from 'carbon-components-react';

class RLJEDatePicker extends Component<any, any> {
  constructor(props:any) {
    super(props);
    console.log(props)
    this.state = {
      now: new Date(),
      currentRows: [],
    }
  }

  componentDidMount() {
    console.log('componentDidMount', this.state, this.props)
  }

  componentDidUpdate(prevProps:any, prevState:any) {
    console.log('componentDidUpdate', this.state, prevProps, prevState, this.props)
  }

  // Run AFTER datepicker closes
  onDatePickerChange = (datetime:any) => {
    console.log('onDatePickerChange', datetime)
    let filteredRows = this.props.initialRows;
    let selectedDate = (new Date(datetime)).setHours(0, 0, 0);
    if (selectedDate) {
      filteredRows = this.getNewRows(selectedDate, this.props.rows);
    }
    return this.props.handleDatePickerChange(filteredRows);
  }

  // Run WHEN datepicker closes
  onDatePickerClose = (event:any) => {
    console.log('onDatePickerClose', event)
    // console.log(event[0], event[0] instanceof Date)
    let date = new Date(event);
    console.log(date);
    console.log(this.props)
  }

  onDatePickerInputClick = (e:any) => {
    console.log('onDatePickerInputClick', e, e.target);
    e.target.setAttribute( "autocomplete", "off" );
  };

  onDatePickerInputChange = (e:any) => {
    console.log('onDatePickerInputChange', e, e.target.value);
  };

  getCurrentRows(rows:any[]) {
    let start = (this.props.page - 1) * this.props.pageSize;
    let end = (this.props.page - 1) + (this.props.pageSize);
    return rows.slice(start, end);
  }

  getNewRows(selectedDate:number, rows:any[]) {
    return rows.filter(function (row:any) {
      // console.log(row);
      let publishedDate = (new Date(row.publishedDate).setHours(0, 0, 0));
      let sunriseDate = (new Date(row.sunriseDate).setHours(0, 0, 0));
      let sunsetDate = (new Date(row.sunsetDate).setHours(0, 0, 0));
      // console.log(publishedDate, selectedDate);
      // console.log(sunriseDate, selectedDate);
      // console.log(sunsetDate, selectedDate);
      if (publishedDate === selectedDate) return true;
      return ((selectedDate >= sunriseDate) && (selectedDate <= sunsetDate))
    });
  }

  render() {
    return (
      <div className="row no-gutters justify-content-start">
        <div className="col text-left">
          <h2>Content Availability on</h2>
        </div>
        <div className="col">
          <DatePicker
            datePickerType="single"
            dateFormat="m/d/Y"
            onChange={this.onDatePickerChange}
            onClose={this.onDatePickerClose}>
            <DatePickerInput
              placeholder="mm/dd/yyyy"
              labelText=""
              id="date-picker-single"
              onClick={this.onDatePickerInputClick}
              onChange={this.onDatePickerInputChange}
            />
          </DatePicker>
        </div>
        <div className="col"></div>
      </div>
    );
  }
}

export default RLJEDatePicker;