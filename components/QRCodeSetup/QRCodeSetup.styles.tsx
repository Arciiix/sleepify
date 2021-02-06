import { StyleSheet } from "react-native";

const optionTextSize = 40;

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  image: {
    width: 200,
    height: 200,
  },
  idText: {
    color: "#ffffff",
    fontSize: 70,
  },
  buttonsView: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "90%",
    marginTop: 20,
  },
  hash: {
    color: "white",
    position: "absolute",
    bottom: 0,
    fontSize: 20,
    textAlign: "center",
  },
  sliderLabel: {
    marginTop: 20,
    color: "#ffffff",
    fontSize: 20,
    textAlign: "center",
  },
  scannedDialogContent: {
    display: "flex",
    color: "white",
    flexDirection: "column",
  },
  scannedDialogHeader: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  scannedDialogText: {
    color: "white",
    fontSize: 15,
  },
  dialogLoadingText: {
    color: "white",
    fontSize: 26,
    lineHeight: 26,
    marginTop: 20,
  },
});
