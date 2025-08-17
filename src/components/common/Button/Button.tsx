import cn from "classnames";

import { ButtonProps } from "./Button.types";

const Button = (props: ButtonProps) => {
  const { children, size = "large", variant = "primary" } = props;

  return (
    <>
      <button
        className={cn(
          `flex justify-center items-center w-full md:w-fit rounded px-4 py-2 border font-semibold`,
          {
            "bg-green-700 border-primary-dark-green text-primary-white hover:bg-secondary-dark-green disabled:bg-neutral-grey-400":
              variant === "primary",
            "bg-white border-neutral-grey-400 text-neutral-grey-800 hover:bg-neutral-grey-100 disabled:bg-neutral-grey-400 disabled:text-primary-white":
              variant === "secondary",
            "aims-btn-link": variant === "link",
            // "aims-btn-link px-4 py-2": defaultLink,
            "aims-btn-plain": variant === "plain",
            "px-6 py-3": size === "large",
            "py-2": size === "small",
            "py-0.5 text-xs": size === "x-small",
            // "text-xs aims-btn-link": smallLink,
          }
        )}
        {...props}
      >
        {children}
      </button>
    </>
  );
};

export default Button;
