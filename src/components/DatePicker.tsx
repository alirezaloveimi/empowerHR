"use client";
import Picker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

type DatePickerProps = {
  value: number | undefined;
  onChange: (newValue: number | undefined) => void;
};

export default function DatePicker({ onChange, value }: DatePickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Picker
      value={value}
      onChange={(newValue) => {
        console.log(newValue?.toString());
        onChange(newValue?.valueOf());
      }}
      calendar={persian}
      locale={persian_fa}
      minDate={today}
      calendarPosition="bottom-right"
      inputClass="w-full p-2 bg-secondary rounded-lg"
      containerStyle={{ width: "100%" }}
    />
  );
}
