import { Configuration, OpenAIApi } from "openai";

// returns a completion object
// https://platform.openai.com/docs/api-reference/chat/object
const requestGPT = async (apiKey, promptList, model="gpt-3.5-turbo", temperature=0) => {
  // set api key
  const configuration = new Configuration({
    apiKey: apiKey,
  });
  const openai = new OpenAIApi(configuration);
  
  // generate response
  const completion = await openai.chat.completions.create({
    messages: promptList,
    model: model,
    temperature: temperature
  });

  return completion;
}

// parse the response to a string
const parseResponse = (res) => {
  if (res.choices[0].finish_reason !== "stop") {
    return "NA";
  }

  const content = res.choices[0].message.content;

  return content;
}

// returns whether the response is valid
const validateResponse = (parsed) => {
  let isValid = false;
  try {
    const parsedJson = JSON.parse(parsed);
    if ("code" in parsedJson && "explanation" in parsedJson) {
      isValid = true;
    }
  } catch (err) {
    isValid = false;
    console.log(err);
  }
  return isValid;
}

// returns a JSON {code: "", response: ""}
const getResponse = async (apiKey, promptList, model="gpt-3.5-turbo", temperature=0, maxTries=3) => {
  let attempt = 0;
  while (attempt < maxTries) {
    const res = await requestGPT(apiKey, promptList, model, temperature);
    const parsed = parseResponse(res);
    const isValid = validateResponse(parsed);
    if (isValid) {
      const result = JSON.parse(parsed);
      return result;
    }
    attempt += 1;
  }
  return {code: "NA", explanation: "NA"};
}

// given a parsed csv as an array of JSON, process the specified column for the specified
//   models, zero/few shots and features 
const process = async (apiKey, parsedCsv, models, shots, features, column) => {
  let result = [];

  // for all rows
  for (let i = 0; i < parsedCsv.length; ++i) {
    let row = {};
    const text = parsedCsv[i][column];
    row.text = text;

    // for all models
    for (const [model, includeModel] of Object.entries(models)) {
      if (!includeModel) continue;

      // for all shots
      for (const [shot, includeShot] of Object.entries(shots)) {
        if (!includeShot) continue;

        // for all features
        for (const [feature, includeFeature] of Object.entries(features)) {
          if (!includeFeature) continue;

          // const promptList = [
          //   {"role": "system", "content": },
          //   {"role": "user", "content": },
          // ];

          const res = await getResponse(apiKey, promptList, model);
          row[`${feature} code`] = res.code;
          row[`${feature} explanation`] = res.explanation;
          await new Promise(r => setTimeout(r, 20000));  // wait

        }
      }
    }
    result.push(row);
  }
  return result;
}