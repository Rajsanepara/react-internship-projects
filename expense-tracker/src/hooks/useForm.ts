import { useState } from "react";
import type { ChangeEvent } from "react";

export function useForm<T>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    // Explicit conversion logic based on input type if necessary
    const parsedValue = type === "number" && value ? parseFloat(value) : value;

    setValues((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
      
    // Clear out error on change
    if (errors[name as keyof T]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const setFieldValue = (name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
     if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  const validate = (validationRules: Partial<Record<keyof T, (val: any) => string | null>>) => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    for (const key in validationRules) {
      if (Object.prototype.hasOwnProperty.call(validationRules, key)) {
        const errorMsg = validationRules[key]?.(values[key]);
        if (errorMsg) {
          newErrors[key] = errorMsg;
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  return {
    values,
    errors,
    handleChange,
    setFieldValue,
    resetForm,
    validate,
    setValues,
  };
}
