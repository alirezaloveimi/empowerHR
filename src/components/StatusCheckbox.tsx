import { InputHTMLAttributes } from "react";

type StatusCheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  status: "REJECT" | "ACCEPT";
};

export default function StatusCheckbox({
  label,
  id,
  status,
  ...rest
}: StatusCheckboxProps) {
  const statusStyles = {
    REJECT: "bg-red-700 peer-checked:ring-red-500",
    ACCEPT: "bg-green-700 peer-checked:ring-green-500",
  };

  return (
    <div>
      <input {...rest} id={id} type="radio" className="hidden peer" />
      <label
        htmlFor={id}
        className={`grid-center px-6 py-3 rounded-lg cursor-pointer  text-white peer-checked:ring-2 ${statusStyles[status]}`}
      >
        {label}
      </label>
    </div>
  );
}
