import React from 'react'
import { withGoogleMap, GoogleMap, withScriptjs } from "react-google-maps";
import Autocomplete from 'react-google-autocomplete';
import Geocode from "react-geocode";
Geocode.setApiKey("AIzaSyDCTc_IuiXgVT8RmAAmyaOW4s3v3_22nlk");
Geocode.enableDebug();
class Map extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         address: '',
         mapPosition: {
            lat: this.props.center.lat,
            lng: this.props.center.lng
         },
      }
   }
   UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.center.lat !== this.state.mapPosition.lat && nextProps.center.lng !== this.state.mapPosition.lng) {
         this.setState({
            mapPosition: {
               lat: nextProps.center.lat,
               lng: nextProps.center.lng
            }
         })
      }
   }

   componentDidMount() {
      Geocode.fromLatLng(this.state.mapPosition.lat, this.state.mapPosition.lng).then(
         response => {
            const address = response.results[0].formatted_address;

            this.setState({
               address: (address) ? address : ''
            })
         },
         error => {
            console.error(error);
         }
      );
   };

   onChange = (event) => {
      this.setState({ [event.target.name]: event.target.value });
   };

   onInfoWindowClose = (event) => {
   };

   onPlaceSelected = async (place) => {
      if (!place.formatted_address) {
         const res = await Geocode.fromAddress(place.name)
         let latValue = res.results[0].geometry.location.lat;
         let lngValue = res.results[0].geometry.location.lng;
         this.props.onChange(latValue, lngValue)
         this.props.onChangeText(place.name)

         this.setState({
            mapPosition: {
               lat: latValue,
               lng: lngValue
            }
         });
         return
      }
      const address = place.formatted_address,
         latValue = place.geometry.location.lat(),
         lngValue = place.geometry.location.lng();
      this.props.onChange(latValue, lngValue)
      this.props.onChangeText(address)

      // Set these values in the state.
      this.setState({
         address: (address) ? address : '',
         mapPosition: {
            lat: latValue,
            lng: lngValue
         },
      })
   };

   render() {
      const AsyncMap = withScriptjs(
         withGoogleMap(
            props => (
               <GoogleMap google={this.props.google}
                  defaultZoom={this.props.zoom}
                  defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}
               >
                  <Autocomplete
                     style={{
                        width: '100%',
                        height: '40px',
                        paddingLeft: '16px',
                        marginTop: '2px',
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        borderBottom: "2px solid var(--color-blue-general)"
                     }}
                     onPlaceSelected={this.onPlaceSelected}
                     types={['address']}
                  />
                  {this.props.children}
               </GoogleMap>
            )
         )
      );
      let map;
      if (this.props.center.lat !== undefined) {
         map = <div>

            <AsyncMap
               googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDCTc_IuiXgVT8RmAAmyaOW4s3v3_22nlk&libraries=places"
               loadingElement={
                  <div style={{ height: `100%` }} />
               }
               containerElement={
                  <div style={{ height: this.props.height }} />
               }

               mapElement={
                  <div style={{ height: `100%` }} />
               }
            />
         </div>
      } else {
         map = <div style={{ height: this.props.height }} />
      }
      return (map)
   }
}
export default Map