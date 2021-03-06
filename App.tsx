import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Provider as PaperProvider, DarkTheme } from "react-native-paper";
import merge from "deepmerge";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FlashMessage from "react-native-flash-message";

import Home from "./components/Home/Home";
import SetAlarm from "./components/SetAlarm/SetAlarm";
import QRCodeSetup from "./components/QRCodeSetup/QRCodeSetup";
import AlarmBuzzing from "./components/AlarmBuzzing/AlarmBuzzing";

const Tab = createMaterialBottomTabNavigator();

export default class App extends React.Component<any, any> {
  darkTheme: any;

  constructor(props: any) {
    super(props);
    this.darkTheme = merge(NavigationDarkTheme, DarkTheme);
  }
  render() {
    return (
      <PaperProvider theme={this.darkTheme}>
        <StatusBar style={"light"} />
        <FlashMessage position="top" />
        <NavigationContainer theme={this.darkTheme}>
          <Tab.Navigator initialRouteName={"Home"}>
            <Tab.Screen
              name="Home"
              component={Home}
              options={{
                tabBarLabel: "Główna",
                tabBarIcon: () => (
                  <MaterialIcons name="home-filled" color={"white"} size={26} />
                ),
              }}
            />
            <Tab.Screen
              name="Alarm"
              component={SetAlarm}
              options={{
                tabBarLabel: "Budzik",
                tabBarIcon: () => (
                  <MaterialIcons name="add-alarm" color={"white"} size={26} />
                ),
              }}
            />
            <Tab.Screen
              name="QRCodeSetup"
              component={QRCodeSetup}
              options={{
                tabBarLabel: "Kod QR",
                tabBarIcon: () => (
                  <MaterialIcons
                    name="qr-code-scanner"
                    color={"white"}
                    size={26}
                  />
                ),
              }}
            ></Tab.Screen>
            <Tab.Screen
              name="Alarm Buzzing"
              component={AlarmBuzzing}
              options={{
                tabBarLabel: "TEMP",
                tabBarIcon: () => (
                  <MaterialIcons name="timelapse" color={"white"} size={26} />
                ),
              }}
            ></Tab.Screen>
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    );
  }
}
