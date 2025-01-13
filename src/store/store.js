import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Redux Persist 配置
const persistConfig = {
  key: "root", // 存儲的 key
  storage, // 使用 localStorage
  whitelist: ["auth"], // 僅持久化 authReducer
};

const rootReducer = combineReducers({
  auth: authReducer,
});

// 包裝 Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 忽略 Redux Persist 的非序列化檢查
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
