import axios from "axios";
import { parse } from "path";
import { useEffect, useState } from "react";
import {
  timeNow,
  dateNow,
  timeToSeconds,
  formatTime,
  stringToTime,
} from "../core/Time";
import WorkTime from "../core/WorkTime";
import Button from "./Button";
import TimeBank from "./TimeBank";

export default function Content() {
  const url = "http://localhost:3001/times";
  const [post, setPost] = useState(null);
  const [id, setId] = useState(null);
  const [time, setTime] = useState(null);
  const [date, setDate] = useState(null);
  const [timeBank, setTimeBank] = useState("00:00:00");
  const [phase, setPhase] = useState(1);

  useEffect(() => {
    // console.log(JSON.parse(localStorage.getItem("phase")!));
    console.log("phase antes do ls ->" + phase);
    console.log("phase salvo no ls-> " + localStorage.getItem("phase"));
    if (typeof window !== "undefined" && phase === 2) {
      localStorage.setItem("phase", JSON.stringify(phase));
      console.log("phase salvo -> " + localStorage.getItem("phase"));
      setPhase(JSON.parse(localStorage.getItem("phase")!));
    }
    console.log("phase depois do ls-> " + localStorage.getItem("phase"));
  }, []);

  useEffect(() => {
    getTimes();
    getTimeBank();
  }, [phase]);

  const getTimes = () => {
    axios.get(url).then((resp) => {
      setPost(resp.data);
    });
  };

  const getTimeBank = () => {
    axios.get(url).then((resp) => {
      if (resp.data.length > 0 && resp.data[resp.data.length - 1].timeBank) {
        setTimeBank(resp.data[resp.data.length - 1].timeBank);
      }
    });
  };

  function todayTimeBank(inTime: number, outTime: number) {
    let totalTime = stringToTime(timeBank) + (outTime - inTime);
    return formatTime((totalTime -= 32400));
  }

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
    let [outTimeS, inTimeS] = [timeToSeconds(outTime), timeToSeconds(inTime)];

    axios
      .put(`${url}/${id}`, {
        date: date,
        inTime: inTime,
        outTime: outTime,
        timeBank: todayTimeBank(inTimeS, outTimeS),
      })
      .then((resp) => {
        setPost(resp.data);
        setTimeBank(todayTimeBank(inTimeS, outTimeS));
      })
      .catch((e) => e.message);
    setPhase(1);
  }

  function marcar() {
    console.log("phase -> " + phase);

    const registro = new WorkTime(
      `${dateNow()}`,
      `${timeNow()}`,
      `${timeNow()}`,
      `${""}`
    );

    if (phase === 1) {
      if (registro.date === date) {
        return;
      } else {
        checkIn(registro.date, registro.inTime);
        localStorage.setItem("id", JSON.stringify(id));
        localStorage.setItem("date", JSON.stringify(date));
        localStorage.setItem("time", JSON.stringify(time));
        // console.log(localStorage.getItem("id"));
        // console.log(localStorage.getItem("date"));
        // console.log(localStorage.getItem("time"));
      }
    } else if (phase === 2) {
      // console.log(localStorage.getItem("id"));
      // console.log(localStorage.getItem("date"));
      // console.log(localStorage.getItem("time"));
      setId(JSON.parse(localStorage.getItem("id")!));
      setTime(JSON.parse(localStorage.getItem("time")!));
      setDate(JSON.parse(localStorage.getItem("date")!));
      checkOut(url, id, date, time, registro.outTime);
    } else {
      console.log("phase errado ou nulo");
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
        <TimeBank
          timeBank={timeBank}
          cor={stringToTime(timeBank) > 0 ? "red" : "green"}
        />
        <div>
          <Button onClick={marcar} funcao="Marcar" className="bg-blue-400" />
          <Button funcao="Histórico" className="bg-green-400" />
        </div>
      </div>
    </div>
  );
}
