import {
  flip,
  autoUpdate as floatingUiAutoUpdate,
  shift,
  useFloating,
} from "@floating-ui/react-dom";
import { FloatingPortal } from "@floating-ui/react-dom-interactions";
import { useClickOutside } from "@mantine/hooks";
import { Calendar, ICalendarProps } from "@react-shamsi/calendar";
import { format } from "date-fns-jalali";
import { convertDigits } from "persian-helpers";
import { useEffect, useState } from "react";

interface DatePickerOnChange {
  onChange?: (newDate: Date, fromDate?: Date) => void;
}

interface IDatePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">,
    DatePickerOnChange {
  autoUpdate?: boolean;
  defaultDate?: Date | [Date, Date];
  calendarProps?: ICalendarProps;
  date?: Date | [Date, Date];
  to?: Date;
  dateFormat?: string;
  persianDigits?: boolean;
  experimental_ranged?: boolean;
  calendarPortalElement?: HTMLElement | null;
}

export const DatePicker = ({
  autoUpdate,
  calendarProps,
  onChange,
  defaultDate,
  dateFormat = "yyyy/MM/dd hh:mm:ss aaa",
  date: controlledDate,
  to,
  persianDigits,
  calendarPortalElement,
  experimental_ranged: ranged,
  ...props
}: IDatePickerProps) => {
  const { x, y, reference, floating, strategy } = useFloating({
    placement: "bottom-end",
    strategy: "absolute",
    middleware: [flip(), shift({ crossAxis: true })],
    whileElementsMounted: floatingUiAutoUpdate,
  });

  const rangeToDate = <T extends any>(input: T, get: "from" | "to") =>
    Array.isArray(input) ? input[get === "from" ? 0 : 1] : input;

  const [date, setDate] = useState(
    rangeToDate(defaultDate, "to") || rangeToDate(controlledDate, "to")
  );

  const [fromDate, setFromDate] = useState(
    rangeToDate(defaultDate, "from") || rangeToDate(controlledDate, "from")
  );

  const [isOpen, setIsOpen] = useState(false);

  const [inputRef, setInputRef] = useState<any>(null);
  const [calendarRef, setCalendarRef] = useState<any>(null);

  useClickOutside(() => setIsOpen(false), null, [calendarRef, inputRef]);

  const updateDateHandler = (newDate: Date, calendarFromDate?: Date) => {
    if (!controlledDate) {
      setDate(newDate);
      setFromDate(calendarFromDate);
    }
    if (ranged && calendarFromDate) onChange?.(calendarFromDate, newDate);
    else onChange?.(newDate);
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!isMounted) return;
    setDate(rangeToDate(controlledDate, "to"));
    if (ranged) setFromDate(rangeToDate(controlledDate, "from"));
  }, [controlledDate]);

  const CalendarComponent = (
    <Calendar
      ranged={
        Array.isArray(controlledDate)
          ? { from: controlledDate[0], to: controlledDate[1] }
          : ranged
          ? true
          : undefined
      }
      activeDate={Array.isArray(date) ? date[0] : date}
      onChange={(newDate, calendarFromDate) =>
        autoUpdate && updateDateHandler(newDate, calendarFromDate)
      }
      ref={(el) => {
        floating(el);
        setCalendarRef(el);
      }}
      style={{
        //@ts-ignore
        position: strategy,
        top: y ?? 0,
        left: x ?? 0,
      }}
      showFooter
      onConfirm={(newDate, calendarFromDate) => {
        updateDateHandler(newDate, calendarFromDate);
        setIsOpen(false);
      }}
      onCancel={() => setIsOpen(false)}
      {...calendarProps}
    />
  );

  return (
    <>
      <div ref={setInputRef}>
        <input
          ref={reference}
          className="p-2 rounded-md border border-gray-300"
          value={
            date
              ? `${
                  fromDate
                    ? convertDigits(format(fromDate, dateFormat), {
                        to: persianDigits ? "fa" : "en",
                      }) + " - "
                    : ""
                } ${convertDigits(format(date, dateFormat), {
                  to: persianDigits ? "fa" : "en",
                })}`
              : ""
          }
          readOnly
          onClick={(event) => {
            setIsOpen((previousIsOpen) =>
              previousIsOpen === false ? true : previousIsOpen
            );
            props.onClick?.(event);
          }}
          {...props}
        />
      </div>
      {calendarPortalElement ? (
        <FloatingPortal root={calendarPortalElement}>
          {isOpen && CalendarComponent}
        </FloatingPortal>
      ) : (
        isOpen && CalendarComponent
      )}
    </>
  );
};
