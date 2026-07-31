const fs = require('fs');
const path = require('path');

/**
 * Reads a JSON file, selects a random entry, and returns field1 and field2.
 * @param {string} filePath - Path to the JSON file
 * @returns {Object} { field1, field2 }
 */
function getRandomEntryFields(filePath) {
  try {
    // Read and parse the JSON file
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Ensure the data is an array
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("JSON file must contain a non-empty array of entries.");
    }

    // Generate a random index (0-based)
    const randomIndex = Math.floor(Math.random() * data.length);
    const entry = data[randomIndex];

    // Check if the entry has the required fields
    if (!('field1' in entry) || !('field2' in entry)) {
      throw new Error("Selected entry is missing 'field1' or 'field2'.");
    }

    return {
      field1: entry.field1,
      field2: entry.field2
    };
  } catch (error) {
    console.error("Error reading JSON file:", error.message);
    throw error;
  }
}

// Example usage:
// const result = getRandomEntryFields('./data.json');
// console.log(result);