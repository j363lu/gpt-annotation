import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import Form from './components/Form';
import SurveyGUI from './components/SurveyGUI';
import HeroSection from './components/HeroSection';
import Example from './components/Example';
import Footer from './components/Footer';
import reportWebVitals from './reportWebVitals';

import store from './app/store';
import { Provider } from 'react-redux';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// determine the basename of BrowserRouter depending on whether it is production environment
const basename = process.env.NODE_ENV === 'production' ? '/ai-coder' : '';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>

      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<><HeroSection /><Example /><SurveyGUI /><Footer /></>} />
          <Route path="/gui" element={<><SurveyGUI /><Footer /></>} />
        </Routes>
      </BrowserRouter>  
    
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
