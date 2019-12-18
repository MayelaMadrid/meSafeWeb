import { Map, GoogleApiWrapper } from 'google-maps-react';
import React, { Component } from 'react';
export class MapContainer extends Component {
  render() {
    return (
      <Map
        style={{ width: '50%', height: '50%',position:"static" }}
        google={this.props.google}
        centerAroundCurrentLocation={true}
        center={this.props.center}
        zoom={15}
        visible={true}
        onClick={this.props.onClick}
        initialCenter={this.props.initialCenter}
        bounds={this.props.bounds}
        onReady={this.props.onReady}
      >
        {this.props.children}
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyDCTc_IuiXgVT8RmAAmyaOW4s3v3_22nlk")
})(MapContainer)