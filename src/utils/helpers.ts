import { MetaResponse } from '../types';

export const getNameFromMetadata = (id: number, metadata: MetaResponse[]) => {
  const item = metadata.find((meta) => meta.id === id);
  return item ? item.name : 'Unknown';
};

export const generateTimestampID = () => {
  const timestamp = Date.now(); // Current timestamp in milliseconds
  const randomNum = Math.floor(Math.random() * 100000); // Random 5-digit number
  return timestamp * 100000 + randomNum; // Combine both to generate unique number
};

export const generateNegativeTimestampID = () => {
  const timestamp = Date.now(); // Current timestamp in milliseconds
  const randomNum = Math.floor(Math.random() * 100000); // Random 5-digit number
  return -(timestamp * 100000 + randomNum); // Combine both to generate unique number and make it negative
};
