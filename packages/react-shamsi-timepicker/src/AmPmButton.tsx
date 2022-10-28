import classNames from "classnames";
import { ButtonHTMLAttributes, PropsWithChildren } from "react";

interface IAmPmButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}
const AmPmButton = ({
  children,
  className,
  ...props
}: PropsWithChildren<IAmPmButtonProps>) => {
  return (
    <button
      className={classNames("p-2 text-xs rounded-full", className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default AmPmButton;
