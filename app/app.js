/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Import all the third party stuff
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// Import root app
import App from './containers/App';
import LanguageProvider from 'containers/LanguageProvider';

import configureStore from './configureStore';
import { translationMessages } from './i18n';

// Create redux store with history
const initialState = {};
const { store, persistor } = configureStore(initialState);

function AppRoot() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LanguageProvider messages={translationMessages}>
          <App />
        </LanguageProvider>
      </PersistGate>
    </Provider>
  );
}

export default AppRoot;
