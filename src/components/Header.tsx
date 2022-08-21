import Clock from "./Clock";

export default function Header() {
  return (
    <div
      className={`
      flex justify-center 
      bg-snow px-5 py-1
      text-gray-800 text-lg
      shadow-md`}
    >
      <Clock />
    </div>
  );
}
