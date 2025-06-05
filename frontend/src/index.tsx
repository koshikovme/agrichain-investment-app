import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import {WalletContextProvider} from "./features/solana/WalletContextProvider";
// Using the new React 18+ createRoot API
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
        <Provider store={store}>
            {/*<WalletContextProvider>*/}
                <App />
            {/*</WalletContextProvider>*/}
        </Provider>
);