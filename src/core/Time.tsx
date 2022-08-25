function timeNow() {
  let date = new Date();
  let time = `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;

  return `${time}`;
}

function dateNow() {
  let date = new Date();
  let today = `${date.getDate().toString().padStart(2, "0")}/${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;
  return `${today}`;
}

function timeToSeconds(time: string) {
  let t = Array.from(time);
  let tSeconds =
    parseInt(t.slice(0, 2).join("")) * 3600 +
    parseInt(t.slice(3, 5).join("")) * 60 +
    parseInt(t.slice(6, 8).join(""));
  return tSeconds;
}

function stringToTime(timeString: string) {
  let time = timeString[0] === "-" ? timeString.slice(1) : timeString;
  let [h, m, s] = [time[0] + time[1], time[3] + time[4], time[6] + time[7]];
  return -Math.abs(parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s));
}

function formatTime(time: number) {
  let h = Math.floor(Math.abs(time) / 3600);
  let m = Math.floor((Math.abs(time) - h * 3600) / 60);
  let s = Math.floor(Math.abs(time) - (h * 3600 + m * 60));

  return time < 0
    ? `-${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
        .toString()
        .padStart(2, "0")}`
    : `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
        .toString()
        .padStart(2, "0")}`;
}

export { timeNow, dateNow, timeToSeconds, formatTime, stringToTime };
