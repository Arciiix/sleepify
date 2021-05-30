import React from "react";
import { View, Text, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import settings from "../Settings";
import { withTheme, ActivityIndicator, Button } from "react-native-paper";
import { showMessage } from "react-native-flash-message";

import styles from "./AlarmBuzzing.styles";
import TurnAlarmOffByScan from "./TurnAlarmOffByScan/TurnAlarmOffByScan";
import Loading from "../Loading/Loading";
import ScanAlarmQRCode from "./TurnAlarmOffByScan/ScanAlarmQRCode/ScanAlarmQRCode";
import { turnTheAlarmOff } from "../TurnTheAlarmOff";

import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

enum daysOfWeek {
  Niedziela,
  Poniedziałek,
  Wtorek,
  Środa,
  Czwartek,
  Piątek,
  Sobota,
}

interface AlarmBuzzingState {
  weatherIcon: string;
  isLoading: boolean;
  weatherDescription: string;
  cityName: string;
  outsideTemperature: number | null;
  time: { hour: number; minute: number };
  dayOfTheWeek: string;
  date: string;
  isQRCodeEnabled: boolean;
  message: string;
  isSnoozeEnabled: boolean;
  snoozeLength?: number;
}

class AlarmBuzzingScreen extends React.Component<any, AlarmBuzzingState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoading: true,
      weatherIcon: "",
      weatherDescription: "",
      cityName: "",
      outsideTemperature: null,
      time: { hour: 0, minute: 0 },
      dayOfTheWeek: "",
      date: "",
      isQRCodeEnabled: false,
      message: "",
      isSnoozeEnabled: false,
      snoozeLength: 0,
    };
  }
  async componentDidMount(): Promise<void> {
    await this.getData();
    this.props.navigation.addListener("tabPress", (e: any) => {
      this.getData(); //Refresh the data when user clicks on the BottomNavigation button
    });
  }

  async getData(): Promise<void> {
    fetch(`${settings.ip}/getData`)
      .then((request) => request.json())
      .then((response) => {
        if (response.err) {
          showMessage({
            message: `Błąd przy pobieraniu danych: ${response.message}`,
            type: "danger",
            icon: "danger",
            autoHide: false,
          });
        } else {
          let data = response.data;
          let date: Date = new Date();

          this.setState(
            {
              isLoading: false,
              time: data.currentTime,
              message: data.message,
              isSnoozeEnabled: data.isSnoozeEnabled,
              snoozeLength: data.snoozeLength,
              isQRCodeEnabled: data.isQRCodeEnabled,

              date: `${this.addZero(date.getDate())}.${this.addZero(
                date.getMonth() + 1
              )}.${date.getFullYear()}`,
              dayOfTheWeek: daysOfWeek[date.getDay()],
            },
            () => {
              this.getWeather(data.constants.openWeatherApiKey);
            }
          );
        }
      });
  }

  addZero(number: number): string {
    return number < 10 ? `0${number}` : `${number}`;
  }

  async getWeather(apiKey: string): Promise<void> {
    if (!apiKey) {
      showMessage({
        message: `Nie ustawiono API key do pogody!`,
        type: "danger",
        icon: "danger",
        autoHide: false,
      });
      return this.setState({
        weatherDescription: "Błąd przy pobieraniu",
        cityName: "pogody",
      });
    }
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?zip=${settings.zip},${settings.country}&units=metric&lang=pl&appid=${apiKey}`
    )
      .then((request) => request.json())
      .then((data) => {
        if (data.cod.toString() === "401") {
          showMessage({
            message: `Zły API key do pogody! ${JSON.stringify(data)}`,
            type: "danger",
            icon: "danger",
            autoHide: false,
          });
          return this.setState({
            weatherDescription: "Błąd przy pobieraniu",
            cityName: "pogody",
          });
        }
        if (data.cod.toString() === "404") {
          showMessage({
            message: `Nie znaleziono takiego miasta! ${JSON.stringify(data)}`,
            type: "danger",
            icon: "danger",
            autoHide: false,
          });
          return this.setState({
            weatherDescription: "Błąd przy pobieraniu",
            cityName: "pogody",
          });
        }
        if (!data.weather) {
          showMessage({
            message: `Błąd przy pobieraniu pogody: ${JSON.stringify(data)}`,
            type: "danger",
            icon: "danger",
            autoHide: false,
          });
          return this.setState({
            weatherDescription: "Błąd przy pobieraniu",
            cityName: "pogody",
          });
        } else {
          this.setState({
            weatherIcon: data.weather[0].icon,
            weatherDescription: data.weather[0].description,
            cityName: data.name,
            outsideTemperature: data.main.temp,
          });
        }
      });
  }

  parseWeatherIcon(name: string): string {
    if (!name) return "ios-cloud-outline";
    let validationRegEx = /^\d{2}(n|d)$/;
    if (!validationRegEx.test(name)) {
      showMessage({
        message: `Błędny kod ikony w pogodzie`,
        type: "danger",
        icon: "danger",
        autoHide: false,
      });
      return "ios-cloud-outline";
    } else {
      name = name.slice(0, -1);
      switch (name) {
        //From https://openweathermap.org/weather-conditions
        case "01":
          return "sunny-outline";
        case "02":
          return "partly-sunny-outline";
        case "03":
          return "ios-cloud-outline";
        case "04":
          return "ios-cloud-outline";
        case "09":
          return "rainy-outline";
        case "10":
          return "rainy-outline";
        case "11":
          return "thunderstorm-outline";
        case "13":
          return "snow-outline";
        case "50":
          return "menu-outline"; //An icon for mist
        default:
          return "ios-cloud-outline";
      }
    }
  }

  async turnOffTheAlarm() {
    let turningOffStatus = await turnTheAlarmOff();
    if (!turningOffStatus.error) {
      //Success
      //TODO: Make a success page

      //DEV
      showMessage({
        message: `Wyłączono alarm!`,
        type: "success",
        icon: "success",
        autoHide: true,
        floating: true,
      });
    } else {
      showMessage({
        message: `${turningOffStatus.message}`,
        type: "danger",
        icon: "danger",
        autoHide: false,
      });
    }
  }

  render() {
    if (this.state.isLoading) {
      //TODO: Make the loading page
      return <Loading />;
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.weatherInfo}>
            <Ionicons
              name={this.parseWeatherIcon(this.state.weatherIcon)}
              color={"white"}
              size={80}
            />
            <View style={styles.weatherDetails}>
              <Text style={styles.weatherText}>
                {this.state.weatherDescription.charAt(0).toUpperCase() +
                  this.state.weatherDescription.slice(1)}
                {/* It makes the first letter capitalized */}
              </Text>
              <Text style={styles.weatherText}>
                {this.state.cityName}{" "}
                {this.state.outsideTemperature
                  ? `${this.state.outsideTemperature}°C`
                  : ""}
              </Text>
            </View>
          </View>

          <View style={styles.circle}>
            <View style={styles.circleInsideView}>
              <Text style={styles.timeText}>
                {this.addZero(this.state.time.hour)}:
                {this.addZero(this.state.time.minute)}
              </Text>
              <Text style={styles.dateText}>{this.state.dayOfTheWeek}</Text>
              <Text style={styles.dateText}>{this.state.date}</Text>
            </View>
          </View>

          {this.state.message !== "" && (
            <View style={styles.messageView}>
              <Ionicons name={"md-chatbox-outline"} color={"white"} size={40} />
              <Text style={styles.message}>{this.state.message}</Text>
            </View>
          )}

          <View style={styles.buttonsView}>
            {this.state.isSnoozeEnabled && (
              <Button
                accessibilityComponentType={"button"}
                accessibilityTraits={"button"}
                style={styles.wideButton}
                icon="alarm-snooze"
                mode="contained"
                color="#2e6be6"
                labelStyle={{ color: "white" }}
                onPress={() => {
                  //DEV TODO: Snooze
                  console.log("Pressed the snooze button");
                }}
              >
                Drzemka {this.state.snoozeLength} min.
              </Button>
            )}

            <Button
              accessibilityComponentType={"button"}
              accessibilityTraits={"button"}
              style={styles.wideButton}
              icon="alarm-off"
              mode="contained"
              color="#eb4d4b"
              labelStyle={{ color: "white" }}
              onPress={() => {
                if (this.state.isQRCodeEnabled) {
                  this.props.navigation.navigate("TurnOffByQRCode", {
                    QRCodeData: null,
                  });
                } else {
                  this.turnOffTheAlarm();
                }
              }}
            >
              Wyłącz
            </Button>
          </View>
        </View>
      );
    }
  }
}

class QRCodeSetupNavigation extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { mount: true };
  }

  componentDidMount() {
    this.props.navigation.addListener("blur", () => {
      this.setState({ mount: false });
    });
    this.props.navigation.addListener("focus", () => {
      this.setState({ mount: true });
    });
  }
  render() {
    if (this.state.mount) {
      return (
        <Stack.Navigator initialRouteName={"AlarmBuzzingScreen"}>
          <Stack.Screen
            name="AlarmBuzzingScreen"
            component={withTheme(AlarmBuzzingScreen)}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TurnOffByQRCode"
            component={
              TurnAlarmOffByScan
            } /* DEV TODO: Check whether the QR Code is enabled - if so, then go to TurnAlarmOffByScan component, otherwise - just turn off the alarm */
            options={{
              title: "Wyłącz alarm",
            }}
          />
          <Stack.Screen
            name="ScanAlarmQRCode"
            component={
              ScanAlarmQRCode
            } /* DEV TODO: Check whether the QR Code is enabled - if so, then go to TurnAlarmOffByScan component, otherwise - just turn off the alarm */
            options={{
              title: "Wyłącz alarm",
            }}
          />
        </Stack.Navigator>
      );
    } else {
      return null;
    }
  }
}

export default QRCodeSetupNavigation;
