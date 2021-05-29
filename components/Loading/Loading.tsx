import React from "react";
import { View, Text } from "react-native";
import { ActivityIndicator } from "react-native-paper";

import styles from "./Loading.styles";

function Loading(): any {
  return (
    <View style={styles.loadingView}>
      <ActivityIndicator
        animating={true}
        size={100}
        color={"#ffffff"}
        accessibilityComponentType={"ActivityIndicator"}
        accessibilityTraits={"Loading"}
      />
      <Text style={styles.loadingText}>Ładowanie...</Text>
      <Text style={{ color: "white", fontSize: 30, textAlign: "center" }}>
        {" "}
        DEV - This screen isn't finished yet
        {/* DEV TODO */}
      </Text>
      <Text style={{ color: "white", fontSize: 30, textAlign: "center" }}>
        {" "}
        Loading...
        {/* DEV TODO */}
      </Text>
    </View>
  );
}

export default Loading;
