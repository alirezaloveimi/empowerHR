import { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  errors?: string[];
};

export default function Textarea({
  label,
  id,
  errors,
  ...rest
}: TextareaProps) {
  return (
    <div className="space-y-2.5">
      {label && <label htmlFor={id}>{label}</label>}

      <textarea
        id={id}
        className="w-full p-2 bg-secondary rounded-lg"
        {...rest}
      />

      {errors && <p className="text-sm font-bold text-red-600">{errors[0]}</p>}
    </div>
  );
}
