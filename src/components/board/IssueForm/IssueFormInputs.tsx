import { useState } from "react";
import useForm from "../../../hooks/useForm";
import Input from "../../common/Input/Input";
import { FormValues } from "../../../hooks/useForm";

type IssueFormInputProps = {
  initialValues?: AvailabilityFormValue;
  onFormSubmit: (val: FormValues) => Promise<void>;
  onFormReset: () => void;
};

const IssueFormInput = ({ props }) => {
  const { values } = useForm({
    initialValues: {
      projectName: "",
      description: "",
      priority: "low",
      status: "open",
    },
    validationFunctions: {},
  });

  return (
    <form action="">
      <div>
        <Input label="Project Name" value={values} />
      </div>
    </form>
  );
};
