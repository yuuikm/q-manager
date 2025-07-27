import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

type FieldConfig = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
};

type FormProps = {
  fields: FieldConfig[];
  initialValues: Record<string, any>;
  validationSchema: Yup.ObjectSchema<any>;
  onSubmit: (values: any) => void;
  submitText?: string;
};

const FormWrapper: React.FC<FormProps> = ({
  fields,
  initialValues,
  validationSchema,
  onSubmit,
  submitText = 'Submit',
}) => {
  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      <Form className="max-w-md mx-auto">
        {fields.map(({ name, label, type = 'text', placeholder }) => (
          <div key={name} className="mb-4">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <Field
              name={name}
              type={type}
              placeholder={placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
            />
            <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {submitText}
        </button>
      </Form>
    </Formik>
  );
};

export default FormWrapper;
