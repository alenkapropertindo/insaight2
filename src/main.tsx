// Safe window.fetch getter/setter trap to prevent platform/extension assignment errors
try {
  let currentFetch = window.fetch;
  
  // Try to define it on Window.prototype if it is an inherited property
  try {
    Object.defineProperty(Window.prototype, "fetch", {
      get() {
        return currentFetch;
      },
      set(newFetch) {
        currentFetch = newFetch;
      },
      configurable: true,
      enumerable: true
    });
  } catch (err) {
    console.warn("Could not patch Window.prototype.fetch:", err);
  }

  // Try to define it on window itself
  try {
    Object.defineProperty(window, "fetch", {
      get() {
        return currentFetch;
      },
      set(newFetch) {
        currentFetch = newFetch;
      },
      configurable: true,
      enumerable: true
    });
  } catch (err) {
    console.warn("Could not patch window.fetch:", err);
  }
} catch (e) {
  console.warn("General error in fetch polyfill:", e);
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
