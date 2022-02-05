import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistReducer, persistStore } from 'redux-persist';
import LocalStorage from 'redux-persist/lib/storage';
import promise from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import reducer from './redux/reducers';

const persistConfig = {
  key: 'root',
  storage: LocalStorage,
  whitelist: ['user', 'site', 'ui'],
};

const persistedReducer = persistReducer(persistConfig, reducer);
const composedEnhancers = composeWithDevTools(applyMiddleware(thunk, promise));

export const store = createStore(persistedReducer, composedEnhancers);
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
