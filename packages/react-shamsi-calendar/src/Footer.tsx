import classNames from "classnames";
import { TThemeClasses } from ".";

interface IFooterProps {
  themeClasses: TThemeClasses;
  onConfirm?: () => void;
  onCancel?: () => void;
}
const Footer = ({ themeClasses, onCancel, onConfirm }: IFooterProps) => {
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
      {/* <button className="mr-auto">
        <IconClock className="w-5 h-5" />
      </button> */}
    </div>
  );
};

export default Footer;
