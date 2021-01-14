import { StyleSheet, TouchableWithoutFeedbackBase } from "react-native";

const optionTextSize = 40;

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    marginTop: 100,
  },
  scroll: {},
  alarmView: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    width: 300,
    height: 300,
    borderRadius: 150,
    borderColor: "white",
    borderWidth: 5,
  },
  alarmHour: {
    color: "white",
    fontSize: 80,
  },
  alarmTimeLeft: {
    color: "white",
    fontSize: 35,
  },
  settings: {
    display: "flex",
    flexDirection: "column",
    width: "95%",
  },
  option: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  description: {
    display: "flex",
    flexDirection: "row",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: {
    color: "white",
    fontSize: optionTextSize,
    marginLeft: 10,
  },
  optionIcon: {
    fontSize: optionTextSize,
  },
  switch: {
    transform: [{ scale: 2 }],
    marginRight: 20,
  },
  additionalText: {
    marginLeft: optionTextSize + 10,
    color: "white",
    fontSize: optionTextSize * 0.75,
  },
  message: {
    marginTop: 20,
    marginBottom: 20,
  },
  submit: {
    marginBottom: 20,
  },
  dialogText: {
    color: "white",
    fontSize: 15,
  },
});
