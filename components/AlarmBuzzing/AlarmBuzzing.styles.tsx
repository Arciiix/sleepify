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
    justifyContent: "space-around",
    color: "white",
  },
  weatherInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  weatherDetails: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  weatherText: {
    color: "white",
    fontSize: 20,
  },
  circle: {
    width: 280,
    height: 280,
    borderRadius: 280 / 2,
    borderColor: "white",
    borderWidth: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  circleInsideView: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  timeText: {
    color: "white",
    fontSize: 80,
  },
  dateText: {
    color: "white",
    fontSize: 30,
  },
  messageView: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
  buttonsView: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  wideButton: {
    width: "80%",
    marginTop: 10,
  },
});
