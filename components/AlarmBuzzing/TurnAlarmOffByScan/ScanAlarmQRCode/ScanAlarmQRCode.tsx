import React from "react";
import { View, Text } from "react-native";

import settings from "../../../Settings";
import QRCodeScanner from "../../../QRCodeScanner/QRCodeScanner";
import styles from "./ScanAlarmQRCode.style";

import { showMessage } from "react-native-flash-message";

class ScanAlarmQRCode extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  onScanned(data: any): void {
    let QRCodeInfo: any;

    try {
      QRCodeInfo = JSON.parse(data.data);
      if (!QRCodeInfo.i || !QRCodeInfo.h) {
        throw new Error("WRONG_QR");
      }
    } catch (err) {}

    if (QRCodeInfo) {
      if (QRCodeInfo.i && QRCodeInfo.h) {
        this.props.navigation.navigate("TurnOffByQRCode", {
          QRCodeData: QRCodeInfo,
        });
      } else {
        this.wrongQR();
      }
    } else {
      this.wrongQR();
    }
  }

  wrongQR(): void {
    showMessage({
      message: `To nie ten kod QR!`,
      type: "danger",
      icon: "danger",
      autoHide: true,
      floating: true,
    });
  }

  render() {
    const isFocused = this.props.navigation.isFocused();
    console.log(isFocused);
    if (!isFocused) {
      return null;
    } else if (isFocused) {
      return (
        <QRCodeScanner
          onScanned={this.onScanned.bind(this)}
          mount={this.props.navigation.isFocused()}
        />
      );
    }
  }
}

export default ScanAlarmQRCode;
