const USER_ROLE = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    CUSTOMER: 'CUSTOMER',
    ADMIN: 'ADMIN'
};

const PLATFORMS = {
    FACEBOOK: 'FACEBOOK',
    GMAIL: 'GMAIL',
    APPLE: 'APPLE',
    EMAIL: 'EMAIL',
    PHONE: 'PHONE'
};

const GENDER = {
    MALE: 'MALE',
    FEMALE: 'FEMALE'
};

const STATUS = {
    PENDING: 'PENDING',
    ON_GOING: 'ON_GOING',
    SUBMITTED: 'SUBMITTED',
    APPROVE: 'APPROVE',
    REJECT: 'REJECT',
    ACTIVE: 'ACTIVE',
    PAUSE: 'PAUSE',
    ARCHIVE: 'ARCHIVE',
    NULL: 'NULL'
};

const DENTS_CLASS = {
    VERY_LIGHT: 'VERY_LIGHT',
    LIGHT: 'LIGHT',
    MODERATE: 'MODERATE',
    MEDIUM: 'MEDIUM',
    HEAVY: 'HEAVY',
    NULL: 'NULL'
};

const DENTS_SIZE = {
    DIME: 'DIME',
    NICKEL: 'NICKEL',
    QUARTER: 'QUARTER',
    HALF: 'HALF',
    NULL: 'NULL'
};

Object.freeze(USER_ROLE);
Object.freeze(PLATFORMS);
Object.freeze(GENDER);
Object.freeze(STATUS);
Object.freeze(DENTS_CLASS);
Object.freeze(DENTS_SIZE);

const CONSTANT_ENUM = {
    USER_ROLE,
    PLATFORMS,
    GENDER,
    STATUS,
    DENTS_CLASS,
    DENTS_SIZE
};

module.exports = CONSTANT_ENUM;
