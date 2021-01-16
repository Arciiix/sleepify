import React from "react";
import { View, Text, Image } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import styles from "./QRCodeSetup.styles";
import settings from "../Settings";
import { Button } from "react-native-paper";

interface QRCodeSetupState {
  qrCodeId: string;
  qrCodeHash: string;
}

class QRCodeSetup extends React.Component<any, QRCodeSetupState> {
  constructor(props: any) {
    super(props);
    this.state = {
      qrCodeId: "",
      qrCodeHash: "",
    };
  }

  async componentDidMount(): Promise<void> {
    //DEV
    //Fetch data

    this.setState({ qrCodeId: "abc12345" });
  }
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={{
            uri: `${settings.ip}/getQRCode?size=${
              settings.imagesQuality * 100
            }`,
          }}
        />
        <Text style={styles.idText}>{this.state.qrCodeId}</Text>
        <View style={styles.buttonsView}>
          <Button
            mode={"contained"}
            color="#215dbf"
            style={styles.button}
            accessibilityComponentType={"button"}
            accessibilityTraits="button"
            icon={() => (
              <MaterialCommunityIcons name="pencil" color={"white"} size={25} />
            )}
          >
            Generuj nowy
          </Button>
          <Button
            mode={"contained"}
            color="#215dbf"
            style={styles.button}
            accessibilityComponentType={"button"}
            accessibilityTraits="button"
            icon={() => (
              <MaterialCommunityIcons
                name="location-enter"
                color={"white"}
                size={25}
              />
            )}
          >
            Zobacz
          </Button>
          <Button
            mode={"contained"}
            color="#215dbf"
            style={styles.button}
            accessibilityComponentType={"button"}
            accessibilityTraits="button"
            icon={() => (
              <MaterialCommunityIcons name="check" color={"white"} size={25} />
            )}
          >
            Testuj
          </Button>
        </View>
        <Text style={styles.hash}>
          hash kodu: {this.state.qrCodeHash} ({this.state.qrCodeHash.length})
        </Text>
      </View>
    );
  }
}

export default QRCodeSetup;
