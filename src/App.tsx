import React from "react";
import Clock from "react-clock";
import { useGeolocated } from "react-geolocated";
import SunCalc from "suncalc";

import "the-new-css-reset/css/reset.css";
import "react-clock/dist/Clock.css";

import "./App.scss";

function App() {
  const [value, setValue] = React.useState<Date>(new Date());
  const staticValue = React.useMemo<Date>(() => new Date(), []);

  const { coords, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 60000,
  });

  const today = new Date();
  const timesToday =
    isGeolocationEnabled && coords
      ? SunCalc.getTimes(today, coords.latitude, coords.longitude)
      : undefined;

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const timesTomorrow =
    isGeolocationEnabled && coords
      ? SunCalc.getTimes(tomorrow, coords.latitude, coords.longitude)
      : undefined;

  const isDarkTheme =
    timesToday && timesTomorrow
      ? value.getTime() > timesToday.sunset.getTime() &&
        value.getTime() < timesTomorrow.sunrise.getTime()
      : false;

  React.useEffect(() => {
    const interval = setInterval(() => setValue(new Date()), 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <main className={`main ${isDarkTheme ? "dark" : "light"}`}>
      <div className="left">
        <div className="date">
          <div className="text day-text">
            {value.toLocaleString(window.navigator.language, {
              weekday: "long",
            })}
          </div>
          <div className="text date-text">
            {value.toLocaleString(window.navigator.language, {
              day: "numeric",
            })}

            <br />
            {value.toLocaleString(window.navigator.language, {
              month: "long",
            })}
          </div>
        </div>
      </div>

      <div className="right">
        <div className="text time-text">
          {value.toLocaleString(window.navigator.language, {
            minute: "numeric",
            hour: "numeric",
          })}
        </div>

        <Clock
          value={value}
          size={560}
          className="clock"
          hourHandWidth={8}
          hourHandLength={60}
          hourHandOppositeLength={0}
          hourMarksWidth={6}
          hourMarksLength={8}
          minuteHandWidth={8}
          minuteMarksWidth={4}
          minuteMarksLength={6}
          minuteHandLength={60}
          minuteHandOppositeLength={0}
          secondHandWidth={6}
          secondHandLength={100}
          secondHandOppositeLength={16}
        />

        <Clock
          value={staticValue}
          size={536}
          className="clock-hours"
          hourHandWidth={0}
          hourMarksWidth={0}
          renderHourMarks
          renderMinuteHand={false}
          renderMinuteMarks={false}
          renderSecondHand={false}
          renderNumbers
        />

        <div className="dot"></div>
      </div>
    </main>
  );
}

export default App;
