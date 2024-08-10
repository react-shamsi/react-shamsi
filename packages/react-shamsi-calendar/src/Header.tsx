import classNames from "classnames";
import { format, getDate, getMonth, isToday } from "date-fns-jalali";
import { convertDigits } from "persian-helpers";
import { useMemo } from "react";
import { RangedDate, TThemeClasses } from ".";

interface IHeaderProps {
  activeDate: Date;
  selectedDate: Date;
  onGoToToday?: () => void;
  showGoToToday?: boolean;
  months: string[];
  themeClasses: TThemeClasses;
  range?: RangedDate;
}
const Header = ({
  activeDate,
  onGoToToday,
  showGoToToday,
  selectedDate,
  months,
  themeClasses,
  range,
}: IHeaderProps) => {
  const isRanged = useMemo(() => !!range, [range]);
  const activeDateToJalali = useMemo(
    () => ({
      day: convertDigits(getDate(activeDate)),
      dayOfWeek: format(activeDate, "EEEE"),
    }),
    [activeDate]
  );

  return (
    <div
      style={{
        color: themeClasses.headerTextColor,
        backgroundColor: themeClasses.headerBackgroundColor,
      }}
      className={classNames(
        "w-full px-4 flex items-center relative",
        isRanged ? "py-12" : "py-6"
      )}
    >
      {isRanged && (
        <>
          <div className="w-1/2 h-full absolute left-0 top-0 bg-black/20 z-50 text-center flex items-center justify-center">
            {range?.to ? (
              <div className="flex items-center space-x-2 space-x-reverse">
                <h1 className="text-5xl font-bold ml-2">
                  {convertDigits(getDate(range.to))}
                </h1>
                <h2 className="text-xl">{months[getMonth(range?.to)]}</h2>
              </div>
            ) : (
              <h1 className="text-5xl font-bold opacity-30 pointer-events-none select-none">
                پایان
              </h1>
            )}
          </div>
          <div className="absolute w-1/2 h-full right-0 text-center flex items-center justify-center">
            {range?.from ? (
              <div className="flex items-center space-x-2 space-x-reverse">
                <h1 className="text-5xl font-bold ml-2">
                  {convertDigits(getDate(range.from))}
                </h1>
                <h2 className="text-xl">{months[getMonth(range?.from)]}</h2>
              </div>
            ) : (
              <h1 className="text-5xl font-bold opacity-30 pointer-events-none select-none">
                شروع
              </h1>
            )}
          </div>
        </>
      )}
      {!isRanged && (
        <>
          <h1 className="text-5xl font-bold ml-2">{activeDateToJalali?.day}</h1>
          <h2 className="text-base">
            {months[getMonth(activeDate)]}، {activeDateToJalali?.dayOfWeek}
          </h2>
        </>
      )}

      {!isRanged && showGoToToday && !isToday(selectedDate) && (
        <button
          type="button"
          onClick={onGoToToday}
          className="px-4 py-2 rounded-md bg-white text-black mr-auto text-sm"
        >
          برو به امروز
        </button>
      )}
    </div>
  );
};

export default Header;
