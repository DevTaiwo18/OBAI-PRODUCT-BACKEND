const { isEmpty } = require('./utils');

const ERROR_CONTACT_SUPPORT = ', Please Try again later or contact support if the issue persists.';

const HTTP_ERRORS = {
    ERROR_400: 'Bad Request',
    ERROR_401: 'Unauthorized',
    ERROR_403: 'Forbidden',
    ERROR_404: 'Not Found',
    ERROR_405: 'Method Not Allowed',
    ERROR_406: 'Not Acceptable',
    ERROR_408: 'Request Timeout',
    ERROR_409: 'Conflict',
    ERROR_410: 'Gone',
    ERROR_413: 'Payload Too Large',
    ERROR_415: 'Unsupported Media Type',
    ERROR_422: 'Unprocessable Entity',
    ERROR_429: 'Too Many Requests',
    ERROR_500: 'Internal Server Error',
    ERROR_502: 'Bad Gateway',
    ERROR_503: 'Service Unavailable',
    GENERAL_ERROR: 'General error',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    VALIDATION_ERROR: 'Validation failed',
    DUPLICATE_ERROR: 'Resource already exists',
    INVALID_CREDENTIALS: 'Invalid credentials provided',
    EMAIL_NOT_VERIFIED: 'Email not verified',
    RESET_PASSWORD_EXPIRED: 'Reset password link expired',
    INVALID_OTP: 'Invalid OTP provided',
    BAD_REQUEST: 'Bad request',
    NOT_ALLOWED: 'Operation not allowed',
    DEPENDENCY_ERROR: 'Related dependency error',
    PAYMENT_REQUIRED: 'Payment required',
    QUOTA_EXCEEDED: 'Quota exceeded',
    TOO_LARGE: 'Entity too large',
    TOO_MANY_REQUESTS: 'Too many requests',
    SERVICE_UNAVAILABLE: 'Service currently unavailable',
    ERROR_TIMEOUT: 'Slow internet connection or Server is currently not responding' + ERROR_CONTACT_SUPPORT,
    ERROR_UNKNOWN_HOST: 'Cannot establish a connection to the server, please try again.'
};

class ErrorHandler extends Error {
    constructor(statusCode, customMsg = '') {
        super();
        if (!isEmpty(customMsg)) {
            this.statusCode = isEmpty(statusCode) ? 406 : statusCode; // 406 will be used for Custom errors
            this.message = customMsg;
        } else {
            this.statusCode = statusCode;
            this.message = getErrorDesc(statusCode);
        }
    }
}

function getErrorDesc(statusCode) {
    switch (statusCode) {
        case 400:
            return HTTP_ERRORS.ERROR_400;
        case 401:
            return HTTP_ERRORS.ERROR_401;
        case 403:
            return HTTP_ERRORS.ERROR_403;
        case 404:
            return HTTP_ERRORS.ERROR_404;
        case 405:
            return HTTP_ERRORS.ERROR_405;
        case 410:
            return HTTP_ERRORS.ERROR_410;
        case 429:
            return HTTP_ERRORS.ERROR_429;
        case 500:
            return HTTP_ERRORS.ERROR_500;
        case 503:
            return HTTP_ERRORS.ERROR_503;
        default:
            return HTTP_ERRORS.ERROR_500;
    }
}

module.exports = {
    HTTP_ERRORS,
    ErrorHandler
};
