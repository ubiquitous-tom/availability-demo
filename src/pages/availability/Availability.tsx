import React, { Component } from 'react';
import Axios from 'axios';
import { parseString } from 'xml2js';

import RLJEDataTableSkeleton from '../../components/carbon-components/datatable-skeleton/DatatableSkeleton';
import RLJEDataTable from '../../components/carbon-components/datatable/Datatable';

class Availability extends Component<any, any> {
  constructor(props:any) {
    super(props);

    this.state = {
      loading: true,
      error: null,
      country: 'us',
      urlFeed: `https://feeds.amcsvod.io/amcplus/apple/svod/us/availability.xml`,
      availability: {}
    }
  }

  componentDidMount() {
    let url = this.state.urlFeed;
    if (this.state.country !== undefined || this.state.country !== null) {
      url = `https://feeds.amcsvod.io/amcplus/apple/svod/${this.state.country}/availability.xml`;
    }

    Axios.get(url)
    .then((resp) => {
      // console.log(resp);
      // console.log(resp.headers, resp.headers['last-modified'], (new Date(resp.headers['last-modified'])).getTime())
      let newLastModif = Date.parse(resp.headers['last-modified']);
      let lastModif = window.localStorage.getItem(`availability-${this.state.country}-last-modified`) || '';
      let oldLastModif = parseInt(lastModif);
      // console.log(newLastModif, oldLastModif)

      // check if the last modified time has changed
      if (isNaN(oldLastModif) || oldLastModif < newLastModif) {
        // save new last modified time to localStorage
        window.localStorage.setItem(`availability-${this.state.country}-last-modified`, `${newLastModif}`);

        // convert xml to json
        parseString(resp.data, (err, json) => {
          console.log(err, json)
          // can't convert xml to json
          if (err) {
            console.log(err);
          } else {
            console.log(json);
            // save json to localStorage
            window.localStorage.setItem(`availability-${this.state.country}`, JSON.stringify(json));
            // set json as `availability`
            this.setState({
              availability: json
            });
          }
        });
      } else {
        // if this is still a cached version then load from localStorage
        let xmlFeed = window.localStorage.getItem(`availability-${this.state.country}`) || '';
        this.setState({
          availability: JSON.parse(xmlFeed)
        });
      }
      // remove loader
      this.setState({
        loading: false
      });
    })
    .catch((e) => {
      // remove loader
      this.setState({
        loading: false
      });
      console.log(e.toJSON());
    })
  }

  renderDataTable() {
    if (this.state.loading) {
      return (
        <RLJEDataTableSkeleton />
      );
    } else {
      return (
        <RLJEDataTable></RLJEDataTable>
      )
    }
  }

  render() {
    return (this.renderDataTable());
  }
}

export default Availability;