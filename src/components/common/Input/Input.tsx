import { InputProps } from "./Input.types";
import cn from "classnames";

const Input = ({ label, type, labelClasses, ...rest }: InputProps) => {
  return (
    <>
      <label
        htmlFor={rest.id}
        className={cn(
          "block mb-2 text-sm font-medium text-gray-300",
          labelClasses
        )}
      >
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          className="border border-gray-300 rounded-md p-2 w-1/3"
          {...rest}
        ></textarea>
      ) : (
        <input
          className="border border-gray-300 rounded-md p-2 w-1/3"
          type={type}
          {...rest}
        />
      )}
    </>
  );
};

export default Input;
