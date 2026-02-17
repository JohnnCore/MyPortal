interface InputErrorMessageProps {
  error: string | undefined;
  id?: string;
}
const InputErrorMessage = ({ error, id }: InputErrorMessageProps) => {
  if (!error) return null;

  return (
    <p id={id} className="mt-1 text-sm text-red-600">
      {error}
    </p>
  );
};

export default InputErrorMessage;
