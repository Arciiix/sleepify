import React from "react";
import { View, Text, Image } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Slider from "@react-native-community/slider";

import styles from "./QRCodeSetup.styles";
import settings from "../Settings";
import QRCodeScanner from "../QRCodeScanner/QRCodeScanner";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";
import { showMessage } from "react-native-flash-message";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

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
            onPress={() => this.props.navigation.navigate("QRCodeTest")}
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

class QRCodeTest extends React.Component<any, any> {
  onScanned(data: any) {
    console.log(data.data);
  }
  render() {
    const isFocused = this.props.navigation.isFocused();
    console.log(isFocused);
    if (!isFocused) {
      return null;
    } else if (isFocused) {
      return (
        <View style={{ flex: 1 }}>
          <QRCodeScanner
            onScanned={this.onScanned.bind(this)}
            mount={this.props.navigation.isFocused()}
          />
        </View>
      );
    }
  }
}

//DEV
//TODO: Fix the camera - it doesn't work, when we change the BOTTOM navigation tabs - add a event listener - when the BOTTOMTAB will change, unmount the camera component
class QRCodeSetupNavigation extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { mount: true };
  }

  componentDidMount() {
    this.props.navigation.addListener("blur", () => {
      this.setState({ mount: false });
    });
    this.props.navigation.addListener("focus", () => {
      this.setState({ mount: true });
    });
  }
  render() {
    if (this.state.mount) {
      return (
        <Stack.Navigator initialRouteName={"QRCodeSetup"}>
          <Stack.Screen
            name="QRCodeSetup"
            component={QRCodeSetup}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="QRCodeTest"
            component={QRCodeTest}
            options={{
              title: "Testuj kod QR",
            }}
          />
        </Stack.Navigator>
      );
    } else {
      return null;
    }
  }
}

export default QRCodeSetupNavigation;
