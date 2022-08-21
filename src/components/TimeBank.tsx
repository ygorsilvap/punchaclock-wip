interface TimeBankProps {
  timeBank: string;
}

export default function TimeBank(props: TimeBankProps) {
  return <div className="mb-7">{props.timeBank}</div>;
}
