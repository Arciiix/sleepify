import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 20,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  circle: {
    width: 240,
    height: 240,
    borderRadius: 240 / 2,
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
    fontSize: 60,
  },
  dateText: {
    color: "white",
    fontSize: 25,
  },
  QRCodeInfo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  hashInput: {
    marginTop: 10,
    width: "80%",
  },
  QRCodeIDText: {
    marginTop: 10,
    color: "#ffffff",

    fontSize: 20,
  },
  turningOffButtons: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 10,
  },
  turningOffButtonElement: {
    width: "80%",
    marginTop: 10,
  },
});
