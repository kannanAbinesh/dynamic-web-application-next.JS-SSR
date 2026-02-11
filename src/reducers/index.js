/* Plugins. */
import { configureStore } from "@reduxjs/toolkit";

/* Reducers. */
import { userDetails } from "./userDetails";

export default configureStore({
    reducer: {
        userDetails
    }
});