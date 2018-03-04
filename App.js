import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Button } from "react-native";
import MapView, { Polyline } from "react-native-maps";

const earthRadiusKm = 6371;
const distanceFilter = 1;
function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function getPositionDiff(positionA, positionB) {
  const dLat = degreesToRadians(positionA.latitude - positionB.latitude);
  const dLon = degreesToRadians(positionA.longitude - positionB.longitude);

  const latA = degreesToRadians(positionA.latitude);
  const latB = degreesToRadians(positionB.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(latA) * Math.cos(latB);

  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c * 1000;
}

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
    this.addRandomMarker = this.addRandomMarker.bind(this);
  }

  updatePosition(position) {
    const { latitude, longitude, markers } = this.state;
    console.log("position", position);
    if (markers.length > 0) {
      const positionDiff = getPositionDiff(position, markers[markers.length - 1]);
      if (positionDiff < distanceFilter) {
        return;
      }
    }
    this.setState({
      lastLatitude: latitude || position.latitude,
      lastLongitude: longitude || position.longitude,
      latitude: position.latitude,
      longitude: position.longitude,
      error: null,
      markers: [...markers, position],
    });
  }

  addRandomMarker() {
    const { latitude, longitude } = this.state;
    const random = () => (Math.random() * -1 + 0.5) * 0.001;
    const newPosition = {
      latitude: latitude + random(),
      longitude: longitude + random(),
    };
    this.updatePosition(newPosition);
  }

  componentDidMount() {
    const { latitude, longitude, markers } = this.state;
    let options = { enableHighAccuracy: true }; //, timeout: 30000, maximumAge: 1000 };
    options = {};

    navigator.geolocation.getCurrentPosition(
      position => this.updatePosition(position.coords),
      error => this.setState({ error: error.message }),
      options
    );
    this.watchId = navigator.geolocation.watchPosition(
      position => this.updatePosition(position.coords),
      error => this.setState({ error: error.message }),
      { ...options, distanceFilter }
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  renderMap() {
    let { latitude, longitude, markers } = this.state;
    latitude = latitude || 64.9;
    longitude = longitude || -20.8;
    console.log(this.state);
    return (
      <MapView
        style={styles.map}
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.001,
        }}
      >
        <Polyline coordinates={markers} strokeWidth={2} />
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
        <Button onPress={this.addRandomMarker} title="Add random marker" />
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
});
