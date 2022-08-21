import axios from "axios";
import { useEffect, useState } from "react";
import { timeNow, dateNow, timeToSeconds } from "../core/Time";
import WorkTime from "../core/WorkTime";
import Button from "./Button";
import TimeBank from "./TimeBank";

export default function Content() {
  const [post, setPost] = useState(null);
  const [id, setId] = useState(null);
  const [time, setTime] = useState(null);
  const [date, setDate] = useState(null);
  const [phase, setPhase] = useState(1);
  const url = "http://localhost:3001/times";

  useEffect(() => {
    getTimes();
  }, []);

  const getTimes = () => {
    axios.get(url).then((resp) => {
      setPost(resp.data);
    });
  };

  // function checkTime

  function checkIn(date: string, inTime: string) {
    axios
      .post(url, {
        date: date,
        inTime: inTime,
      })
      .then((resp) => {
        setPost(resp.data);
        setId(resp.data.id);
        setTime(resp.data.inTime);
        setDate(resp.data.date);
      })
      .catch((e) => e.message);
    setPhase(2);
  }

  function checkOut(
    url: string,
    id: any,
    date: any,
    inTime: any,
    outTime: string
  ) {
    axios
      .put(`${url}/${id}`, {
        date: date,
        inTime: inTime,
        outTime: outTime,
      })
      .then((resp) => {
        setPost(resp.data);
        if (time) {
          let outTime = timeToSeconds(resp.data.outTime);
          let inTime = timeToSeconds(resp.data.inTime);

          console.log(inTime + " - " + outTime);

          //timebank
          // let totalTime = Math.abs(inSeconds - outSeconds) - 32400;

          // let h = Math.floor(totalTime / 3600);
          // let m = Math.floor((totalTime - h * 3600) / 60 - 60);
          // let s = Math.floor(
          //   totalTime - h * 3600 - (totalTime - h * 3600) / 60 - 60
          // );

          //worked time
          let totalTime = Math.abs(outTime - inTime);
          console.log(totalTime);

          let h = Math.floor(totalTime / 3600);
          let m = Math.floor((totalTime - h * 3600) / 60);
          let s = Math.floor(
            totalTime - h * 3600 - (totalTime - h * 3600) / 60
          );

          let tt = `${h.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;

          console.log(tt);
        }
      })
      .catch((e) => e.message);
    setPhase(1);
  }

  function marcar() {
    const registro = new WorkTime(
      `${dateNow()}`,
      `${timeNow()}`,
      `${timeNow()}`
    );

    if (phase === 1) {
      if (registro.date === date) {
        return;
      } else {
        checkIn(registro.date, registro.inTime);
      }
    } else {
      checkOut(url, id, date, time, registro.outTime);
    }
  }

  return (
    <div
      className={`
    flex justify-center items-center py-12
    `}
    >
      <div
        className="
        flex flex-wrap justify-center items-center
        w-80 h-36 py-10 px-8
      rounded-lg shadow-md
      bg-gray-100
      "
      >
        <TimeBank />
        <div>
          <Button onClick={marcar} funcao="Marcar" className="bg-blue-400" />
          <Button funcao="Histórico" className="bg-green-400" />
        </div>
      </div>
    </div>
  );
}
