import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";

const PORT: number | string = process.env.PORT || 6456;

const app: express.Application = express();
app.use(bodyParser.json());

class AlarmData {
  //Define default values here
  time: string = "0:00";
  alarm: string = "0:00";
  currentTime: { hour: number; minute: number } = { hour: 0, minute: 0 };
  alarmTime: { hour: number; minute: number } = { hour: 0, minute: 0 };
  isAlarmActive: boolean = false;
  isAlarmBuzzing: boolean = false;
  isQRCodeEnabled: boolean = false;
  qrCodeId: string = "";
  isSnoozeEnabled: boolean = false;
  snoozeLength: number = 5;
  temperature: number = 0;
  temperatureRange: { min: number; max: number } = { min: 20, max: 24 };
  message: string = "";
}

class Alarm {
  data: AlarmData;
  alarmIP: string = "DEV";

  constructor() {
    this.data = new AlarmData();
    //DEV this.getData();
  }

  async getData(): Promise<{
    err: boolean;
    message?: string;
    data?: AlarmData;
  }> {
    /*
    let request = await fetch(`http://${this.alarmIP}/getInfo`);
    if (request.status !== 200) return { err: true, message: "FETCH_ERR" };

    //let response: string = await request.text();
    let response: string = await (await request.json()).text;

    let parsedResponse: Array<string> = response.split(" ");
    */

    //DEV
    let parsedResponse: Array<string> = "09:15 false 21.44 22:55 false 1.4".split(
      " "
    );

    this.data.alarm = parsedResponse[0];
    this.data.isAlarmActive = parsedResponse[1] === "true" ? true : false;
    this.data.temperature = parseFloat(parsedResponse[2]);
    this.data.time = parsedResponse[3];
    this.data.isAlarmBuzzing = parsedResponse[4] === "true" ? true : false;
    this.data.alarmTime = {
      hour: parseInt(this.data.alarm.split(":")[0]),
      minute: parseInt(this.data.alarm.split(":")[1]),
    };
    this.data.currentTime = {
      hour: parseInt(this.data.time.split(":")[0]),
      minute: parseInt(this.data.time.split(":")[1]),
    };

    return { err: false, data: this.data };
  }

  async setAlarm(
    hour: number,
    minute: number
  ): Promise<{ err: boolean; message?: string }> {
    if ((!hour && hour !== 0) || (!minute && minute !== 0))
      return { err: true, message: "MISSING_DATA" };
    if (isNaN(hour) || isNaN(minute))
      return { err: true, message: "DATA_IS_NaN" };
    if (hour < 0 || hour > 23)
      return { err: true, message: `WRONG_HOUR_${hour}` };
    if (minute < 0 || minute > 59)
      return { err: true, message: `WRONG_MINUTE_${minute}` };

    let fixedHour: string = this.addZero(hour);
    let fixedMinute: string = this.addZero(minute);

    let request = await fetch(
      `http://${this.alarmIP}?hour=${fixedHour}&minute=${fixedMinute}`
    );
    if (request.status === 200) {
      this.data.alarm = `${fixedHour}:${fixedMinute}`;
      this.data.alarmTime = { hour: hour, minute: minute };
      return { err: false };
    } else {
      return { err: true, message: `WRONG_STATUS_${request.status}` };
    }
  }

  addZero(number: number): string {
    return number < 10 ? `0${number}` : `${number}`;
  }
}

function log(message: string, isError?: boolean): void {
  //TODO: Make parseDate function
  if (isError) {
    console.error(
      "\x1b[31m%s\x1b[0m",
      `[ERROR] [${new Date().toLocaleTimeString()}] ${message}`
    );
  } else {
    console.log(`[INFO] [${new Date().toLocaleTimeString()}] ${message}`);
  }
}

const Alarmdataect = new Alarm();

app.get("/getData", async (req, res) => {
  let data = await Alarmdataect.getData();
  res.send(data);
});

app.post("/setAlarm", async (req, res) => {
  const validData = [
    "hour",
    "minute",
    "isAlarmActive",
    "isQRCodeEnabled",
    "isSnoozeEnabled",
  ];

  let missing: Array<string> = []; //The missing data will be added to this array and then converted to an error string (e.g. when hour is missing, it will be MISSING_HOUR when hour and minute - MISSING_HOUR_MINUTE)

  validData.forEach((e) => {
    if (!Object.keys(req.body).includes(e)) {
      missing.push(e);
    }
  });

  if (missing.length > 0) {
    return res.send({
      err: true,
      message: `MISSING_${missing.map((e) => e.toUpperCase()).join("_")}`,
    });
  }

  //DEV
  //TODO: Variables such as QRCodeId, snoozeLength or message should be checked here - they are no compulsory
  //DEV
  //TODO: Handle other properties (such as isQRCodeEnabled)

  //Hour and minute have to be a string, because 0 == false, and we don't want it
  let isSuccess: {
    err: boolean;
    message?: string;
  } = await Alarmdataect.setAlarm(
    parseInt(req.body.hour),
    parseInt(req.body.minute)
  );

  res.send(isSuccess);
});

app.listen(PORT, () => {
  log(`App has started on port ${PORT}`);
});
