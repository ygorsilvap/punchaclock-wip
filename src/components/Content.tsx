import axios from "axios";
import { useEffect, useState } from "react";
import { timeNow, dateNow, timeToSeconds, formatTime } from "../core/Time";
import WorkTime from "../core/WorkTime";
import Button from "./Button";
import TimeBank from "./TimeBank";

export default function Content() {
  const [post, setPost] = useState(null);
  const [id, setId] = useState(null);
  const [time, setTime] = useState(null);
  const [date, setDate] = useState(null);
  const [timeBank, setTimeBank] = useState("00:00:00");
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

  function todayTimeBank(inTime: number, outTime: number) {
    let totalTime = outTime - inTime;
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
    setPhase(2);
  }

  async function checkOut(
    url: string,
    id: any,
    date: any,
    inTime: any,
    outTime: string
  ) {
    let [outTimeS, inTimeS] = [timeToSeconds(outTime), timeToSeconds(inTime)];
    setTimeBank(todayTimeBank(inTimeS, outTimeS));
    console.log(timeBank);

    await axios
      .put(`${url}/${id}`, {
        date: date,
        inTime: inTime,
        outTime: outTime,
        timeBank: timeBank,
      })
      .then((resp) => {
        setPost(resp.data);
        // if (outTime) {
        //   let [outTime, inTime] = [
        //     timeToSeconds(resp.data.outTime),
        //     timeToSeconds(resp.data.inTime),
        //   ];
        //   setTimeBank(todayTimeBank(inTime, outTime));
        //   console.log(timeBank);
        // }
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
        <TimeBank timeBank={timeBank} />
        <div>
          <Button onClick={marcar} funcao="Marcar" className="bg-blue-400" />
          <Button funcao="Histórico" className="bg-green-400" />
        </div>
      </div>
    </div>
  );
}
