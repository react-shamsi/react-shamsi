import classNames from "classnames";
import {
  getDate,
  isAfter,
  isBefore,
  isFriday,
  isSameDay,
  isSameMonth,
  isToday,
} from "date-fns-jalali";
import { convertDigits } from "persian-helpers";
import { useMemo } from "react";
import { TThemeClasses } from ".";
import { getDates } from "./utils/getDates";

interface IMainBodyProps {
  minDate?: Date;
  maxDate?: Date;
  onActiveDayChange: (newDay: Date) => void;
  themeClasses: TThemeClasses;
  selectedDate: Date;
  activeDate: Date;
  disabledDates?: Date[];
  highlightToday?: boolean;
  showFridaysAsRed?: boolean;
}

const daysOfTheWeek = [
  "شنبه",
  "یک‌شنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهار‌شنبه",
  "پنج‌شنبه",
  "جمعه",
];

const MainBody = ({
  maxDate,
  minDate,
  onActiveDayChange,
  highlightToday,
  disabledDates,
  themeClasses,
  activeDate,
  selectedDate,
  showFridaysAsRed,
}: IMainBodyProps) => {
  const selectedDateDays = useMemo(
    () => getDates(selectedDate),
    [selectedDate]
  );

  return (
    <>
      <div className="grid grid-cols-7 gap-4">
        {["ش", "ی", "د", "س", "چ", "پ", "ج"].map((day, index) => (
          <h2
            key={day}
            style={{
              color: themeClasses.weekDaysTextColor,
              backgroundColor: themeClasses.weekDaysBackgroundColor,
            }}
            className={classNames(
              "m-0 text-sm rounded-full p-2 w-9 h-9 text-center border border-transparent"
            )}
            aria-label={daysOfTheWeek[index]}
            title={daysOfTheWeek[index]}
          >
            {day}
          </h2>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-4">
        {selectedDateDays.map((day, index) => {
          const isDateInvalid =
            (minDate && isBefore(day, minDate) && !isSameDay(day, minDate)) ||
            (maxDate && isAfter(day, maxDate) && !isSameDay(day, maxDate)) ||
            disabledDates?.includes(day);

          const textColor = () => {
            if (showFridaysAsRed && isFriday(day))
              return isSameDay(day, activeDate)
                ? themeClasses.offDaysSelectedColor
                : themeClasses.offDaysColor;
            if (isSameDay(day, activeDate))
              return themeClasses.daysSelectedColor;
            return themeClasses.daysColor;
          };

          const backgroundColor = () => {
            return isSameDay(day, activeDate)
              ? themeClasses.daysSelectedBackgroundColor
              : themeClasses.daysBackgroundColor;
          };

          return (
            <button
              disabled={isDateInvalid}
              onClick={onActiveDayChange.bind(this, day)}
              key={day.toString()}
              style={{
                color: textColor(),
                backgroundColor: backgroundColor(),
                borderColor:
                  isToday(day) && highlightToday
                    ? themeClasses.todayBorderColor
                    : "transparent",
              }}
              className={classNames(
                "text-sm w-9 h-9 rounded-full text-center border m-0",
                (!isSameMonth(day, selectedDate) || isDateInvalid) &&
                  "opacity-50"
              )}
            >
              {convertDigits(getDate(day))}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default MainBody;
