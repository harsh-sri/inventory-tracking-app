export default {
  500: {
    code: 500,
    title: 'Internal Server Error',
    message: 'Unexpected error',
  },
  400: {
    code: 400,
    title: 'Bad Request',
    message:
      'At least one parameter is invalid, please examine the request parameters',
  },
  404: {
    code: 404,
    title: 'Not Found',
    message: 'The requested resource is not found.',
  },
  503: {
    code: 503,
    title: 'Service Unavailable',
    message: 'The service is not available to handle request',
  },
};
