export const daysLeft = (deadline) => {
  const difference = new Date(deadline * 1000).getTime() - Date.now();
  const remainingDays = difference / (1000 * 3600 * 24);

  return remainingDays.toFixed(0);
};

export const calculateBarPercentage = (goal, raisedAmount) => {
  const percentage = Math.round((raisedAmount * 100) / goal);

  return percentage;
};

export const checkIfImage = (url, callback) => {
  const img = new Image();
  img.src = url;

  if (img.complete) callback(true);

  img.onload = () => callback(true);
  img.onerror = () => callback(false);
};

export const checkIfValidUrl = (str) => {
  let url;
  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

export const ipfsToHttp = (url) => {
  const hash = url.split("//")[1];
  return `https://${import.meta.env.VITE_THIRDWEB_CLIENT_ID}.ipfscdn.io/ipfs/${hash}`
}