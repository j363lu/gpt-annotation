import OpenAI from "openai";
import store from "../app/store";

export const validateKey = async (apiKey) => { 
  const result = await requestGPT(apiKey, [], "gpt-3.5-turbo", 0, 0);
  console.log(result);
}

// returns a completion object
// https://platform.openai.com/docs/api-reference/chat/object
const requestGPT = async (apiKey, promptList, model="gpt-3.5-turbo", temperature=0, maxTries=3) => {
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
    maxRetries: maxTries
  });

  // generate response
  console.log("Requesting openai...");
  try {
    const completion = await openai.chat.completions.create({
      messages: promptList,
      model: model,
      temperature: temperature,
      response_format: { type: "json_object" },
    });
  
    return completion;
  } catch (err) {
    console.log(err);
    store.dispatch({ type: "error/setErrorOpen", payload: true });
    store.dispatch({ type: "error/setErrorMessage", payload: err.message});
  }

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
export const getResponse = async (apiKey, promptList, model="gpt-3.5-turbo", temperature=0, maxTries=3) => {
  const res = await requestGPT(apiKey, promptList, model, temperature, maxTries);
  const parsed = parseResponse(res);
  const isValid = validateResponse(parsed);
  if (isValid) {
    const result = JSON.parse(parsed);
    return result;
  }
  return {code: "NA", explanation: "NA"};
}

