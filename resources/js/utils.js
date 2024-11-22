// IMPORTANT DO NOT REMOVE

export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

export const formatDate = (dateString) => {
  if (!dateString) return null;
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatPrice = (price) => {
  if (isNaN(price)) return null;
  return parseFloat(price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const formatDateString = (dobString) => {
  if (!dobString) {
    return ''; 
}

  const [month, day, year] = dobString.split('/');
  // Reformat to "YYYY-MM-DD"
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};