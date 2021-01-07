import { StyleSheet } from "react-native";

const textColor = "white";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    color: textColor,
  },
  time: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  timeText: {
    color: textColor,
    fontSize: 80,
  },
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
    fontSize: 90,
  },
  alarmIcons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  alarmIcon: {
    margin: 5,
  },
  alarmTimeLeft: {
    color: "white",
    fontSize: 30,
  },
  switch: {
    marginTop: 40,
    transform: [{ scale: 3.5 }],
  },

  temperature: {
    marginTop: 20,
    fontSize: 80,
    textAlign: "center",
  },
});
