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
});
