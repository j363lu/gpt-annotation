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
      }
    });
  });
}