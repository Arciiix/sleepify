import React from "react";
import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import { Button, TextInput, withTheme, Switch } from "react-native-paper";
import { hideMessage, showMessage } from "react-native-flash-message";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import equal from "fast-deep-equal";

import styles from "./SetAlarm.styles";
import { createIconSetFromFontello } from "react-native-vector-icons";

interface SetAlarmState {
  currentTime: { hour: number; minute: number };
  alarmTime: { hour: number; minute: number };
  hasUnsavedChanges: boolean;
  chartRotation: number;
  chartPercent: number;
  isAlarmActive: boolean;
  isQRCodeEnabled?: boolean;
  isSnoozeEnabled?: boolean;
  snoozeLength: number; //In minutes
  qrCodeId: string;
  message: string;
  timeUntilAlarm: string;
  isSaving: boolean; //True when the data is being sent to the server
  isSelectingTime: boolean;
  alarmInDate: Date; //Used in TimePicker
  hasTheUnsavedChangesAlertBeenShown: boolean;
}

class SetAlarm extends React.Component<any, SetAlarmState> {
  private scrollRef: any;
  private initialState: SetAlarmState | any;

  constructor(props: any) {
    super(props);
    this.state = {
      currentTime: { hour: 0, minute: 0 },
      alarmTime: { hour: 0, minute: 1 },
      hasUnsavedChanges: false,
      chartRotation: 0,
      chartPercent: 0,
      isAlarmActive: false,
      isQRCodeEnabled: false,
      isSnoozeEnabled: false,
      snoozeLength: 5,
      qrCodeId: "",
      message: "",
      timeUntilAlarm: "",
      isSaving: false,
      isSelectingTime: false,
      alarmInDate: new Date(),
      hasTheUnsavedChangesAlertBeenShown: false,
    };
    this.scrollRef = React.createRef();
  }

  addZero(number: number): string {
    return number < 10 ? `0${number}` : `${number}`;
  }

  componentDidMount() {
    //DEV
    //TODO: Fetch the current time and alarm time

    let chartObj: Partial<SetAlarmState> = this.updateChart();

    this.setState(
      (prevState) => {
        return { ...prevState, ...chartObj };
      },
      () => {
        //Save the initial state - we want to show the notification when user makes a change (we make a COPY of object, because it's reference type)
        this.initialState = { ...this.state };
      }
    );

    //TODO: When user clicks on the BottomNavigation icon, move the ScrollView to the top
  }

  componentDidUpdate() {
    if (!this.initialState) return; //Usually true when the app didn't render yet

    let isEqual: boolean = equal(
      {
        ...this.initialState,
        ...{
          hasTheUnsavedChangesAlertBeenShown: undefined,
          alarmInDate: undefined,
        },
      },
      {
        ...this.state,
        ...{
          hasTheUnsavedChangesAlertBeenShown: undefined,
          alarmInDate: undefined,
        },
      }
    );
    //We don't want to compare the hasTheUnsavedChangesAlertBeenShown and alarmInDate (because it's set to current time at default, and we have alarmTime object, so it's better to compare it), so we create the copy of object with them set to undefined

    if (!isEqual && !this.state.hasTheUnsavedChangesAlertBeenShown) {
      this.setState({ hasTheUnsavedChangesAlertBeenShown: true });
      showMessage({
        message: "Masz niezapisane zmiany!",
        type: "warning",
        icon: "warning",
        hideOnPress: false,
        autoHide: false,
      });
    } else if (isEqual && this.state.hasTheUnsavedChangesAlertBeenShown) {
      hideMessage();
      this.setState({ hasTheUnsavedChangesAlertBeenShown: false });
    }
  }

  updateChart(): {
    chartRotation: number;
    chartPercent: number;
    timeUntilAlarm: string;
  } {
    //TODO: Refactor code by moving this function into one file (the Home component also uses it)

    let parsedAlarmTime = { ...this.state.alarmTime };
    let parsedTime = { ...this.state.currentTime };

    if (parsedAlarmTime.hour >= 12) {
      parsedAlarmTime.hour -= 12;
    }

    if (parsedTime.hour >= 12) {
      parsedTime.hour -= 12;
    }

    let timeInMinutes: number = parsedTime.hour * 60 + parsedTime.minute;
    let alarmInMinutes: number =
      parsedAlarmTime.hour * 60 + parsedAlarmTime.minute;

    let rotation: number = Math.floor((timeInMinutes / 720) * 360); //time/max*360°

    let percent: number = Math.floor(
      (Math.abs(alarmInMinutes - timeInMinutes) / 720) * 100
    ); // difference/max*100%

    let difference =
      this.state.alarmTime.hour * 60 +
      this.state.alarmTime.minute -
      this.state.currentTime.hour * 60 -
      this.state.currentTime.minute;

    if (difference < 0) {
      difference = 1440 + difference; //If the difference is a negative number, it means that the alarm time is after 0:00, so we have to subtract this from the whole 24 hours (1 day)
    }

    difference -= 1; //We want to make the value little lower, because we want whole minutes (for e.g if there's 12:00:01 and the alarm is 13:00, it would say it's 1:00 left, but we want 0:59)
    let differenceText = `${this.addZero(
      Math.floor(difference / 60)
    )}:${this.addZero(difference % 60)}`;

    return {
      chartRotation: rotation,
      chartPercent: percent,
      timeUntilAlarm: differenceText,
    };
  }

  async saveData(): Promise<void> {
    //DEV
    //TODO: Save data (send it to the server)
    console.log("DEV: SENDDATA");
  }

  openPicker(): void {
    this.setState({ isSelectingTime: true });
  }

  handlePickerChange(event: any, date: any) {
    if (date === undefined) {
      return this.setState({ isSelectingTime: false });
    }
    let selectedDate: Date = new Date(event.nativeEvent.timestamp);
    this.setState(
      {
        alarmTime: {
          hour: selectedDate.getHours(),
          minute: selectedDate.getMinutes(),
        },
        isSelectingTime: false,
        alarmInDate: selectedDate,
      },
      () => {
        let chartObj: Partial<SetAlarmState> = this.updateChart();

        this.setState((prevState) => {
          return { ...prevState, ...chartObj };
        });
      }
    );
  }

  render() {
    return (
      <ScrollView style={styles.scroll} ref={this.scrollRef}>
        <View style={styles.container}>
          {this.state.isSelectingTime && (
            <DateTimePicker
              testID="picker"
              mode="time"
              is24Hour={true}
              value={this.state.alarmInDate}
              onChange={this.handlePickerChange.bind(this)}
            />
          )}
          <View>
            <Pressable onPress={this.openPicker.bind(this)}>
              <AnimatedCircularProgress
                size={270}
                width={10}
                fill={this.state.chartPercent}
                rotation={this.state.chartRotation}
                tintColor={this.state.isAlarmActive ? "#0781fa" : "#004080"}
                backgroundColor={
                  this.state.isAlarmActive ? "#ffffff" : "#919191"
                }
              >
                {() => {
                  return (
                    <>
                      <Text style={styles.alarmHour}>
                        {this.addZero(this.state.alarmTime.hour)}:
                        {this.addZero(this.state.alarmTime.minute)}
                      </Text>

                      <Text style={styles.alarmTimeLeft}>
                        za {this.state.timeUntilAlarm}
                      </Text>
                    </>
                  );
                }}
              </AnimatedCircularProgress>
            </Pressable>
          </View>
          <View style={styles.settings}>
            <View style={styles.option}>
              <View style={styles.description}>
                <MaterialCommunityIcons
                  name={"alarm"}
                  color={"white"}
                  style={styles.optionIcon}
                />
                <Text style={styles.optionText}>Włączony</Text>
              </View>
              <Switch
                style={styles.switch}
                accessibilityTraits={"switch"}
                accessibilityComponentType={"switch"}
                value={this.state.isAlarmActive}
                onValueChange={(v) => this.setState({ isAlarmActive: v })}
              />
            </View>

            <View style={styles.option}>
              <View style={styles.description}>
                <MaterialCommunityIcons
                  name={"qrcode-scan"}
                  color={"white"}
                  style={styles.optionIcon}
                />
                <Text style={styles.optionText}>Kod QR</Text>
              </View>
              <Switch
                style={styles.switch}
                accessibilityTraits={"switch"}
                accessibilityComponentType={"switch"}
                value={this.state.isQRCodeEnabled}
                onValueChange={(v) => this.setState({ isQRCodeEnabled: v })}
                disabled={true /* DEV - coming soon*/}
              />
            </View>
            {this.state.isQRCodeEnabled && (
              <Text style={styles.additionalText}>
                id: {this.state.qrCodeId}
              </Text>
            )}

            <View style={styles.option}>
              <View style={styles.description}>
                <MaterialCommunityIcons
                  name={"alarm-snooze"}
                  color={"white"}
                  style={styles.optionIcon}
                />
                <Text style={styles.optionText}>Drzemka</Text>
              </View>
              <Switch
                style={styles.switch}
                accessibilityTraits={"switch"}
                accessibilityComponentType={"switch"}
                value={this.state.isSnoozeEnabled}
                onValueChange={(v) => this.setState({ isSnoozeEnabled: v })}
                disabled={true /* DEV - coming soon*/}
              />
            </View>
            {this.state.isSnoozeEnabled && (
              <Text style={styles.additionalText}>
                Minut: {this.state.snoozeLength}{" "}
                {/* TODO: It should be  x minut/minutę/minuty - in good form of Polish */}
              </Text>
            )}

            <TextInput
              style={styles.message}
              value={this.state.message}
              onChangeText={(e) => this.setState({ message: e })}
              label="Wiadomość (opcjonalnie)"
              mode={"outlined"}
              selectionColor={"#0394fc"}
              underlineColorAndroid={"#0394fc"}
              underlineColor={"#0394fc"}
              accessibilityTraits={"input"}
              accessibilityComponentType={"input"}
            />

            <Button
              mode="contained"
              icon="content-save"
              style={styles.submit}
              accessibilityTraits={"button"}
              accessibilityComponentType={"button"}
              loading={this.state.isSaving}
              color="#3f50b5"
              labelStyle={{ color: "white" }}
              onPress={this.saveData.bind(this)}
            >
              Zapisz
            </Button>
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default withTheme(SetAlarm);
