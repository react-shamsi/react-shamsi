import classNames from "classnames";
import { getMonth } from "date-fns-jalali";
import { TThemeClasses } from ".";

interface IMonthsBodyProps {
  onChangeMonth: (month: number) => void;
  months: string[];
  selectedDate: Date;
  themeClasses: TThemeClasses;
}
const MonthsBody = ({
  onChangeMonth,
  months,
  themeClasses,
  selectedDate,
}: IMonthsBodyProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {months.map((month, index) => (
        <button
          onClick={() => onChangeMonth(index)}
          key={month}
          style={{
            backgroundColor:
              index === getMonth(selectedDate)
                ? themeClasses.daysSelectedBackgroundColor
                : themeClasses.daysBackgroundColor,
            color:
              index === getMonth(selectedDate)
                ? themeClasses.daysSelectedColor
                : themeClasses.daysColor,
          }}
          className={classNames("px-6 py-4 rounded-full text-center")}
        >
          {month}
        </button>
      ))}
    </div>
  );
};

export default MonthsBody;
