interface ButtonProps {
  cor?: string;
  funcao: string;
  onClick?: () => void;
  className?: string;
}

export default function Button(props: ButtonProps) {
  return (
    <button
      onClick={props.onClick}
      className={`bg-${props.cor}-400 rounded-md px-3 py-1 mx-4
    ${props.className}`}
    >
      {props.funcao}
    </button>
  );
}
