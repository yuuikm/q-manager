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
      {({ isSubmitting, errors, touched }) => (
        <Form className="space-y-6">
          {fields.map(({ name, label, type = 'text', placeholder }) => (
            <div key={name} className="space-y-2">
              <label 
                htmlFor={name} 
                className="block text-sm font-medium text-gray-700"
              >
                {label}
              </label>
              {type === 'textarea' ? (
                <Field
                  name={name}
                  as="textarea"
                  rows={4}
                  placeholder={placeholder}
                  className={`
                    w-full px-4 py-3 border rounded-lg transition-all duration-200 resize-vertical
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    ${errors[name] && touched[name] 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                />
              ) : (
                <Field
                  name={name}
                  type={type}
                  placeholder={placeholder}
                  className={`
                    w-full px-4 py-3 border rounded-lg transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    ${errors[name] && touched[name] 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                />
              )}
              <ErrorMessage 
                name={name} 
                component="div" 
                className="text-red-600 text-sm font-medium flex items-center"
              >
                {(msg) => (
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{msg}</span>
                  </div>
                )}
              </ErrorMessage>
            </div>
          ))}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full flex justify-center py-3 px-4 border border-transparent rounded-lg
              text-sm font-medium text-white transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              ${isSubmitting 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-lg hover:shadow-xl'
              }
            `}
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Обработка...</span>
              </div>
            ) : (
              submitText
            )}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default FormWrapper;
