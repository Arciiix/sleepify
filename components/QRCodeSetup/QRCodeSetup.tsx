import React from "react";
import { View, Text, Image } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Slider from "@react-native-community/slider";

import styles from "./QRCodeSetup.styles";
import settings from "../Settings";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";

interface QRCodeSetupState {
  qrCodeId: string;
  qrCodeHash: string;
  isCreatingNewQRCodeDialogActive: boolean;
  qrCodeTempId: string;
  qrCodeTempHashLength: number;
  qrCodeTempIdError: boolean;
}

class QRCodeSetup extends React.Component<any, QRCodeSetupState> {
  constructor(props: any) {
    super(props);
    this.state = {
      qrCodeId: "",
      qrCodeHash: "",
      isCreatingNewQRCodeDialogActive: false,
      qrCodeTempId: "",
      qrCodeTempHashLength: 5,
      qrCodeTempIdError: false,
    };
  }

  async componentDidMount(): Promise<void> {
    //DEV
    //Fetch data

    this.setState({ qrCodeId: "abc12345" });
  }

  createQRCode() {
    if (!this.state.qrCodeTempId) {
      return this.setState({ qrCodeTempIdError: true });
    }
    //DEV
    //Create code by sending data to server
    console.log(this.state.qrCodeTempId, this.state.qrCodeTempHashLength);

    this.setState({ isCreatingNewQRCodeDialogActive: false });
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
        <Portal>
          <Dialog visible={this.state.isCreatingNewQRCodeDialogActive}>
            <Dialog.Title
              accessibilityComponentType="confirmation"
              accessibilityTraits="confirmation"
            >
              Tworzenie QR
            </Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="ID (max 10 znaków)"
                value={this.state.qrCodeTempId}
                onChangeText={(e) =>
                  this.setState({ qrCodeTempId: e.replace(" ", "") })
                }
                accessibilityTraits={"input"}
                accessibilityComponentType={"input"}
                maxLength={10}
                error={this.state.qrCodeTempIdError}
              />
              <View>
                <Text style={styles.sliderLabel}>
                  Długość hashu ({this.state.qrCodeTempHashLength})
                </Text>
                <Slider
                  minimumValue={1}
                  maximumValue={20}
                  step={1}
                  value={5}
                  onValueChange={(val) =>
                    this.setState({ qrCodeTempHashLength: val })
                  }
                />
              </View>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                accessibilityComponentType="cancel"
                accessibilityTraits="cancel"
                onPress={() =>
                  this.setState({ isCreatingNewQRCodeDialogActive: false })
                }
              >
                Anuluj
              </Button>
              <Button
                accessibilityComponentType="submit"
                accessibilityTraits="submit"
                onPress={this.createQRCode.bind(this)}
              >
                Utwórz
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
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
            onPress={() =>
              this.setState({ isCreatingNewQRCodeDialogActive: true })
            }
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
