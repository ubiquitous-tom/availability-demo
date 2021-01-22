import React, { Component } from 'react'

import './Datatable.scss';
import { DataTable, Pagination } from 'carbon-components-react';
import moment from 'moment';

import RLJEDatePicker from '../datepicker/DatePicker';

interface GeneralMap {
  [key: string]: any
}

const {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  TableContainer
} = DataTable;

class RLJEDataTable extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      country: 'us',
      availability: {},
      initialRows: [],
      rows: [],
      currentRows: [],
      isMoment: false,
      totalItemCount: 0,
      page: 1,
      pageSize: 100,
      handleDatePickerChange: this.handleDatePickerChange,
    }
  }

  componentDidMount() {
    // console.log('componentDidMount')
    let xmlFeed = window.localStorage.getItem(`availability-${this.state.country}`) || '';
    let availability = JSON.parse(xmlFeed);
    console.log(availability);
    let totalItemCount = availability.umcAvailability.service[0].totalItemCount[0];
    let items = availability.umcAvailability.service[0].item;
    let rows:object[] = [];
    items.forEach((item:any, key:string) => {
      // console.log(item, key)
      let mainRow = item.$;
      let publishedDate = item.pubDate;
      // let playableProperties = item.playableProperties[0];
      // let closedCaptioning = playableProperties.closedCaptioning;
      // let primaryLocale = playableProperties.primaryLocale;
      // let videoQuality = playableProperties.videoQuality;
      let offers = item.offers[0];
      let offer = offers.offer[0];
      // let offeringType = offer.offeringType;
      let offeringWindowStart = offer.windowStart;
      let offeringWindowEnd = offer.windowEnd;
      rows.push({
        id: (key+1).toString(),//mainRow.contentId,
        contentId: mainRow.contentId,
        contentType: mainRow.contentType,
        publishedDate: (this.state.isMoment) ? moment(new Date(publishedDate)).format('LLL') : publishedDate,
        sunriseDate: (this.state.isMoment) ? moment(new Date(offeringWindowStart)).format('LLL') : offeringWindowStart,
        sunsetDate: (this.state.isMoment) ? moment(new Date(offeringWindowEnd)).format('LLL') : offeringWindowEnd,
      });
    });
    console.log(rows)
    let start = (this.state.page - 1) * this.state.pageSize;
    let end = (this.state.page - 1) + (this.state.pageSize);
    let currentRows = rows.slice(start, end);
    this.setState({
      availability: availability,
      initialRows: rows,
      rows: rows,
      currentRows: currentRows,
      totalItemCount: parseInt(totalItemCount),
    });

    console.log('componentDidMount', this.state, this.props)
  }

  componentDidUpdate(prevProps:any, prevState:any) {
    console.log('componentDidUpdate', this.state, prevProps, prevState, this.props);
  }

  onPaginationChange = (paginationProps:any) => {
    console.log('onPaginationChange', paginationProps); //{page: 1, pageSize: 100}
    let start = (paginationProps.page - 1) * paginationProps.pageSize;
    let end = start + paginationProps.pageSize;
    let newRows = this.state.rows.slice(start, end);
    this.setState({
      currentRows: newRows,
      page: paginationProps.page,
      pageSize: paginationProps.pageSize
    });
  }

  onInputFocus = (ref:any) => {
    console.log('onInputFocus', ref);
  }

  onInputBlur = (ref:any) => {
    console.log('onInputBlur', ref);
  }

  tomFilterRows = (_ref:any) => {
    console.log(_ref);
    var rowIds = _ref.rowIds,
        headers = _ref.headers,
        cellsById = _ref.cellsById,
        inputValue = _ref.inputValue,
        getCellId = _ref.getCellId;
        console.log(cellsById)
    let stuff = rowIds.filter(function (rowId:any) {
      return headers.some(function (_ref2:any) {
        var key = _ref2.key;
        var id = getCellId(rowId, key);
        if (typeof cellsById[id].value === 'boolean') return false;
        return ('' + cellsById[id].value).toLowerCase().includes(inputValue.toLowerCase());
      });
    });
    console.log(stuff);
    return stuff;
  };

  searchFilterRows = (_ref:any) => {
    let inputValueStuff = _ref.inputValue;
    let stuff = this.state.initialRows.filter(function (row:any) {
      let currentRow = Object.values(row);
      return currentRow.some(function (element:any, index:any, array:any) {
        // console.log(element, index, array);
        if (index === 0) return false;
        return ('' + element).toLowerCase().includes(inputValueStuff.toLowerCase());
      });
    });
    console.log(stuff);
    return stuff;
  }

  handleDatePickerChange = (filteredRows:any[]) => {
    this.setState({
      // rows: filteredRows,
      currentRows: filteredRows,
      totalItemCount: filteredRows.length,
    });
  }

  render() {
    console.log('render', this.state)
    const headers = [
      {
        key: 'contentId',
        header: 'Content ID',
      },
      {
        key: 'contentType',
        header: 'Content Type',
      },
      {
        key: 'publishedDate',
        header: 'Published Date',
      },
      {
        key: 'sunriseDate',
        header: 'Sunrise Date',
      },
      {
        key: 'sunsetDate',
        header: 'sunsetDate',
      },
    ];


    const paginationProps = () => ({
      disabled: false, //boolean('Disable page inputs (disabled)', false),
      page: this.state.page, //number('The current page (page)', 1),
      totalItems: this.state.totalItemCount, //number('Total number of items (totalItems)', 103),
      pagesUnknown: false, //boolean('Total number of items unknown (pagesUnknown)', false),
      pageInputDisabled: undefined, //boolean('[Deprecated]: Disable page input (pageInputDisabled)', undefined),
      backwardText: 'Previous page', //text('The description for the backward icon (backwardText)', 'Previous page'),
      forwardText: 'Next page', //text('The description for the forward icon (forwardText)', 'Next page'),
      pageSize: this.state.pageSize, //number('Number of items per page (pageSize)', 10),
      pageSizes: [100, 200, 300, 400, 500, 1000, this.state.totalItemCount], //array('Choices of `pageSize` (pageSizes)', [10, 20, 30, 40, 50]),
      itemsPerPageText: 'Items per page:', //text('Label for `pageSizes` select UI (itemsPerPageText)', 'Items per page:'),
      onChange: this.onPaginationChange//action('onChange'),
    });
    console.log(this.state.totalItemCount)
    return (
      <div className="container mt-5">
        <RLJEDatePicker {...this.state}></RLJEDatePicker>

        <div className="row mt-5">
          <DataTable
            // stickyHeader
            isSortable
            // filterRows={this.tomFilterRows}
            rows={this.state.currentRows}
            headers={headers}
            render={({
              rows,
              headers,
              getTableProps,
              getHeaderProps,
              getRowProps,
              onInputChange
            }) => (
              <TableContainer>
                <TableToolbar>
                  <TableToolbarContent>
                    <TableToolbarSearch onChange={onInputChange} onFocus={this.onInputFocus} onBlur={this.onInputBlur} />
                  </TableToolbarContent>
                </TableToolbar>
                <Pagination {...paginationProps()} />
                <Table {...getTableProps()}>
                  <TableHead>
                    <TableRow>
                      {headers.map((header) => (
                        <TableHeader {...getHeaderProps({ header })}>
                          {header.header}
                        </TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow {...getRowProps({ row })}>
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Pagination {...paginationProps()} />
              </TableContainer>
            )}
          />
        </div>
      </div>
    );
  }
}

export default RLJEDataTable;