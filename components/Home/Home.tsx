import React from "react";
import { StyleSheet, Text, View, Switch } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { showMessage } from "react-native-flash-message";
import { withTheme } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import styles from "./Home.styles";

//DEV
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Your project is accessing the following APIs"]);

interface HomeState {
  time: string;
  timeWord: string; //A word that describes the hour (for e.g. twelve) (used for icon)
  alarmTime: string;
  isAlarmActive: boolean;
  isQRCodeEnabled?: boolean;
  isSnoozeEnabled?: boolean;
  timeUntilAlarm: string;
  temperature: number;
  temperatureRange: { min: number; max: number };
  isConnected?: boolean;
  isLoading: boolean;
  chartRotation: number;
  chartPercent: number;
  difference: string;
  isTheAlarmSwitchingNow: boolean;
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
      temperatureRange: { min: 20, max: 24 },
      isConnected: false,
      isLoading: true,
      chartRotation: 0,
      chartPercent: 0,
      difference: "00:00",
      isTheAlarmSwitchingNow: false,
    };
  }

  parseTime(time: string): { hour: number; minute: number } {
    return {
      hour: parseInt(time.split(":")[0]),
      minute: parseInt(time.split(":")[1]),
    };
  }

  addZero(number: number): string {
    return number < 10 ? `0${number}` : `${number}`;
  }
  async switchTheAlarm(isTurnedOn: boolean): Promise<void> {
    await new Promise((resolve) =>
      this.setState({ isTheAlarmSwitchingNow: true }, resolve)
    );
    //DEV
    //TODO: Turn on/off the alarm

    this.setState({ isAlarmActive: isTurnedOn, isTheAlarmSwitchingNow: false });
  }

  getTemperatureRangeColor(): string {
    let temperature: number = this.state.temperature;
    let { min, max } = this.state.temperatureRange;

    let color: string = "#23C162";

    if (temperature < min) {
      color = "#1273a3";
    } else if (temperature > max) {
      color = "#db6d0d";
    }

    return color;
  }

  async componentDidMount(): Promise<void> {
    await this.getData();

    this.props.navigation.addListener("tabPress", (e: any) => {
      this.getData(); //Refresh the data when user clicks on the BottomNavigation button
    });
  }

  async getData(): Promise<any> {
    //DEV
    //TODO: Connect to the server
    //If the connection has failed
    let isConnected = false;

    if (!isConnected) {
      showMessage({
        message: "Nie połączono się z serwerem!",
        type: "danger",
        autoHide: false,
        floating: true,
        icon: "danger",
      });
    }

    //DEV
    //TODO: Fetch them from the server
    let currentTime: string = "12:00";
    let alarmTime: string = "13:00";

    let parsedCurrentTime: { hour: number; minute: number } = this.parseTime(
      currentTime
    );

    let timeWord: number = parsedCurrentTime.hour;
    if (timeWord >= 12) {
      timeWord -= 12;
    }
    let word: string = numbersInWords[timeWord];

    //Calculate the time that is left to the alarm and update the chart
    let parsedAlarmTime: { hour: number; minute: number } = this.parseTime(
      alarmTime
    );
    if (parsedAlarmTime.hour >= 12) {
      parsedAlarmTime.hour -= 12;
    }

    let timeInMinutes: number = timeWord * 60 + parsedCurrentTime.minute;
    let alarmInMinutes: number =
      parsedAlarmTime.hour * 60 + parsedAlarmTime.minute;

    let rotation: number = Math.floor((timeInMinutes / 720) * 360); //time/max*360°

    let percent: number = Math.floor(
      (Math.abs(alarmInMinutes - timeInMinutes) / 720) * 100
    ); // difference/max*100%

    let difference =
      this.parseTime(alarmTime).hour * 60 +
      parsedAlarmTime.minute -
      parsedCurrentTime.hour * 60 -
      parsedCurrentTime.minute;

    if (difference < 0) {
      difference = 1440 + difference; //If the difference is a negative number, it means that the alarm time is after 0:00, so we have to subtract this from the whole 24 hours (1 day)
    }

    difference -= 1; //We want to make the value little lower, because we want whole minutes (for e.g if there's 12:00:01 and the alarm is 13:00, it would say it's 1:00 left, but we want 0:59)
    let differenceText = `${this.addZero(
      Math.floor(difference / 60)
    )}:${this.addZero(difference % 60)}`;

    //DEV
    this.setState({
      time: currentTime,
      alarmTime: alarmTime,
      timeWord: word,
      isAlarmActive: false,
      isQRCodeEnabled: true,
      isSnoozeEnabled: true,
      timeUntilAlarm: differenceText,
      temperature: 22.45,
      temperatureRange: { min: 20, max: 24 },
      isConnected: isConnected,
      isLoading: false,
      chartRotation: rotation,
      chartPercent: percent,
      isTheAlarmSwitchingNow: false,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.time}>
          <MaterialCommunityIcons
            name={`clock-time-${this.state.timeWord}-outline`}
            color={"white"}
            size={80}
          />
          <Text style={styles.timeText}>{this.state.time}</Text>
        </View>

        <AnimatedCircularProgress
          size={310}
          width={10}
          fill={this.state.chartPercent}
          rotation={this.state.chartRotation}
          tintColor={this.state.isAlarmActive ? "#0781fa" : "#004080"}
          backgroundColor={this.state.isAlarmActive ? "#ffffff" : "#919191"}
        >
          {() => {
            return (
              <>
                <Text style={styles.alarmHour}>{this.state.alarmTime}</Text>
                {this.state.isAlarmActive ? (
                  <View style={styles.alarmIcons}>
                    <MaterialCommunityIcons
                      name={"alarm"}
                      color={"white"}
                      size={50}
                      style={styles.alarmIcon}
                    />
                    {this.state.isQRCodeEnabled && (
                      <MaterialCommunityIcons
                        name={"qrcode-scan"}
                        color={"white"}
                        size={50}
                        style={styles.alarmIcon}
                      />
                    )}

                    {this.state.isSnoozeEnabled && (
                      <MaterialCommunityIcons
                        name={"alarm-snooze"}
                        color={"white"}
                        size={50}
                        style={styles.alarmIcon}
                      />
                    )}
                  </View>
                ) : (
                  <View style={styles.alarmIcons}>
                    <MaterialCommunityIcons
                      name={"alarm-off"}
                      color={"white"}
                      size={50}
                      style={styles.alarmIcon}
                    />
                  </View>
                )}

                <Text style={styles.alarmTimeLeft}>
                  za {this.state.timeUntilAlarm}
                </Text>
              </>
            );
          }}
        </AnimatedCircularProgress>
        <Switch
          trackColor={{
            true: this.state.isAlarmActive ? "#7ac5cf" : "#b0003e",
            false: this.state.isAlarmActive ? "#7ac5cf" : "#b0003e",
          }} //We want it to be synchronized - turning alarm takes some time
          thumbColor={this.state.isAlarmActive ? "#0099ff" : "#ffffff"}
          onValueChange={this.switchTheAlarm.bind(this)}
          disabled={this.state.isTheAlarmSwitchingNow}
          value={this.state.isAlarmActive}
          style={styles.switch}
        />
        <Text
          style={[
            styles.temperature,
            { color: this.getTemperatureRangeColor() },
          ]}
        >
          {this.state.temperature}°C
        </Text>
      </View>
    );
  }
}

export default withTheme(Home);
