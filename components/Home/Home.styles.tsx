import { StyleSheet } from "react-native";

export default StyleSheet.create({
  loadingView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 60,
    textAlign: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
  },
  time: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  timeText: {
    color: "#ffffff",
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
