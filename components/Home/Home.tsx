import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { withTheme } from "react-native-paper";

import styles from "./Home.styles";

interface HomeState {
  time: string;
  alarmTime: string;
  isAlarmActive: boolean;
  isQRCodeEnabled?: boolean;
  isSnoozeEnabled?: boolean;
  timeUntilAlarm: string;
  temperature: number;
  isConnected?: boolean;
}

class Home extends React.Component<any, HomeState> {
  constructor(props: any) {
    super(props);
    this.state = {
      time: "12:00",
      alarmTime: "13:00",
      isAlarmActive: true,
      isQRCodeEnabled: true,
      isSnoozeEnabled: true,
      timeUntilAlarm: "01:00",
      temperature: 21.45,
      isConnected: true,
    };
  }

  componentDidMount(): void {
    //DEV
    //TODO: Connect to the server

    //If the connection has failed
    this.setState({ isConnected: false }, () => {
      this.forceUpdate();
      showMessage({
        message: "Nie połączono się z serwerem!",
        type: "danger",
        autoHide: false,
        floating: true,
        icon: "danger",
      });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.time}>{this.state.time}</Text>
      </View>
    );
  }
}

export default withTheme(Home);
