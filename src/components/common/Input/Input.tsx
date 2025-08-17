import { InputProps } from "./Input.types";

const Input = (props: InputProps) => {
  const { label = "buh", type } = props;

  return (
    <>
      <label className="block mb-2 text-sm font-medium text-gray-300">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          className="border border-gray-300 rounded-md p-2 w-1/3"
          {...props}
        ></textarea>
      ) : (
        <input
          className="border border-gray-300 rounded-md p-2 w-1/3"
          type={type}
          {...props}
        />
      )}
    </>
  );
};

export default Input;
