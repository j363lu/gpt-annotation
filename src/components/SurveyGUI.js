import { Converter } from "showdown";

import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import 'survey-core/defaultV2.min.css';
import { DefaultLight } from 'survey-core/themes/default-light';

import surveyJson from '../json/survey.json'
import { parseSurveyCsv, downloadArrayAsCsv, zeroShotJson, fewShotJson, fewShotOrdinalJson } from '../utils/helperFuncs';
import { getResponse } from '../utils/requestGPT';
import LinearProgressWithLabel from './LinearProgressWithLabel';
import ErrorSnackbar from './ErrorSnackbar';

import { Container } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setProgress } from '../app/progressSlice';
import { setCompleted } from '../app/completedSlice';

// saving survey data to local storage so that particiants can continue on incomplete surveys
const storageItemKey = "gpt-annotations";
function saveSurveyData (survey) {
    const data = survey.data;
    window.localStorage.setItem(storageItemKey, JSON.stringify(data));
}

function SurveyGUI() {
  const dispatch = useDispatch();

  // The page after completed
  const completedHtml = `
  <h4>The CSV file will automatically be downloaded once ready</h4>
  <h4>Please do not refresh or leave the page until the download completes</h4>
  `;

  // given a parsed csv as an array of JSON, process the specified column for the specified
  //   models, zero/few shots and features 
  const process = async (apiKey, parsedCsv, column, features) => {
    let result = [];
    const userPromptBase = await fetch('/ai-coder/prompts/user_base.txt')
    .then(res => res.text());

    const systemPromptBase = await fetch('/ai-coder/prompts/system_base.txt')
    .then(res => res.text());

    const systemPromptBaseOrdinal = await fetch('/ai-coder/prompts/system_base_ordinal.txt')
    .then(res => res.text())

    // for all rows
    for (let i = 0; i < parsedCsv.length; ++i) {
      dispatch(setProgress(i / parsedCsv.length * 100));
      let row = {};
      let text = parsedCsv[i][column];
      text = text.replaceAll('"', "'");
      row.text = `"${text}"`;
      if (!text) continue;

      // for all features
      for (let feature of features) {
        for (let model of feature.models) {
          for (let shot of feature.shots) {
            // construct userPrompt and systemPrompt
            const userPrompt = userPromptBase.replace('<INPUT>', text);
            let systemPrompt = systemPromptBase;

            // construct system prompt depending on shot
            let zeroShot;
            let fewShot;
            if (shot === "Zero-shot") {
              zeroShot = zeroShotJson(feature);
              zeroShot = JSON.stringify(zeroShot);
              systemPrompt = systemPrompt.replace("<CODING GUIDE>", zeroShot);
            } else {
              fewShot = fewShotJson(feature);
              fewShot = JSON.stringify(fewShot);
              systemPrompt = systemPrompt.replace("<CODING GUIDE>", fewShot);
            }

            const promptList = [
              {"role": "system", "content": systemPrompt},
              {"role": "user", "content": userPrompt},
            ];

            // send request to OpenAI
            let res;
            try {
              res = await getResponse(apiKey, promptList, model);
              console.log(res);
              row[`${feature.featureName} ${shot} ${model} code`] = res.code;
              row[`${feature.featureName} ${shot} ${model} explanation`] = `"${res.explanation}"`;    
            } catch (err) {
              res = {code: "NA", explanation: "NA"};
              row[`${feature.featureName} ${shot} ${model} code`] = res.code;
              row[`${feature.featureName} ${shot} ${model} explanation`] = `"${res.explanation}"`;  
              return result;  
            }
            
            /************ further classify present into low and high ************/ 
            if (res.code === "present" && feature.classification === "Ordinal") {
              let systemPromptOrdinal = systemPromptBaseOrdinal;
              let fewShotOrdinal;

              // zero-shot or few-shot
              if (shot === "Zero-shot") {
                systemPromptOrdinal = systemPromptOrdinal.replace("<CODING GUIDE>", zeroShot);
              } else {
                fewShotOrdinal = fewShotOrdinalJson(feature);
                fewShotOrdinal = JSON.stringify(fewShotOrdinal);
                systemPromptOrdinal = systemPromptOrdinal.replace("<CODING GUIDE>", fewShotOrdinal);
              }

              const promptListOrdinal = [
                {"role": "system", "content": systemPromptOrdinal},
                {"role": "user", "content": userPrompt},
              ];

              // send request to OpenAI
              let resOrdinal;
              try {
                resOrdinal = await getResponse(apiKey, promptListOrdinal, model);
                console.log(resOrdinal);
                row[`${feature.featureName} ${shot} ${model} code`] = resOrdinal.code;
                row[`${feature.featureName} ${shot} ${model} explanation`] = `"${resOrdinal.explanation}"`;  
              } catch (err) {
                resOrdinal = {code: "NA", explanation: "NA"};
                row[`${feature.featureName} ${shot} ${model} code`] = resOrdinal.code;
                row[`${feature.featureName} ${shot} ${model} explanation`] = `"${resOrdinal.explanation}"`; 
                return result; 
              }
            }
          }
        }
      }
      result.push(row);
    }
    dispatch(setProgress(100));
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

    complete();
    
  }


  // survey configurations
  const survey = new Model(surveyJson);
  survey.applyTheme(DefaultLight);
  survey.onComplete.add(surveyComplete);
  survey.onComplete.add(() => {dispatch(setCompleted(true))});
  survey.onServerValidateQuestions.add(validate);
  survey.completedHtml = completedHtml;

  // Instantiate Showdown
  const converter = new Converter();
  survey.onTextMarkdown.add(function (survey, options) {
      // Convert Markdown to HTML
      let str = converter.makeHtml(options.text);
      // Remove root paragraphs <p></p>
      str = str.substring(3);
      str = str.substring(0, str.length - 4);
      // Set HTML markup to render
      options.html = str;
  });

  // saving survey data to local storage 
  survey.onValueChanged.add(saveSurveyData);

  // Restore survey results
  const prevData = window.localStorage.getItem(storageItemKey) || null;
  if (prevData) {
    const data = JSON.parse(prevData);
    survey.data = data;
  }

  return (
    <>
    <Survey model={survey} />
    <Container maxWidth="md">
      <LinearProgressWithLabel />
    </Container>
    <ErrorSnackbar />
    </>
  );
}

export default SurveyGUI;