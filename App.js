import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android: "Double tap R on your keyboard to reload,\n" + "Shake or press menu button for dev menu",
});

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      lastLatitude: null,
      lastLongitude: null,
      latitude: null,
      longitude: null,
      error: null,
      markers: [],
    };
  }

  updatePosition() {
    const { latitude, longitude, markers } = this.state;

    this.setState({
      lastLatitude: latitude || position.coords.latitude,
      lastLongitude: longitude || position.coords.longitude,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      error: null,
    });
  }

  componentDidMount() {
    const { latitude, longitude, markers } = this.state;
    const options = { enableHighAccuracy: true, timeout: 30000, maximumAge: 1000 };

    navigator.geolocation.getCurrentPosition(
      position => {
        this.updatePosition();
      },
      error => this.setState({ error: error.message }),
      options
    );
    this.watchId = navigator.geolocation.watchPosition(
      position => {
        console.log("updating position");
        this.updatePosition();
      },
      error => this.setState({ error: error.message }),
      {
        ...options,
        distanceFilter: 1,
      }
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  renderMap() {
    let { latitude, longitude, markers } = this.state;
    latitude = latitude || 37.78825;
    longitude = longitude || -122.4324;
    console.log(this.state);
    return (
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0,
          longitudeDelta: 0.04,
        }}
      >
        {markers.map(marker => (
          <Marker
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
          />
        ))}
      </MapView>
    );
  }

  renderText() {
    const { error, lastLatitude, lastLongitude, latitude, longitude } = this.state;

    return (
      <Text style={styles.welcome}>
        {error && (
          <Text>
            There was an error{"\n"}
            {error}
            {"\n"}
          </Text>
        )}
        Your last position was
        {"\n"}
        Latitude: {lastLatitude}
        {"\n"}
        Longtitude: {lastLongitude}
        {"\n"}
        Your current position is
        {"\n"}
        Latitude: {latitude}
        {"\n"}
        Longtitude: {longitude}
      </Text>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderMap()}
        {this.renderText()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  map: {
    position: "relative",
    top: 0,
    height: 400,
    width: 400,
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
});
