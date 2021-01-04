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
  },
  timeText: {
    color: textColor,
    fontSize: 100,
  },
});
