import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import 'survey-core/defaultV2.min.css';
import { DefaultLight } from 'survey-core/themes/default-light';

import surveyJson from '../json/survey.json'
import { parseSurveyCsv, downloadArrayAsCsv } from '../utils/helperFuncs';
import { getResponse, validateKey } from '../utils/requestGPT';

// saving survey data to local storage so that particiants can continue on incomplete surveys
const storageItemKey = "gpt-annotations";
function saveSurveyData (survey) {
    const data = survey.data;
    window.localStorage.setItem(storageItemKey, JSON.stringify(data));
}

function SurveyGUI() {
  // given a parsed csv as an array of JSON, process the specified column for the specified
  //   models, zero/few shots and features 
  const process = async (apiKey, parsedCsv, column, features) => {
    let result = [];
    const userPromptBase = await fetch('/prompts/user_base.txt')
    .then(res => res.text());

    const systemPromptBase = await fetch('/prompts/system_base.txt')
    .then(res => res.text());

    // for all rows
    for (let i = 0; i < parsedCsv.length; ++i) {
      let row = {};
      const text = parsedCsv[i][column];
      row.text = text;
      if (!text) continue;

      // for all features
      for (let feature of features) {
        for (let model of feature.models) {
          for (let shot of feature.shots) {
            // construct userPrompt and systemPrompt
            const userPrompt = userPromptBase.replace('<INPUT>', text);
            let systemPrompt = systemPromptBase;
            const zeroShotJson = JSON.stringify(JSON.parse(feature.zeroShot));
            const fewShotJson = JSON.stringify(JSON.parse(feature.fewShot));

            if (shot === "Zero-shot") {
              systemPrompt = systemPrompt.replace("<CODING GUIDE>", zeroShotJson);
            } else {
              systemPrompt = systemPrompt.replace("<CODING GUIDE>", fewShotJson);
            }

            const promptList = [
              {"role": "system", "content": systemPrompt},
              {"role": "user", "content": userPrompt},
            ];

            // send request to OpenAI
            const res = await getResponse(apiKey, promptList, model);
            console.log(res);
            row[`${feature.featureName} ${shot} ${model} code`] = res.code;
            row[`${feature.featureName} ${shot} ${model} explanation`] = res.explanation;
            // await new Promise(r => setTimeout(r, 20000));  // wait            
          }
        }
      }
      result.push(row);
    }
    return result;
  }

  // send requests to openAI
  const surveyComplete = async (sender) => {
    console.log(sender.data);

    const {apiKey, column, features} = sender.data;
    const csv = sender.data.csv[0];
    const parsedCsv = await parseSurveyCsv(csv);
    console.log(parsedCsv);

    const result = await process(apiKey, parsedCsv, column, features);
    downloadArrayAsCsv(result, "result");
  }

  // validate the data on complete
  const validate =  async (survey, { data, errors, complete }) => {
    // validate the api key
    // const apiKey = data["apiKey"];
    // if (apiKey) {
    //   try {
    //     await validateKey(apiKey);
    //   } catch (err) {
    //     errors["apiKey"] = err.message;
    //   }
    // }

    // validate csv and column
    if (data.csv && data.csv[0] && data.column) {
      // validate file type
      if (data.csv[0].type !== "text/csv") {
        errors["csv"] = "Please provide a CSV file"
      } else {
        // validate column name
        let parsedCsv;
        try {
          parsedCsv = await parseSurveyCsv(data.csv[0]);
          if (!parsedCsv || !parsedCsv[0]) errors["csv"] = "The CSV file is empty"
        } catch (err) {
          errors["csv"] = "Please provide a valid CSV file";
        }
  
        if (parsedCsv && parsedCsv[0] && !(data.column in parsedCsv[0])) {
          errors["column"] = "The column is not in the csv file";
        }
      }
    }

    // validate JSON
    if (data.features) {
      for (let i = 0; i < data.features.length; ++i) {
        const zeroShot = data.features[i].zeroShot;
        const fewShot = data.features[i].fewShot;
  
        try {
          JSON.parse(zeroShot);
        } catch (err) {
          errors["features"] = "Please provide a valid JSON for Zero-shot JSON";
        }
  
        try {
          JSON.parse(fewShot);
        } catch (err) {
          errors["features"] = "Please provide a valid JSON for Few-shot JSON";
        }
      }
    }

    complete();
    
  }


  // survey configurations
  const survey = new Model(surveyJson);
  survey.applyTheme(DefaultLight);
  survey.onComplete.add(surveyComplete);
  survey.onServerValidateQuestions.add(validate);

  // saving survey data to local storage 
  survey.onValueChanged.add(saveSurveyData);

  // Restore survey results
  const prevData = window.localStorage.getItem(storageItemKey) || null;
  if (prevData) {
    const data = JSON.parse(prevData);
    survey.data = data;
  }

  return (
    <Survey model={survey} />
  );
}

export default SurveyGUI;