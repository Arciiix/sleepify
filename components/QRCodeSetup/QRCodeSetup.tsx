import React from "react";
import { View, Text, Image } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Slider from "@react-native-community/slider";

import styles from "./QRCodeSetup.styles";
import settings from "../Settings";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";
import { showMessage } from "react-native-flash-message";

interface QRCodeSetupState {
  qrCodeId: string;
  qrCodeHash: string;
  isCreatingNewQRCodeDialogActive: boolean;
  qrCodeTempId: string;
  qrCodeTempHashLength: number;
  qrCodeTempIdError: boolean;
  imgUniqueKey: number;
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
      imgUniqueKey: Date.now(),
    };
  }

  async componentDidMount(): Promise<void> {
    await this.getData();
  }

  async getData(): Promise<void> {
    let request = await fetch(`${settings.ip}/getLocalData`);
    if (request.status !== 200) {
      showMessage({
        message: `Błąd przy pobieraniu danych! Status code: ${request.status}`,
        type: "danger",
        icon: "danger",
        floating: true,
        autoHide: false,
      });
    }

    let response = await request.json();

    this.setState({
      qrCodeId: response.qrCodeId,
      qrCodeHash: response.qrCodeHash,
      imgUniqueKey: Date.now(),
    });
  }

  async createQRCode(): Promise<void> {
    if (!this.state.qrCodeTempId) {
      return this.setState({ qrCodeTempIdError: true });
    }

    let request = await fetch(`${settings.ip}/createQRCode`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: this.state.qrCodeTempId,
        hashLength: this.state.qrCodeTempHashLength,
      }),
    });

    if (request.status !== 200) {
      showMessage({
        message: `Nie utworzono nowego kodu QR! Status code: ${request.status}`,
        type: "danger",
        icon: "danger",
        floating: true,
        autoHide: false,
      });
    } else {
      let response = await request.json();
      if (response.err) {
        showMessage({
          message: `Nie utworzono nowego kodu QR! Błąd: ${response.message}`,
          type: "danger",
          icon: "danger",
          floating: true,
          autoHide: false,
        });
      } else {
        await this.getData();
        showMessage({
          message: `Utworzono nowy kod!`,
          type: "success",
          icon: "success",
          floating: true,
        });
      }
    }

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
            }&key=${this.state.imgUniqueKey}`,
          }}
        />
        <Text style={styles.idText}>{this.state.qrCodeId}</Text>
        <Portal>
          <Dialog
            visible={this.state.isCreatingNewQRCodeDialogActive}
            onDismiss={() =>
              this.setState({ isCreatingNewQRCodeDialogActive: false })
            }
          >
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
                  maximumValue={10}
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
            disabled //DEV - Coming soon
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
            disabled //DEV - Coming soon
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
