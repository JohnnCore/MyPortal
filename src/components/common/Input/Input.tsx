import { InputProps } from "./Input.types";
import cn from "classnames";

const Input = ({ label, type, labelClasses, ...rest }: InputProps) => {
  console.log(labelClasses);

  return (
    <>
      <label
        htmlFor={rest.id}
        className={cn(
          "block mb-2 text-sm font-medium text-input-label ",
          labelClasses
        )}
      >
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          className="border border-input-border rounded-md p-2 w-1/3"
          rows={4}
          {...rest}
        ></textarea>
      ) : (
        <input
          className="border border-input-border rounded-md p-2 w-1/3"
          type={type}
          {...rest}
        />
      )}
    </>
  );
};

export default Input;
