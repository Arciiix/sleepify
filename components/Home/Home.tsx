import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { showMessage } from "react-native-flash-message";
import { withTheme, Switch, ActivityIndicator } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import styles from "./Home.styles";
import settings from "../Settings";

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
    await new Promise((resolve, reject) =>
      this.setState({ isLoading: true }, resolve)
    );

    let isConnected: boolean = true;

    let request = await fetch(`${settings.ip}/getData`);
    if (request.status !== 200) isConnected = false;
    let response = await request.json();
    if (!response) isConnected = false;
    if (response.err) isConnected = false;

    if (!isConnected) {
      //TODO IDEA: Save data into database, so when there isn't connection, the app will fetch data from it
      showMessage({
        message: `Nie połączono się z serwerem! ${response.message}`,
        type: "danger",
        autoHide: false,
        floating: true,
        icon: "danger",
      });
      this.setState({
        time: `${this.addZero(new Date().getHours())}:${this.addZero(
          new Date().getMinutes()
        )}?`,
        alarmTime: "-",
        timeWord: "three",
        isAlarmActive: false,
        isQRCodeEnabled: false,
        isSnoozeEnabled: false,
        timeUntilAlarm: "?",
        temperature: 0,
        temperatureRange: { min: 20, max: 24 },
        isConnected: false,
        isLoading: false,
        chartRotation: 0,
        chartPercent: 0,
        isTheAlarmSwitchingNow: false,
      });
    } else {
      //If the time isn't identical, don't show the success message (because it would cover the warning)
      if (response.data.isTheTimeIdenticalToTheServerOne) {
        showMessage({
          message: "Pomyślnie pobrano dane!",
          floating: true,
          type: "success",
          icon: "success",
        });
      }

      let parsedCurrentTime: { hour: number; minute: number } = this.parseTime(
        response.data.time
      );

      let timeWord: number = parsedCurrentTime.hour;
      if (timeWord >= 12) {
        timeWord -= 12;
      }
      let word: string = numbersInWords[timeWord];

      //Calculate the time that is left to the alarm and update the chart
      let parsedAlarmTime: { hour: number; minute: number } = this.parseTime(
        response.data.alarm
      );
      let parsedAlarmHour = parsedAlarmTime.hour;

      if (parsedAlarmHour >= 12) {
        parsedAlarmHour -= 12;
      }

      let currentTimeDate: Date = new Date();
      currentTimeDate.setHours(parsedCurrentTime.hour);
      currentTimeDate.setMinutes(parsedCurrentTime.minute);

      let alarmTimeDate: Date = new Date();
      alarmTimeDate.setHours(parsedAlarmTime.hour);
      alarmTimeDate.setMinutes(parsedAlarmTime.minute);

      //If the alarmTimeDate is earlier than currentTime, it means that the alarm is tommorow
      if (currentTimeDate > alarmTimeDate) {
        alarmTimeDate.setTime(alarmTimeDate.getTime() + 86400000); //So we add the whole day to this date
      }

      let rotation: number = Math.floor(
        ((timeWord * 60 + parsedCurrentTime.minute) / 720) * 360
      ); //time/max*360°

      let percent: number = Math.floor(
        ((alarmTimeDate.getTime() - currentTimeDate.getTime()) /
          (1000 * 60 * 60 * 12)) *
          100
      ); // difference/max*100%

      let difference: number =
        alarmTimeDate.getTime() - currentTimeDate.getTime();

      let differenceText = `${this.addZero(
        Math.floor(difference / 60000 / 60)
      )}:${this.addZero(Math.floor(difference / 60000) % 60)}`;

      if (!response.data.isTheTimeIdenticalToTheServerOne) {
        showMessage({
          message: `Czas na budziku nie zgadza się z serwerem! (${response.data.time})`,
          duration: 5000,
          type: "warning",
          icon: "warning",
          floating: true,
        });
      }

      this.setState({
        time: response.data.time,
        alarmTime: response.data.alarm,
        timeWord: word,
        isAlarmActive: response.data.isAlarmActive,
        isQRCodeEnabled: response.data.isQRCodeEnabled,
        isSnoozeEnabled: response.data.isSnoozeEnabled,
        timeUntilAlarm: differenceText,
        temperature: response.data.temperature,
        temperatureRange: response.data.temperatureRange,
        isConnected: true,
        isLoading: false,
        chartRotation: rotation,
        chartPercent: percent,
        isTheAlarmSwitchingNow: false,
      });
    }
  }

  render() {
    if (this.state.isLoading) {
      //TODO: Make the loading page
      return (
        <View style={styles.loadingView}>
          <ActivityIndicator
            animating={true}
            size={100}
            color={"#ffffff"}
            accessibilityComponentType={"ActivityIndicator"}
            accessibilityTraits={"Loading"}
          />
          <Text style={styles.loadingText}>Ładowanie...</Text>
          <Text style={{ color: "white", fontSize: 30, textAlign: "center" }}>
            {" "}
            {/* DEV TODO */}
            DEV - This screen isn't finished yet
          </Text>
        </View>
      );
    } else {
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
            accessibilityTraits={"switch"}
            accessibilityComponentType={"switch"}
            accessibilityRole={"switch"}
            accessibilityState={{
              selected: this.state.isAlarmActive,
              busy: this.state.isTheAlarmSwitchingNow,
            }}
            accessibilityLabel={"Switch the alarm state"}
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
}

export default withTheme(Home);
