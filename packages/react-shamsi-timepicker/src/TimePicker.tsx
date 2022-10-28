import classNames from "classnames";
import { convertDigits } from "persian-helpers";
import { useEffect, useMemo, useState } from "react";
import AmPmButton from "./AmPmButton";

export type TTimePickerTheme = {
  backgroundColor: string;
  clockBackgroundColor: string;
  clockLabelsColor: string;
  pointerBackgroundColor: string;
  amPmColor: string;
  amPmActiveBackgroundColor: string;
};

interface ITimePickerProps {
  theme?: TTimePickerTheme;
  onChange?: (hour: number, minute: number) => void;
}

const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const minutes = [
  "00",
  "05",
  "10",
  "15",
  "20",
  "25",
  "30",
  "35",
  "40",
  "45",
  "50",
  "55",
];

const getDegrees = (index: number, items: any[]) => {
  return (index * 360) / items.length;
};

export const defaultTimePickerTheme: TTimePickerTheme = {
  backgroundColor: "#fff",
  amPmActiveBackgroundColor: "#93c5fd",
  amPmColor: "#000",
  clockBackgroundColor: "#eff6ff",
  clockLabelsColor: "#000",
  pointerBackgroundColor: "#3b82f6",
};

export const TimePicker = ({
  onChange,
  theme = defaultTimePickerTheme,
}: ITimePickerProps) => {
  const [currentHoverIndex, setCurrentHoverIndex] = useState<number>();
  const [hour, setHour] = useState<number>();
  const [minute, setMinute] = useState<number>();
  const [isAm, setIsAm] = useState(true);
  const currentTimes = useMemo(() => (hour ? minutes : hours), [minute, hour]);

  useEffect(() => {
    if (hour !== undefined && minute !== undefined) onChange?.(hour, minute);
  }, [hour, minute]);

  useEffect(() => {
    if (hour) {
      setHour((previousHour) =>
        previousHour
          ? isAm
            ? previousHour - 12
            : previousHour + 12
          : previousHour
      );
    }
  }, [isAm]);

  return (
    <div
      className="w-full h-full relative"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div
        className="w-[18rem] h-[18rem] m-8 shrink-0 relative rounded-full"
        style={{ backgroundColor: theme.clockBackgroundColor }}
      >
        <div
          className="w-2 h-2 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-full"
          style={{ backgroundColor: theme.pointerBackgroundColor }}
        ></div>
        {currentHoverIndex !== undefined && (
          <>
            <div
              className="absolute h-[40%] w-0.5 top-[10%] origin-bottom left-1/2 -translate-x-1/2"
              style={{
                transform: `rotate(${getDegrees(
                  currentHoverIndex,
                  currentTimes
                )}deg)`,
                backgroundColor: theme.pointerBackgroundColor,
              }}
            ></div>
          </>
        )}
        {currentTimes.map((time, index) => {
          const degrees = getDegrees(index, currentTimes);
          return (
            <div
              key={time}
              className={classNames(
                "absolute text-center text-lg pointer-events-none",
                currentHoverIndex === index && "text-white"
              )}
              style={{
                transform: `rotate(${degrees}deg)`,
                inset: "10px",
              }}
            >
              <button
                onMouseEnter={() => setCurrentHoverIndex(index)}
                onMouseLeave={() => setCurrentHoverIndex(undefined)}
                className="inline-block w-8 h-8 pointer-events-auto rounded-full"
                style={{
                  transform: `rotate(-${degrees}deg)`,
                  color: theme.clockLabelsColor,
                  backgroundColor:
                    currentHoverIndex === index
                      ? theme.pointerBackgroundColor
                      : "transparent",
                }}
                onClick={() => {
                  if (hour) setMinute(+time);
                  else setHour(+time);
                }}
              >
                {convertDigits(time)}
              </button>
            </div>
          );
        })}
      </div>
      <AmPmButton
        style={{
          backgroundColor: isAm
            ? theme.amPmActiveBackgroundColor
            : "transparent",
          color: theme.amPmColor,
        }}
        className={"absolute bottom-4 left-4"}
        onClick={() => setIsAm(true)}
      >
        قبل از ظهر
      </AmPmButton>
      <AmPmButton
        style={{
          backgroundColor: isAm
            ? "transparent"
            : theme.amPmActiveBackgroundColor,
          color: theme.amPmColor,
        }}
        className={"absolute bottom-4 right-4"}
        onClick={() => setIsAm(false)}
      >
        بعد از ظهر
      </AmPmButton>
    </div>
  );
};
