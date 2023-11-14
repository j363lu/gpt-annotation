import React from 'react';
import { Survey } from 'survey-react-ui';

const SurveyMemo = React.memo(function SurveyMemo({model}) {
  return (<Survey model={model} />);
});

export default SurveyMemo;