import { format, getDate, getMonth, isToday } from "date-fns-jalali";
import { convertDigits } from "persian-helpers";
import { useMemo } from "react";
import { TThemeClasses } from ".";

interface IHeaderProps {
  activeDate: Date;
  selectedDate: Date;
  onGoToToday?: () => void;
  showGoToToday?: boolean;
  months: string[];
  themeClasses: TThemeClasses;
}
const Header = ({
  activeDate,
  onGoToToday,
  showGoToToday,
  selectedDate,
  months,
  themeClasses,
}: IHeaderProps) => {
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
      className="w-full py-6 px-4 flex items-center"
    >
      <h1 className="text-5xl font-bold ml-2">{activeDateToJalali?.day}</h1>
      <h2 className="text-base">
        {months[getMonth(activeDate)]}، {activeDateToJalali?.dayOfWeek}
      </h2>
      {showGoToToday && !isToday(selectedDate) && (
        <button
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
