import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { withTheme } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import styles from "./Home.styles";

interface HomeState {
  time: string;
  timeWord: string; //A word that describes the hour (for e.g. twelve) (used for icon)
  alarmTime: string;
  isAlarmActive: boolean;
  isQRCodeEnabled?: boolean;
  isSnoozeEnabled?: boolean;
  timeUntilAlarm: string;
  temperature: number;
  isConnected?: boolean;
  isLoading: boolean;
}

enum numbersInWords {
  twelve,
  one,
  two,
  three,
  four,
  five,
  six,
  seven,
  eight,
  nine,
  ten,
  eleven,
}

class Home extends React.Component<any, HomeState> {
  constructor(props: any) {
    super(props);
    this.state = {
      time: "",
      alarmTime: "",
      timeWord: "",
      isAlarmActive: false,
      isQRCodeEnabled: false,
      isSnoozeEnabled: false,
      timeUntilAlarm: "",
      temperature: 0,
      isConnected: false,
      isLoading: true,
    };
  }

  componentDidMount(): void {
    //DEV
    //TODO: Connect to the server

    //If the connection has failed
    let isConnected = false;
    showMessage({
      message: "Nie połączono się z serwerem!",
      type: "danger",
      autoHide: false,
      floating: true,
      icon: "danger",
    });

    let timeWord: number = 12; //DEV TODO: get it from the current time
    if (timeWord >= 12) {
      timeWord -= 12;
    }
    let word: string = numbersInWords[timeWord];

    //DEV
    this.setState(
      {
        time: "12:00",
        alarmTime: "13:00",
        timeWord: word,
        isAlarmActive: true,
        isQRCodeEnabled: true,
        isSnoozeEnabled: true,
        timeUntilAlarm: "01:00",
        temperature: 21.45,
        isConnected: isConnected,
        isLoading: false,
      },
      () => {
        this.forceUpdate();
      }
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.time}>
          <MaterialCommunityIcons
            name={`clock-time-${this.state.timeWord}-outline`}
            color={"white"}
            size={100}
          />
          <Text style={styles.timeText}>{this.state.time}</Text>
        </View>
      </View>
    );
  }
}

export default withTheme(Home);
