import {
  autoUpdate as floatingUiAutoUpdate,
  flip,
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
  onChange?: (newDate: Date) => void;
}

interface IDatePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">,
    DatePickerOnChange {
  autoUpdate?: boolean;
  defaultDate?: Date;
  calendarProps?: ICalendarProps;
  date?: Date;
  dateFormat?: string;
  persianDigits?: boolean;
  calendarPortalElement?: HTMLElement | null;
}

export const DatePicker = ({
  autoUpdate,
  calendarProps,
  onChange,
  defaultDate,
  dateFormat = "yyyy/MM/dd",
  date: controlledDate,
  persianDigits,
  calendarPortalElement,
  ...props
}: IDatePickerProps) => {
  const { x, y, reference, floating, strategy } = useFloating({
    placement: "bottom-end",
    strategy: "absolute",
    middleware: [flip(), shift({ crossAxis: true })],
    whileElementsMounted: floatingUiAutoUpdate,
  });

  const [date, setDate] = useState(defaultDate || controlledDate);

  const [isOpen, setIsOpen] = useState(false);

  const [inputRef, setInputRef] = useState<any>(null);
  const [calendarRef, setCalendarRef] = useState<any>(null);

  useClickOutside(() => setIsOpen(false), null, [calendarRef, inputRef]);

  const updateDateHandler = (newDate: Date) => {
    if (!controlledDate) setDate(newDate);
    onChange?.(newDate);
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!isMounted) return;
    setDate(controlledDate);
  }, [controlledDate]);

  const CalendarComponent = (
    <Calendar
      activeDate={date}
      onChange={(newDate) => autoUpdate && updateDateHandler(newDate)}
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
      onConfirm={(newDate) => {
        updateDateHandler(newDate);
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
              ? convertDigits(format(date, dateFormat), {
                  to: persianDigits ? "fa" : "en",
                })
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
