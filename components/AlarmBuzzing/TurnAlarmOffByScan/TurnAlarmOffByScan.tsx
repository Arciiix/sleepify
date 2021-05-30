import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { TextInput, Button, withTheme } from "react-native-paper";

import settings from "../../Settings";
import styles from "./TurnAlarmOffByScan.styles";

import { showMessage } from "react-native-flash-message";
import Loading from "../../Loading/Loading";
import { turnTheAlarmOff } from "../../TurnTheAlarmOff";

interface TurnAlarmOffByScanState {
  isLoading: boolean;
  time: { hour: number; minute: number };
  date: string;
  dayOfTheWeek: string;
  QRCodeHash: string;
  QRCodeID: string;
}

enum daysOfWeek {
  Niedziela,
  Poniedziałek,
  Wtorek,
  Środa,
  Czwartek,
  Piątek,
  Sobota,
}

class TurnAlarmOffByScan extends React.Component<any, TurnAlarmOffByScanState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoading: true,
      time: { hour: 0, minute: 0 },
      date: "",
      dayOfTheWeek: "",
      QRCodeHash: "",
      QRCodeID: "",
    };
  }

  componentDidMount() {
    this.getData();

    this.props.navigation.addListener("focus", (): void => {
      if (this.props.route.params.QRCodeData) {
        this.setState({ QRCodeHash: this.props.route.params.QRCodeData.h });
      }
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

          this.setState({
            isLoading: false,
            time: data.currentTime,
            date: `${this.addZero(date.getDate())}.${this.addZero(
              date.getMonth() + 1
            )}.${date.getFullYear()}`,
            dayOfTheWeek: daysOfWeek[date.getDay()],
            QRCodeID: data.qrCodeId,
          });
        }
      });
  }

  addZero(number: number): string {
    return number < 10 ? `0${number}` : `${number}`;
  }

  async turnOffTheAlarm(): Promise<void> {
    //Check if user has scanned the QR code or typed something in the input
    if (!this.state.QRCodeHash) return;

    //Try to turn off the alarm
    let turningOffStatus = await turnTheAlarmOff({
      i: this.state.QRCodeID,
      h: this.state.QRCodeHash,
    });
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
      return <Loading />;
    } else {
      return (
        <ScrollView>
          <View style={styles.container}>
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

            <View style={styles.QRCodeInfo}>
              <TextInput
                mode={"flat"}
                style={styles.hashInput}
                label="Hash/zapasowy klucz"
                accessibilityTraits={"input"}
                accessibilityComponentType={"input"}
                value={this.state.QRCodeHash}
                onChangeText={(e) => this.setState({ QRCodeHash: e })}
              />
              <Text style={styles.QRCodeIDText}>ID: {this.state.QRCodeID}</Text>
            </View>

            <View style={styles.turningOffButtons}>
              <Button
                icon="camera"
                color="#2e6be6"
                labelStyle={{ color: "white" }}
                style={styles.turningOffButtonElement}
                mode="contained"
                accessibilityTraits={"Button"}
                accessibilityComponentType={"Button"}
                onPress={() => {
                  //DEV TODO: Go to the QR code scanning view
                  this.props.navigation.navigate("ScanAlarmQRCode");
                }}
              >
                <Text>Skanuj</Text>
              </Button>
              <Button
                icon="alarm-off"
                color="#eb4d4b"
                labelStyle={{ color: "white" }}
                style={styles.turningOffButtonElement}
                mode="contained"
                accessibilityTraits={"Button"}
                accessibilityComponentType={"Button"}
                onPress={() => {
                  this.turnOffTheAlarm.apply(this);
                }}
              >
                <Text>Wyłącz</Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      );
    }
  }
}

export default withTheme(TurnAlarmOffByScan);
