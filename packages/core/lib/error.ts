export type ErrorHandlerFn = (path: string, error: Error) => void;

let errorHandler: ErrorHandlerFn = (path, error) => {
  console.log(`path: ${path}`);
  console.log(error);
};

export const setErrorHandler = (fn: ErrorHandlerFn) => {
  errorHandler = fn;
};

export const getErrorHandler = () => {
  return errorHandler;
};
