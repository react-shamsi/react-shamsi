import {
  defaultTimePickerTheme,
  TimePicker,
  TTimePickerTheme,
} from "@react-shamsi/timepicker";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons";
import classNames from "classnames";
import {
  addMonths,
  format,
  getMonth,
  setMonth,
  setYear,
  subMonths,
} from "date-fns-jalali";
import { convertDigits } from "persian-helpers";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { SwitchTransition, Transition } from "react-transition-group";

import Footer from "./Footer";
import Header from "./Header";
import MainBody from "./MainBody";
import MonthsBody from "./MonthsBody";
import { cloneDate } from "./utils/cloneDate";
import YearsBody from "./YearsBody";
export type TThemeClasses = {
  headerBackgroundColor: string;
  headerTextColor: string;
  chevronRightColor: string;
  chevronLeftColor: string;
  topBarTextColor: string;
  bodyBackgroundColor: string;
  weekDaysTextColor: string;
  weekDaysBackgroundColor: string;
  daysColor: string;
  daysBackgroundColor: string;
  todayBorderColor: string;
  daysSelectedColor: string;
  daysSelectedBackgroundColor: string;
  offDaysColor: string;
  offDaysSelectedColor: string;
  footerBackgroundColor: string;
  footerButtonColor: string;
  clock: TTimePickerTheme;
};

export type CalendarModes = "date" | "time";

type TCalendarThemes = "dark" | "darkRed" | "light" | TThemeClasses;

export interface ICalendarProps {
  highlightToday?: boolean;
  onChange?: (newDate: Date) => void;
  activeDate?: Date;
  defaultActiveDate?: Date;
  theme?: TCalendarThemes;
  showGoToToday?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  showFooter?: boolean;
  disableTransitions?: boolean;
  bodyTransition?: "zoomIn" | "zoomOut" | "fade";
  showFridaysAsRed?: boolean;
  showTimePicker?: boolean;
  months?: string[];
  presistTimeOnDateChange?: boolean;
  style?: React.StyleHTMLAttributes<HTMLDivElement>;
  onConfirm?: (newDate: Date) => void;
  onCancel?: () => void;
}
const FadeTransition = ({ children, bodyTransition, ...rest }: any) => (
  <Transition {...rest}>
    {(state) => {
      let transitionClass: { in: string; out: string };
      switch (bodyTransition as ICalendarProps["bodyTransition"]) {
        case "fade":
          transitionClass = { in: "opacity-100", out: "opacity-0" };
          break;
        case "zoomOut":
          transitionClass = {
            in: "opacity-100 scale-100",
            out: "opacity-0 scale-50",
          };
          break;
        default:
        case "zoomIn":
          transitionClass = {
            in: "opacity-100 scale-100",
            out: "opacity-0 scale-110",
          };
          break;
      }
      return (
        <div
          className={classNames(
            state === "exiting" || state === "entering"
              ? "absolute top-0"
              : "relative",
            state === "entered" ? transitionClass.in : transitionClass.out,
            state === "exited" ? "hidden" : "block",
            "transition-all ease-in-out w-full h-full flex flex-col space-y-4"
          )}
        >
          {children}
        </div>
      );
    }}
  </Transition>
);

const getInitialDate = (
  defaultActiveDate?: Date,
  propActiveDate?: Date,
  minDate?: Date
) => {
  if (defaultActiveDate) return defaultActiveDate;
  if (propActiveDate) return propActiveDate;
  if (minDate) {
    let clonedMin = cloneDate(minDate);
    while (clonedMin <= minDate) {
      clonedMin.setDate(clonedMin.getDate() + 1);
    }
    return clonedMin;
  }
  return new Date();
};

export const Calendar = forwardRef<HTMLDivElement, ICalendarProps>(
  (
    {
      highlightToday = true,
      onChange,
      activeDate: propActiveDate,
      theme = "light",
      showGoToToday = true,
      defaultActiveDate,
      minDate,
      maxDate,
      showFooter = false,
      disabledDates,
      disableTransitions,
      bodyTransition = "zoomIn",
      style,
      showFridaysAsRed = true,
      showTimePicker = true,
      presistTimeOnDateChange = false,
      months = [
        "فروردین",
        "اردیبهشت",
        "خرداد",
        "تیر",
        "مرداد",
        "شهریور",
        "مهر",
        "آبان",
        "آذر",
        "دی",
        "بهمن",
        "اسفند",
      ],
      onCancel,
      onConfirm,
    },
    ref
  ) => {
    const [activeDate, setActiveDate] = useState(
      getInitialDate(defaultActiveDate, propActiveDate, minDate)
    );
    const [selectedDate, setSelectedDate] = useState(activeDate);
    const [activeBody, setActiveBody] = useState<"main" | "months" | "years">(
      "main"
    );
    const [mode, setMode] = useState<CalendarModes>("date");
    const [hour, setHour] = useState(
      propActiveDate?.getHours() || defaultActiveDate?.getHours() || 0
    );
    const [minute, setMinute] = useState(
      propActiveDate?.getMinutes() || defaultActiveDate?.getMinutes() || 0
    );

    useEffect(() => {
      if (propActiveDate) setActiveDate(activeDate);
    }, [propActiveDate]);

    useEffect(() => {
      setActiveDate((previousActiveDate) => {
        const previousActiveDateCopy = new Date(previousActiveDate);
        previousActiveDateCopy.setHours(hour, minute, 0, 0);
        return previousActiveDateCopy;
      });
    }, [hour, minute]);

    const activeDayChangeHandler = (day: Date) => {
      const dayCopy = new Date(day);
      if (presistTimeOnDateChange) {
        dayCopy.setHours(hour, minute, 0, 0);
      } else dayCopy.setHours(0, 0, 0);
      setActiveDate(dayCopy);
    };

    const goToTodayHandler = () => {
      activeDayChangeHandler(new Date());
    };

    const nextMonthHandler = () => {
      setSelectedDate((previousDate) => addMonths(previousDate, 1));
    };

    const previousMonthHandler = () => {
      setSelectedDate((previousDate) => subMonths(previousDate, 1));
    };

    const monthChangeHandler = (month: number) => {
      setSelectedDate((previousDate) => setMonth(previousDate, month));
    };

    const yearChangeHandler = (year: number) => {
      setSelectedDate((previousDate) => setYear(previousDate, year));
    };

    const cycleThroughBodies = () => {
      if (activeBody === "main") return setActiveBody("months");
      if (activeBody === "months") return setActiveBody("years");
      return setActiveBody("main");
    };

    const goToPreviousBody = () => {
      if (activeBody === "years") return setActiveBody("months");
      setActiveBody("main");
    };

    useEffect(() => {
      setSelectedDate(activeDate);
      onChange?.(activeDate);
    }, [activeDate]);

    useEffect(() => {
      goToPreviousBody();
    }, [selectedDate]);

    const compareMinDate = () => {
      if (!minDate) return false;
      const minDateClone = new Date(minDate);
      const now = new Date();
      minDateClone.setHours(0, 0, 0);
      now.setHours(0, 0, 0);
      return now > minDate;
    };

    const themeClasses = useMemo((): TThemeClasses => {
      switch (theme) {
        case "light":
          return {
            bodyBackgroundColor: "#fff",
            chevronLeftColor: "#6b7280",
            chevronRightColor: "#6b7280",
            topBarTextColor: "#6b7280",
            weekDaysBackgroundColor: "#f3f4f6",
            weekDaysTextColor: "#9ca3af",
            daysBackgroundColor: "transparent",
            daysSelectedBackgroundColor: "#3b82f6",
            todayBorderColor: "#3b82f6",
            daysSelectedColor: "#fff",
            daysColor: "#000",
            footerBackgroundColor: "#f1f5f9",
            footerButtonColor: "#3b82f6",
            headerBackgroundColor: "#0284c7",
            headerTextColor: "#fff",
            offDaysColor: "#ef4444",
            offDaysSelectedColor: "#fee2e2",
            clock: defaultTimePickerTheme,
          };
        case "dark":
          return {
            bodyBackgroundColor: "#1c1917",
            chevronLeftColor: "#e7e5e4",
            chevronRightColor: "#e7e5e4",
            topBarTextColor: "#e7e5e4",
            weekDaysBackgroundColor: "#78716c",
            weekDaysTextColor: "#d6d3d1",
            daysBackgroundColor: "transparent",
            daysSelectedBackgroundColor: "#3b82f6",
            todayBorderColor: "#3b82f6",
            daysSelectedColor: "#fff",
            daysColor: "#fff",
            footerBackgroundColor: "#292524",
            footerButtonColor: "#3b82f6",
            headerBackgroundColor: "#0284c7",
            headerTextColor: "#fff",
            offDaysColor: "#ef4444",
            offDaysSelectedColor: "#fee2e2",
            clock: {
              backgroundColor: "#1c1917",
              amPmActiveBackgroundColor: "#3b82f6",
              amPmColor: "#fff",
              clockBackgroundColor: "#000",
              clockLabelsColor: "#fff",
              pointerBackgroundColor: "#38bdf8",
            },
          };
        case "darkRed":
          return {
            bodyBackgroundColor: "#1c1917",
            chevronLeftColor: "#e7e5e4",
            chevronRightColor: "#e7e5e4",
            topBarTextColor: "#e7e5e4",
            weekDaysBackgroundColor: "#78716c",
            weekDaysTextColor: "#d6d3d1",
            daysBackgroundColor: "transparent",
            daysSelectedBackgroundColor: "#f43f5e",
            todayBorderColor: "#f43f5e",
            daysSelectedColor: "#fff",
            daysColor: "#fff",
            footerBackgroundColor: "#292524",
            footerButtonColor: "#f43f5e",
            headerBackgroundColor: "#e11d48",
            headerTextColor: "#fff",
            offDaysColor: "#ef4444",
            offDaysSelectedColor: "#fee2e2",
            clock: {
              backgroundColor: "#1c1917",
              amPmActiveBackgroundColor: "#f43f5e",
              amPmColor: "#fff",
              clockBackgroundColor: "#000",
              clockLabelsColor: "#fff",
              pointerBackgroundColor: "#fb7185",
            },
          };
        default:
          return theme;
      }
    }, [theme]);

    useEffect(() => {
      if (months.length !== 12)
        throw new Error("طول آرایه ماه های وارد شده، می بایست 12 باشد.");
    }, [months]);

    const Body = useMemo(() => {
      return activeBody === "main" ? (
        <MainBody
          activeDate={activeDate}
          disabledDates={disabledDates?.map((disabledDate) => {
            const clonedDate = cloneDate(disabledDate);
            clonedDate.setHours(0, 0, 0);
            return clonedDate;
          })}
          highlightToday={highlightToday}
          maxDate={maxDate}
          minDate={minDate}
          onActiveDayChange={activeDayChangeHandler}
          selectedDate={selectedDate}
          themeClasses={themeClasses}
          showFridaysAsRed={showFridaysAsRed}
        />
      ) : activeBody === "months" ? (
        <MonthsBody
          themeClasses={themeClasses}
          onChangeMonth={monthChangeHandler}
          selectedDate={selectedDate}
          months={months}
        />
      ) : (
        <YearsBody
          themeClasses={themeClasses}
          onChangeYear={yearChangeHandler}
          activeDate={activeDate}
          selectedDate={selectedDate}
        />
      );
    }, [
      activeBody,
      activeDate,
      disabledDates,
      highlightToday,
      maxDate,
      minDate,
      activeDayChangeHandler,
      selectedDate,
      themeClasses,
    ]);
    return (
      <div
        ref={ref}
        style={{ fontFamily: "Vazirmatn", ...style }}
        className="flex flex-col rounded-md shadow-lg max-w-[22rem] overflow-hidden"
        dir="rtl"
      >
        <Header
          activeDate={activeDate}
          selectedDate={selectedDate}
          onGoToToday={goToTodayHandler}
          showGoToToday={minDate ? compareMinDate() : showGoToToday}
          months={months}
          themeClasses={themeClasses}
        />
        {mode === "date" ? (
          <div
            style={{ backgroundColor: themeClasses.bodyBackgroundColor }}
            className={classNames("p-4 flex flex-col items-center space-y-6")}
          >
            <div className="flex items-center justify-between text-gray-500 w-full">
              <button
                onClick={previousMonthHandler}
                style={{ color: themeClasses.chevronRightColor }}
              >
                <IconChevronRight className="w-4 h-4" />
              </button>
              <button
                className="text-base"
                onClick={cycleThroughBodies}
                style={{ color: themeClasses.topBarTextColor }}
              >
                {activeBody === "main" && months[getMonth(selectedDate)]}{" "}
                {convertDigits(format(selectedDate, "yyyy"))}
              </button>
              <button
                onClick={nextMonthHandler}
                style={{ color: themeClasses.chevronLeftColor }}
              >
                <IconChevronLeft className="w-4 h-4" />
              </button>
            </div>
            {disableTransitions ? (
              Body
            ) : (
              <div className="relative">
                <SwitchTransition mode="in-out">
                  <FadeTransition
                    bodyTransition={bodyTransition}
                    key={activeBody}
                    timeout={200}
                    unmountOnExit
                    mountOnEnter
                  >
                    {Body}
                  </FadeTransition>
                </SwitchTransition>
              </div>
            )}
          </div>
        ) : (
          <TimePicker
            onChange={(hour, minute) => {
              setHour(hour);
              setMinute(minute);
              setMode("date");
            }}
            theme={themeClasses.clock}
          />
        )}
        {showFooter && (
          <Footer
            themeClasses={themeClasses}
            onConfirm={() => onConfirm?.(activeDate)}
            onCancel={onCancel}
            showTimePicker={showTimePicker}
            mode={mode}
            onChangeMode={setMode}
          />
        )}
      </div>
    );
  }
);
