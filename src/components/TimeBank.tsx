interface TimeBankProps {
  timeBank: string;
  cor: "green" | "red";
}

export default function TimeBank(props: TimeBankProps) {
  return <div className={`mb-7 text-${props.cor}-500`}>{props.timeBank}</div>;
}
