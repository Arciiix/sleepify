import settings from "./Settings";

enum turningTheAlarmOffError {
  wrongRequest,
  wrongQRCode,
  unknown,
}

async function turnTheAlarmOff(QRCodeData?: {
  h: string;
  i: string;
}): Promise<{
  error: boolean;
  message?: string;
  errorCode?: turningTheAlarmOffError;
}> {
  let request = await fetch(`${settings.ip}/turnTheAlarmOff`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(QRCodeData),
  });

  /*
  Possible request statuses:
  204 - success - the alarm has been turned off
  400 - wrong request - the app didn't send the QR code hash or id.
  401 - wrong QR code
  */

  switch (request.status) {
    case 204:
      //Success
      return { error: false };
      break;
    case 400:
      //Wrong request
      return {
        error: true,
        message: `Złe zapytanie - aplikacja nie wysłała hashu lub id kodu QR. Prawdopodobnie desynchronizacja, spróbuj ponownie.`,
        errorCode: turningTheAlarmOffError.wrongRequest,
      };
      break;
    case 401:
      //Wrong QR code
      return {
        error: true,
        message: `Zeskanowałeś zły kod QR.`,
        errorCode: turningTheAlarmOffError.wrongQRCode,
      };
      break;
    default:
      //Unhandled/unknown error
      return {
        error: true,
        message: `Nieznany błąd. Status code: ${
          request.status
        }; odpowiedź serwera: ${await request.text()}`,
        errorCode: turningTheAlarmOffError.wrongQRCode,
      };
      break;
  }
}

export { turnTheAlarmOff, turningTheAlarmOffError };
