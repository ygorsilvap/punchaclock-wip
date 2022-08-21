import { useEffect, useState } from "react";
import { timeNow, dateNow } from "../core/Time";

export function Clock() {
  const [time, setTime] = useState(`0`);

  useEffect(() => {
    setTime(`${dateNow()} - ${timeNow()}`);
    setInterval(() => {
      setTime(`${dateNow()} - ${timeNow()}`);
    }, 100);
  }, []);

  return <div>{time}</div>;
}

export default Clock;
