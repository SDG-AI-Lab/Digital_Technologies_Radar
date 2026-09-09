import * as React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import { App } from './App';
import { initGlitchTip } from './helpers/glitchtip';
import reportWebVitals from './reportWebVitals';

initGlitchTip();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// For performance measuring see: https://bit.ly/CRA-vitals
reportWebVitals((metric) => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.debug('[web-vitals]', metric.name, metric.value);
  }
});
