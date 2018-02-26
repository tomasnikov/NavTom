/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
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
      error: null
    };
  }
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        console.log("current position");
        this.setState({
          lastLatitude: this.state.latitude || position.coords.latitude,
          lastLongitude: this.state.longitude || position.coords.longitude,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null
        });
      },
      error => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 1000 }
    );
    navigator.geolocation.watchPosition(
      position => {
        console.log("position changed");
        this.setState({
          lastLatitude: this.state.latitude || position.coords.latitude,
          lastLongitude: this.state.longitude || position.coords.longitude,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null
        });
      },
      error => this.setState({ error: error.message }),
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 1000,
        distanceFilter: 1
      }
    );
  }
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          {this.state.error && (
            <Text>
              There was an error{"\n"}
              {this.state.error}
              {"\n"}
            </Text>
          )}
          Your last position was
          {"\n"}
          Latitude: {this.state.lastLatitude}
          {"\n"}
          Longtitude: {this.state.lastLongitude}
          {"\n"}
          Your current position is
          {"\n"}
          Latitude: {this.state.latitude}
          {"\n"}
          Longtitude: {this.state.longitude}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
