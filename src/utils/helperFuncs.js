import Papa from 'papaparse';

// parse csv
export const parseCsv = (csv) => {
  return new Promise((resolve, reject) => {
    if (csv) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const text = e.target.result;
        
        // parse the csv
        Papa.parse(text, {
          complete: (result) => {
            resolve(result.data);
          },
          header: true,
          error: (error) => {
            console.error("Error when parsing CSV: ", error);
            reject("Error when parsing CSV");
          }

        });
      }

      reader.readAsText(csv);
    } else {
      reject("No CSV file provided");
    }
  })
}

export const parseSurveyCsv = (csv) => {
  return new Promise((resolve, reject) => {
    // Extract the Base64 content
    const base64Content = csv.content.split('base64,')[1];

    // Decode the Base64 string
    const decodedContent = atob(base64Content);

    Papa.parse(decodedContent, {
      header: true, // Assumes the first row of the CSV are headers
      complete: function(results) {
        resolve(results.data);  
        // results.data is an array of objects
        // Each object is a row in the CSV with key-value pairs
      },
      error: (error) => {
        throw Error("Error when parsing CSV");
      }
    });
  });
}

// convert an array of objects to a CSV download file
export const downloadArrayAsCsv = (array, filename) => {
  // Convert array of objects to CSV string
  if (array.length === 0) return;

  const separator = ',';
  const keys = Object.keys(array[0]);
  const csvContent = [
    keys.join(separator), // Add column headers (keys)
    ...array.map(row => keys.map(k => row[k]).join(separator)) // Add row data
  ].join('\r\n');

  // Create Blob
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create Blob URL
  const url = URL.createObjectURL(blob);

  // Create Download Link
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename + '.csv');
  document.body.appendChild(link);

  // Step 5: Initiate Download
  link.click();
  document.body.removeChild(link);
}

// reconstruct the JSON so that the example always comes before explanation after JSON.stringify
const example = (input) => {
  return {
    "example": input.example,
    "explanation": input.explanation
  }
}

// given the feature object from the survey, construct examples JSON for binary classification 
const examplesJson = (feature) => {
  return {
    "present": [
      example(feature.presentExample1), 
      example(feature.presentExample2), 
      example(feature.presentExample3)
    ],
    "absent": [
      example(feature.absentExample1), 
      example(feature.absentExample2), 
      example(feature.absentExample3)
    ]
  };
}

const examplesOrdinalJson = (feature) => {
  return {
    "low": [
      example(feature.lowExample1), 
      example(feature.lowExample2), 
      example(feature.lowExample3)
    ],
    "high": [
      example(feature.highExample1), 
      example(feature.highExample2), 
      example(feature.highExample3)
    ]
  };
}

// construct JSON for zero-shot
export const zeroShotJson = (feature) => {
  return {
    "label": `<${feature.featureName}>`,
    "definition": feature.featureDefinition
  };
}

// construct JSON for few-shot
export const fewShotJson = (feature) => {
  const zero = zeroShotJson(feature);
  const examples = examplesJson(feature);
  return {
    ...zero,
    "examples": examples
  };
}

// construct JSON for few-shot ordinal classification
export const fewShotOrdinalJson = (feature) => {
  const zero = zeroShotJson(feature);
  const examples = examplesOrdinalJson(feature);
  return {
    ...zero,
    "examples": examples
  };
}