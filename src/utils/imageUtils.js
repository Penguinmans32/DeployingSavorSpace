// src/utils/imageUtils.js

// Function to get the correct image path with base URL
export const getImagePath = (name) => `${import.meta.env.BASE_URL}images/${name}`;
