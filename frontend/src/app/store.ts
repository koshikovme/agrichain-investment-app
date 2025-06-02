import { configureStore } from '@reduxjs/toolkit';

import {rootReducer} from "./reducer";

export const store = configureStore({
    reducer: {
        reducer: rootReducer,
    },
});

// Экспорт типов для использования типизированных хуков
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
