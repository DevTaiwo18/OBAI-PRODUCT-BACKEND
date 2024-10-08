const { format } = require('date-fns');
const { default: axios } = require('axios');

let showLogs = isDevelopment();
let showLimiterLogs = isDevelopment();
let showErrorLogs = isDevelopment();

function enableDisableLogs(enableDisableLogs = false) {
    showLogs = enableDisableLogs;
    showLimiterLogs = enableDisableLogs;
    showErrorLogs = enableDisableLogs;
}

function formatErrorString(errorStr) {
    let resultErrorStr = 'Empty Error';
    if (!isEmpty(errorStr)) {
        if (errorStr instanceof Array) {
            resultErrorStr = JSON.stringify(errorStr);
        } else {
            resultErrorStr = errorStr;
        }
    }
    return resultErrorStr;
}

function sanitizeString(str) {
    /*eslint-disable*/
    str = str.toString().replace(/[^a-z0-9 \.@,_-]/gim, '');
    return str.trim();
    /*eslint-disable*/
}

function isEmptyIncludingZero(str) {
    const string = typeof str === 'string' ? str.replace(/\s/g, '') : str;
    return isEmpty(string) || string === '0' || string === '0.0';
}

function isEmpty(str) {
    let string = typeof str === 'string' ? str.replace(/\s/g, '') : str;
    string = typeof string === 'number' ? string.toString() : string;
    string = isJsonObj(string) && Object.keys(string)?.length === 0 ? '' : string;
    string = isJsonStr(string) && Object.keys(JSON.parse(string))?.length === 0 ? '' : string;
    return typeof string === 'undefined' || !string || string?.length === 0 || string === '' || string === '0000-00-00 00:00:00' || string === null;
}

function isNotEmpty(str) {
    return !isEmpty(str);
}

function isset(variable) {
    if (typeof variable === 'undefined' || variable === null) {
        return false;
    } else {
        return true;
    }
}

function isNotSet(variable) {
    return !isset(variable);
}

function isJsonObj(obj) {
    if (typeof obj !== 'object') return false;
    try {
        const type = Object.prototype.toString.call(obj).toLowerCase();
        return type === '[object object]' || type === '[object array]';
    } catch (err) {
        return false;
    }
}

function isJsonStr(str) {
    if (typeof str !== 'string') return false;
    try {
        const result = JSON.parse(str);
        const type = Object.prototype.toString.call(result).toLowerCase();
        return type === '[object object]' || type === '[object array]';
    } catch (err) {
        return false;
    }
}

function printLog(desc = '', logData = '') {
    if (showLogs === true || showLimiterLogs === true) {
        if (isNotEmpty(desc)) console.log(desc);
        if (isNotEmpty(logData)) console.log(logData);
    }
}

function printErrorLog(logDetail) {
    if (showErrorLogs === true) {
        console.log(logDetail + '\n');
    }
}

function trimAllFieldsInObjectAndChildren(obj) {
    return JSON.parse((typeof obj === 'string' ? obj : JSON.stringify(obj)).replace(/"\s+|\s+"/g, '"'));
}

function replaceAll(str, mapObj) {
    const re = new RegExp(
        Object.keys(mapObj)
            .map((key) => escapeRegex(key))
            .join('|'),
        'gi'
    );
    return str.replace(re, function (matched) {
        return mapObj[matched];
    });
}

function escapeRegex(string) {
    return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function roundTo(value, decimal = 2) {
    if (isNumeric(value) && value.toString().indexOf('.') !== -1) {
        return Number(parseFloat(value).toFixed(decimal));
    } else {
        return parseInt(value);
    }
}

function isNumeric(num) {
    return !isNaN(num);
}

function ParseNumber(num) {
    return isNumeric(num) ? Number(num) : 0;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCurrentTimeStamp() {
    return format(new Date(), 'yyyy-MM-dd HH:mm:ss');
}

function getCurrentTimeStampISO() {
    const timestamp = new Date();
    return timestamp;
}

function getCurrentTimeStampWithMs() {
    return `${format(new Date(), 'yyyy-MM-ddTHH:mm:ss.SSS')}Z`;
}

function utcToLocal(timestamp) {
    return format(new Date(timestamp), 'yyyy-MM-dd HH:mm:ss');
}

function generatePassword(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters?.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function randomNumberGenerate(length) {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters?.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return String(result);
}

function isProduction() {
    return process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'PROD' || process.env.NODE_ENV === 'PRODUCTION';
}

function isDevelopment() {
    return process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'DEV' || process.env.NODE_ENV === 'DEVELOPMENT';
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function sendRequest(url, data) {
    const method = data.method || 'post';
    const payload = data.payload || {};
    const headers = data.headers || {};

    const axiosConfig = {
        method,
        url,
        headers: {
            Authorization: 'Basic ' + process.env.SS_KEY,
            ...headers
        },
        validateStatus: () => true
    };

    if (method === 'get') {
        axiosConfig.params = payload;
    } else {
        axiosConfig.data = payload;
    }

    try {
        const response = await axios(axiosConfig);
        return response;
    } catch (error) {
        return error;
    }
}

function uppercaseFirst(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function areDatesSameIgnoringTime(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    const year1 = d1.getFullYear();
    const month1 = d1.getMonth();
    const day1 = d1.getDate();

    const year2 = d2.getFullYear();
    const month2 = d2.getMonth();
    const day2 = d2.getDate();

    const isDateSame = year1 === year2 && month1 === month2 && day1 === day2;

    if (!isDateSame) return true;

    const time1 = d1.getUTCHours();
    const time2 = d2.getUTCHours();

    if (time1 < time2) return time2 - time1 >= 12;

    return time1 - time2 >= 12;
}

module.exports = {
    enableDisableLogs,
    isEmpty,
    isNotEmpty,
    isEmptyIncludingZero,
    isJsonStr,
    isJsonObj,
    formatErrorString,
    generatePassword,
    printLog,
    printErrorLog,
    trimAllFieldsInObjectAndChildren,
    roundTo,
    ParseNumber,
    isNumeric,
    getCurrentTimeStamp,
    getCurrentTimeStampISO,
    getCurrentTimeStampWithMs,
    utcToLocal,
    replaceAll,
    sleep,
    isProduction,
    isDevelopment,
    isset,
    isNotSet,
    sanitizeString,
    getRandomInt,
    sendRequest,
    uppercaseFirst,
    randomNumberGenerate,
    areDatesSameIgnoringTime
};
