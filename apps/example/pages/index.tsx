import { DatePicker } from "@react-shamsi/datepicker";
import { useState } from "react";

const getTodayWithoutHours = () => {
  const today = new Date();
  today.setHours(0, 0, 0);
  return today;
};

const getNowWithoutHours = () => {
  const today = new Date();
  today.setHours(0, 0, 0);
  return today;
};

const NewHomework = () => {
  const [range, setRange] = useState<[Date, Date]>([
    new Date(),
    new Date("2024-08-15T20:30:00.000Z"),
  ]);

  return (
    <>
      {/* <Calendar
        ranged
        theme={"dark"}
        onChange={() => {}}
        showTimePicker
        showFooter
      /> */}
      <DatePicker
        className="w-full lg:w-auto p-2 rounded-xl border border-gray-300"
        placeholder="تاریخ شروع"
        date={range}
        onChange={(from, to) => {
          setRange([from!, to!]);
        }}
        dateFormat="dd LLLL"
        persianDigits
        dir="rtl"
        experimental_ranged
      />
    </>
  );
};

export default NewHomework;
