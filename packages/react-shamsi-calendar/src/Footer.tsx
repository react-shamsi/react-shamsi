import { IconCalendar, IconClock } from "@tabler/icons";
import classNames from "classnames";
import { CalendarModes, TThemeClasses } from ".";

interface IFooterProps {
  themeClasses: TThemeClasses;
  mode: CalendarModes;
  showTimePicker?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  onChangeMode?: (mode: CalendarModes) => void;
}
const Footer = ({
  themeClasses,
  onCancel,
  mode,
  onChangeMode,
  onConfirm,
  showTimePicker,
}: IFooterProps) => {
  return (
    <div
      style={{
        color: themeClasses.footerButtonColor,
        backgroundColor: themeClasses.footerBackgroundColor,
      }}
      className={classNames("w-full p-6 flex items-center")}
    >
      <button onClick={onConfirm} className="ml-6">
        تایید
      </button>
      <button onClick={onCancel}>انصراف</button>
      {showTimePicker && (
        <button
          className="mr-auto"
          onClick={() => onChangeMode?.(mode === "date" ? "time" : "date")}
        >
          {mode === "date" ? (
            <IconClock className="w-5 h-5" />
          ) : (
            <IconCalendar className="w-5 h-5" />
          )}
        </button>
      )}
    </div>
  );
};

export default Footer;
