import { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  errors?: string[];
};

export default function InputField({
  label,
  errors,
  id,
  ...rest
}: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      {label && <label htmlFor={id}>{label}</label>}
      <input id={id} {...rest} className="w-full p-2 bg-secondary rounded-lg" />
      {errors && <p className="text-sm font-bold text-red-600">{errors[0]}</p>}
    </div>
  );
}
