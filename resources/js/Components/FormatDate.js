export const formatDate = (dateString) => {
    if (!dateString) return null;
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

export const numberFormat = (number, decimals = 2) => {
    return Number(number).toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
};
