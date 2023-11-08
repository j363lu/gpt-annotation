import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import 'survey-core/defaultV2.min.css';
import { DefaultLight } from 'survey-core/themes/default-light';

function SurveyGUI() {
  const surveyJson = {
    "logoPosition": "right",
    "pages": [
     {
      "name": "page1",
      "elements": [
       {
        "type": "text",
        "name": "apiKey",
        "title": "OpenAI API key",
        "description": "Please enter your OpenAI API Key",
        "hideNumber": true,
        "isRequired": true,
        "requiredErrorText": "Please enter an OpenAI API Key",
        "inputType": "password"
       },
       {
        "type": "file",
        "name": "csv",
        "title": "CSV File",
        "description": "Please choose a CSV file",
        "hideNumber": true,
        "isRequired": true,
        "requiredErrorText": "Please choose a CSV file",
        "acceptedTypes": ".csv",
        "waitForUpload": true,
        "needConfirmRemoveFile": true
       },
       {
        "type": "text",
        "name": "column",
        "title": "Column name",
        "description": "Please enter the column name in the CSV file containing text to be annotated",
        "hideNumber": true,
        "isRequired": true,
        "requiredErrorText": "Please specify the column name in the CSV file"
       }
      ],
      "title": "API Key and CSV file"
     },
     {
      "name": "page2",
      "elements": [
       {
        "type": "paneldynamic",
        "name": "features",
        "title": "Features",
        "hideNumber": true,
        "isRequired": true,
        "templateElements": [
         {
          "type": "text",
          "name": "featureName",
          "title": "Feature name",
          "description": "What is the name of the feature?",
          "hideNumber": true,
          "isRequired": true,
          "requiredErrorText": "Please enter the name of the feature"
         },
         {
          "type": "checkbox",
          "name": "models",
          "title": "Models",
          "description": "Which model(s) to use?",
          "hideNumber": true,
          "isRequired": true,
          "requiredErrorText": "Please select at least one model",
          "choices": [
           "gpt-3.5-turbo",
           "gpt-4"
          ],
          "maxSelectedChoices": "",
          "minSelectedChoices": ""
         },
         {
          "type": "radiogroup",
          "name": "classification",
          "title": "Classification type",
          "description": "What is the classification type",
          "hideNumber": true,
          "isRequired": true,
          "requiredErrorText": "Please select a classification type",
          "choices": [
           "Binary",
           "Ordinal"
          ]
         },
         {
          "type": "checkbox",
          "name": "shots",
          "title": "Zero-shot/Few-shot",
          "description": "Zero-shot or Few-shot?",
          "hideNumber": true,
          "isRequired": true,
          "requiredErrorText": "Please select at least one option",
          "choices": [
           "Zero-shot",
           "Few-shot"
          ],
          "maxSelectedChoices": "",
          "minSelectedChoices": ""
         },
         {
          "type": "comment",
          "name": "json",
          "title": "Definition and examples",
          "description": "Please provide JSON for the definition and examples of the feature",
          "hideNumber": true,
          "isRequired": true,
          "requiredErrorText": "Please provide a JSON"
         }
        ],
        "templateTabTitle": "Feature {panelIndex}",
        "panelCount": 1,
        "maxPanelCount": 10,
        "confirmDelete": true,
        "confirmDeleteText": "Do you want to delete the feature?",
        "panelAddText": "New feature",
        "renderMode": "tab",
        "tabAlign": "left"
       }
      ],
      "title": "Features",
      "description": "Select and configure features"
     }
    ],
    "questionErrorLocation": "bottom",
    "showProgressBar": "bottom"
   }
  // survey configurations
  const survey = new Model(surveyJson);
  survey.applyTheme(DefaultLight);

  return (
    <Survey model={survey} />
  );
}

export default SurveyGUI;