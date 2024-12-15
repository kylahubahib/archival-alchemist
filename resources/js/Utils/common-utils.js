import { format } from "date-fns";

/* =============  STRING MANIPULATION UTILITIES  =========== */
export const capitalize = (str) => {
    return str.replace(/^(.)/, (match) => match.toUpperCase());
}

export const titleCase = (str) => {
    return str
        .split(' ') // Split the string into an array of words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
        .join(' '); // Join the words back into a single string
};

/* =============  DATE FORMATTING UTILITIES  =========== */
export const padZero = (num) => String(num).padStart(2, '0');

// Sample Output: 11/29/24 03:30 PM
export const formatDateTime = (date) => {
    return format(new Date(date), 'MM/dd/yy hh:mm a');
};

// Parses next ui date time pickers to be pass in the database
export const parseNextUIDate = (date) => {
    const formatDate = (d) => d ? `${d.year}-${padZero(d.month)}-${padZero(d.day)}` : null;

    return date ? formatDate(date) : null;
};

export const parseNextUIDateTime = (date) => {
    const formatDate = (d) => d ? `${d.year}-${padZero(d.month)}-${padZero(d.day)} ${padZero(d.hour)}:${padZero(d.minute)}:00` : null;

    const startDate = formatDate(date?.start);
    const endDate = formatDate(date?.end);

    return startDate && endDate ? `${startDate} - ${endDate}` : null;
};

/* =============  URL MANAGEMENT UTILITIES  =========== */
export const updateURLParams = (paramKey, paramValue) => {
    const urlParams = new URLSearchParams(window.location.search);

    // Check if paramValue is a valid number (and not NaN)
    if (typeof paramValue === 'number' && !isNaN(paramValue)) {
        urlParams.set(paramKey, paramValue);
    } else if (paramValue != null && paramValue.trim() !== '') {
        // For non-number values, check if it's a non-empty string
        urlParams.set(paramKey, paramValue);
    } else {
        // Delete the parameter if the value is invalid
        urlParams.delete(paramKey);
    }

    // Add '?' to the URL if there are any parameters (including valid numbers)
    window.history.pushState({}, '', `${window.location.pathname}${urlParams.toString() ? '?' : ''}${urlParams}`);
};


export const encodeURLParam = (param) => {
    // Assign a default null value to remove the param in the url if the value is an empty string
    return param ? encodeURIComponent(param?.trim()) : null;
}
export const decodeURLParam = (param) => {
    // Assign a default null value to remove the param in the url if the value is an empty string
    return param ? decodeURIComponent(param?.trim()) : null;
}

export const encodeAllParams = (params) => {
    Object.keys(params).forEach(key => {
        params[key] = encodeURLParam(params[key]);
    });
};

export const sanitizeURLParam = (param) => {
    const trimmedValue = param?.trim();
    return trimmedValue === '' ? null : trimmedValue;
};

/* =============  ANIMATION UTILITIES FOR FRAMER MOTION  =========== */
export const getAnimationProps = ({ index = 0, animationType = 'fadeUp', duration = 0.5, delay = 0.25 }) => {
    switch (animationType) {
        case 'fadeUp': // Fade in from below
            return {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: index * delay, duration },
                exit: { opacity: 0, y: 20 },
            };
        case 'fadeIn': // Simple fade in
            return {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { delay: index * delay, duration },
                exit: { opacity: 0 },
            };
        case 'zoomIn': // Fade in and scale up
            return {
                initial: { opacity: 0, scale: 0.8 },
                animate: { opacity: 1, scale: 1 },
                exit: { opacity: 0, scale: 0.8 },
                transition: { delay: index * delay, duration },
            };
        case 'zoomOut': // Fade out and scale down
            return {
                initial: { opacity: 1, scale: 1 },
                animate: { opacity: 0, scale: 0.8 },
                exit: { opacity: 0, scale: 0.8 },
                transition: { delay: index * delay, duration },
            };
        case 'slideRight': // Slide in from left to right
            return {
                initial: { opacity: 0, x: -50 },
                animate: { opacity: 1, x: 0 },
                exit: { opacity: 0, x: -50 },
                transition: { delay: index * delay, duration },
            };
        case 'slideLeft': // Slide in from right to left
            return {
                initial: { opacity: 0, x: 50 },
                animate: { opacity: 1, x: 0 },
                exit: { opacity: 0, x: 50 },
                transition: { delay: index * delay, duration },
            };
        default:
            return {};
    }
};

// Next ui custom input classnames
export const customInputClassNames = (propsClass = {}, styleProps = {}) => ({
    base: "tracking-wide pb-2",
    input: "border-none focus:ring-0 text-customGray",
    style: {  // Remove the default focus styles
        border: 'none',
        boxShadow: 'none',
        ...styleProps,
    },
    ...propsClass,
});

export const customAutocompleteInputProps = (propsClass = {}, styleProps = {}) => ({
    style: {
        border: 'none',
        boxShadow: 'none',
        marginBottom: '-10px',
        ...styleProps,
    },
    ...propsClass,
});