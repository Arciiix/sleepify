import React from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  TouchableOpacityBase,
} from "react-native";
import { Camera } from "expo-camera";
import Ionicons from "react-native-vector-icons/Ionicons";

import styles from "./QRCodeScanner.styles";
import { showMessage } from "react-native-flash-message";

interface QRCodeScannerState {
  isBackCamera: boolean;
  isTorch: boolean;
  cameraStarted: boolean;
  cameraKey: string;
}
interface QRCodeScannerProps {
  onScanned(data: any): any;
  mount: boolean;
}

class QRCodeScanner extends React.Component<
  QRCodeScannerProps,
  QRCodeScannerState
> {
  constructor(props: QRCodeScannerProps) {
    super(props);
    this.state = {
      isBackCamera: true,
      isTorch: false,
      cameraStarted: false,
      cameraKey: "",
    };
  }
  async componentDidMount(): Promise<void> {
    console.log("MOUNT");
    await new Promise((resolve) =>
      this.setState({ cameraStarted: false }, resolve)
    );
    await this.requestPermissions();
    this.forceUpdate();
    setTimeout(() => {
      this.setState({ cameraKey: Date.now().toString() });
    }, 1000);
  }

  componentDidUpdate() {
    console.log("UPDATE");
  }

  componentWillUnmount() {
    console.log("UNMOUNT");
  }

  async requestPermissions(): Promise<void> {
    let { granted } = await Camera.getPermissionsAsync();
    if (!granted) {
      const { status } = await Camera.requestPermissionsAsync();
      if (status !== "granted") {
        showMessage({
          message: "Brak uprawnień do kamery!",
          type: "danger",
          icon: "danger",
          autoHide: false,
        });
        await this.requestPermissions();
      } else {
        this.setState({ cameraStarted: true });
      }
    } else {
      this.setState({ cameraStarted: true });
    }
  }

  render() {
    console.log(this.state);
    if (this.props.mount) {
      if (!this.state.cameraStarted) return null;
      return (
        <View style={styles.container}>
          <Camera
            key={this.state.cameraKey}
            style={styles.camera}
            type={
              this.state.isBackCamera
                ? Camera.Constants.Type.back
                : Camera.Constants.Type.front
            }
            flashMode={
              this.state.isTorch
                ? Camera.Constants.FlashMode.torch
                : Camera.Constants.FlashMode.off
            }
            onBarCodeScanned={this.props.onScanned}
            ratio={"16:9"}
          >
            <View style={styles.cameraOverlay}>
              <Ionicons name="scan-outline" size={300} color={"white"} />
              <View style={styles.iconsView}>
                <Pressable
                  onPress={() =>
                    this.setState({ isTorch: !this.state.isTorch })
                  }
                >
                  <Ionicons
                    name={
                      this.state.isTorch ? `flash-outline` : "flash-off-outline"
                    }
                    size={100}
                    color={"white"}
                  />
                </Pressable>
                <Pressable
                  onPress={() =>
                    this.setState({ isBackCamera: !this.state.isBackCamera })
                  }
                >
                  <Ionicons
                    name="camera-reverse-outline"
                    size={100}
                    color={"white"}
                  />
                </Pressable>
              </View>
            </View>
          </Camera>
        </View>
      );
    } else {
      return null;
    }
  }
}

export default QRCodeScanner;
