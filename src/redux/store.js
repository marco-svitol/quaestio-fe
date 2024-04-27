import { configureStore } from "@reduxjs/toolkit";
import loginReducer from './loginSlice.js';
import userProfileReducer from './userProfileSlice.js';
import searchReducer from './searchSlice.js';
import favouritesReducer from './favouritesSlice.js';
import sectionReducer from './sectionSlice.js';
import lastCallReducer from './lastCallSlice.js';
import favLastCallReducer from "./favLastCallSlice.js";

const store = configureStore({
    reducer: {
        login: loginReducer,
        userProfile: userProfileReducer,
        search: searchReducer,
        favourites: favouritesReducer,
        section: sectionReducer,
        lastCall: lastCallReducer,
        favLastCall: favLastCallReducer
    }
})

export default store;