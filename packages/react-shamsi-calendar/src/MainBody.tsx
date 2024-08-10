import classNames from "classnames";
import {
  getDate,
  isAfter,
  isBefore,
  isFriday,
  isSameDay,
  isSameMonth,
  isSaturday,
  isToday,
} from "date-fns-jalali";
import { convertDigits } from "persian-helpers";
import { useMemo, useState } from "react";
import { RangedDate, TThemeClasses } from ".";
import { getDates } from "./utils/getDates";
import { useDebounce } from "./utils/useDebounce";

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
  range?: RangedDate;
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

const isDateInRange = (from: Date, to: Date, day: Date) => {
  if (day <= to && day >= from) {
    return true;
  }
  return false;
};

const hexToRgb = (hex: string) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

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
  range,
}: IMainBodyProps) => {
  const selectedDateDays = useMemo(
    () => getDates(selectedDate),
    [selectedDate]
  );

  const shouldShowRangedBackgrounds = useMemo(
    () => !!range?.from,
    [range?.from]
  );

  const [hoveredDay, setHoveredDay] = useState<Date>();

  const debouncedHoveredDay = useDebounce(hoveredDay, 50);

  const hoverEnd = useMemo(
    () => range?.to || debouncedHoveredDay,
    [debouncedHoveredDay, range]
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

          const isInRange = range?.from
            ? isDateInRange(range.from, hoverEnd || 0, day) &&
              !isSameDay(day, range.from)
            : false;

          const isDayActive =
            isSameDay(day, activeDate) ||
            isSameDay(day, range?.from || 0) ||
            isSameDay(day, range?.to || 0);

          const textColor = () => {
            if (showFridaysAsRed && isFriday(day))
              return isDayActive
                ? themeClasses.offDaysSelectedColor
                : themeClasses.offDaysColor;
            if (isDayActive) return themeClasses.daysSelectedColor;
            return themeClasses.daysColor;
          };

          const backgroundColor = (hovered = false) => {
            const { r, g, b } = hexToRgb(
              themeClasses.daysSelectedBackgroundColor
            );
            if (
              (shouldShowRangedBackgrounds && isInRange && !isDayActive) ||
              hovered
            )
              return `rgba(${r}, ${g}, ${b}, ${range?.to ? "0.25" : "0.12"})`;
            return isDayActive
              ? themeClasses.daysSelectedBackgroundColor
              : themeClasses.daysBackgroundColor;
          };

          const rounded = () => {
            if (
              !range?.to &&
              (!hoverEnd ||
                isSameDay(activeDate, hoverEnd) ||
                activeDate > hoverEnd)
            )
              return "rounded-full";
            if (isDayActive) {
              if (isSameDay(day, range?.from || 0)) return "rounded-full";
              if (isSameDay(day, range?.to || 0)) return "rounded-full";
            }
            if (isInRange && shouldShowRangedBackgrounds) {
              if (isFriday(day) || isSameDay(day, hoverEnd))
                return "rounded-l-full";
              if (isSaturday(day)) return "rounded-r-full";
              return "rounded-none";
            }
          };
          const { r, g, b } = hexToRgb(themeClasses.hoverBackgroundColor);
          const hoverColor = {
            "--hover-color": `rgba(${r}, ${g}, ${b}, 0.1)`,
          } as React.CSSProperties;

          return (
            <div
              className={classNames(
                "flex items-center justify-center w-9 h-9 relative p-0 m-0",
                rounded()
              )}
              style={{
                backgroundColor: shouldShowRangedBackgrounds
                  ? backgroundColor()
                  : undefined,
              }}
            >
              {isInRange && shouldShowRangedBackgrounds && !isSaturday(day) && (
                <div
                  className="w-3 absolute translate-x-6 h-full pointer-events-none"
                  style={{
                    backgroundColor: shouldShowRangedBackgrounds
                      ? backgroundColor(true)
                      : undefined,
                  }}
                ></div>
              )}
              {isSameDay(day, range?.from || 0) && hoverEnd > day && (
                <div
                  className="absolute w-full -z-10 h-full pointer-events-none rounded-r-full"
                  style={{
                    backgroundColor: shouldShowRangedBackgrounds
                      ? backgroundColor(true)
                      : undefined,
                  }}
                ></div>
              )}
              {isSameDay(day, range?.to || 0) && !isSaturday(day) && (
                <div
                  className="absolute w-full -z-10 h-full pointer-events-none rounded-l-full"
                  style={{
                    backgroundColor: shouldShowRangedBackgrounds
                      ? backgroundColor(true)
                      : undefined,
                  }}
                ></div>
              )}
              <button
                disabled={isDateInvalid}
                onClick={onActiveDayChange.bind(this, day)}
                key={day.toString()}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(undefined)}
                style={{
                  color: textColor(),
                  backgroundColor:
                    isInRange && shouldShowRangedBackgrounds
                      ? undefined
                      : backgroundColor(),
                  borderColor:
                    isToday(day) && highlightToday
                      ? themeClasses.todayBorderColor
                      : "transparent",
                  ...hoverColor,
                }}
                className={classNames(
                  "text-sm text-center border w-9 h-9 m-0 rounded-full hover:!bg-[color:var(--hover-color)]",
                  (!isSameMonth(day, selectedDate) || isDateInvalid) &&
                    "opacity-50"
                )}
              >
                {convertDigits(getDate(day))}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MainBody;
