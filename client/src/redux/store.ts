import { configureStore } from "@reduxjs/toolkit";

import authReducer from './authSlice'
import { authQuery } from "../api/authQuery";
import { vaccineQuery } from "../api/vaccineQuery";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

const store = configureStore({
    reducer: {
        authReducer, [authQuery.reducerPath]: authQuery.reducer,
        [vaccineQuery.reducerPath]: vaccineQuery.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authQuery.middleware, vaccineQuery.middleware)
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
setupListeners(store.dispatch);

export default store;