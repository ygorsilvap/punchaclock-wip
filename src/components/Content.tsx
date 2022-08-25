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
  const [post, setPost] = useState(null);
  const [id, setId] = useState(null);
  const [time, setTime] = useState(null);
  const [date, setDate] = useState(null);
  const [timeBank, setTimeBank] = useState("00:00:00");
  const [phase, setPhase] = useState("1");

  const url = "http://localhost:3001/times";

  useEffect(() => {
    const data = localStorage.getItem("phase");
    if (data) {
      console.log("get " + data);
      setPhase(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    getTimes();
    getTimeBank();
    console.log("set " + localStorage.getItem("phase"));
    //CONTINUAR TENTANDO O LOCALSTORAGE
    // const ISSERVER = typeof window === "undefined";
    // if (!ISSERVER) localStorage.setItem("phase", JSON.stringify(phase));
  }, [phase]);

  const getTimes = () => {
    axios.get(url).then((resp) => {
      setPost(resp.data);
    });
  };

  const getTimeBank = () => {
    axios.get(url).then((resp) => {
      if (resp.data[resp.data.length - 1].timeBank) {
        setTimeBank(resp.data[resp.data.length - 1].timeBank);
      }
    });
  };

  function todayTimeBank(inTime: number, outTime: number) {
    let totalTime = stringToTime(timeBank) + (outTime - inTime);
    return formatTime((totalTime -= 32400));
  }

  async function checkIn(date: string, inTime: string) {
    await axios
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
    setPhase("2");
  }

  async function checkOut(
    url: string,
    id: any,
    date: any,
    inTime: any,
    outTime: string
  ) {
    let [outTimeS, inTimeS] = [timeToSeconds(outTime), timeToSeconds(inTime)];

    await axios
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
    setPhase("1");
  }

  function marcar() {
    const registro = new WorkTime(
      `${dateNow()}`,
      `${timeNow()}`,
      `${timeNow()}`,
      `${""}`
    );

    if (phase === "1") {
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
