/**
 * Format date/time with Manila (Philippines) timezone
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string in Manila timezone
 */
export const formatManilaTime = (date) => {
  if (!date) return 'N/A';

  return new Date(date).toLocaleString('en-US', {
    timeZone: 'Asia/Manila',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

/**
 * Format date only with Manila timezone
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatManilaDate = (date) => {
  if (!date) return 'N/A';

  return new Date(date).toLocaleDateString('en-US', {
    timeZone: 'Asia/Manila',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Get current time in Manila timezone
 * @returns {Date} Current date/time in Manila timezone
 */
export const getCurrentManilaTime = () => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  const partMap = {};
  parts.forEach(({ type, value }) => {
    partMap[type] = value;
  });
  return new Date(
    `${partMap.year}-${partMap.month}-${partMap.day}T${partMap.hour}:${partMap.minute}:${partMap.second}`
  );
};

/**
 * Format current time in Manila for display
 * @returns {string} Current time formatted
 */
export const formatCurrentManilaTime = () => {
  const now = new Date();
  return now.toLocaleString('en-US', {
    timeZone: 'Asia/Manila',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

export default {
  formatManilaTime,
  formatManilaDate,
  getCurrentManilaTime,
  formatCurrentManilaTime,
};
