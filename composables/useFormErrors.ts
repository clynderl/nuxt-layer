export const useFormErrors = () => {
  const errors = ref({});

  function setErrors(error: any) {
    Object.keys(error).forEach((key) => {
      if (Array.isArray(error[key])) {
        errors.value[key] = error[key][0];
      } else if (typeof error[key] === 'object') {
        errors.value[key] = error[key];
      } else {
        errors.value[key] = error[key];
      }
    });
  }

  function clearErrors() {
    errors.value = {};
  }

  return {
    errors,
    setErrors,
    clearErrors,
  };
};
