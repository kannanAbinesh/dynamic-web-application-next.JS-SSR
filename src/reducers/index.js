/* Plugins. */
import { configureStore, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showToast } from "nextjs-toast-notify";

/* Reducers import section. */
import { userDetails } from "./userDetails";

/* Get sitesettings data intially. */
export const fetchSiteSettings = createAsyncThunk('siteSettings/fetch', async (_, { rejectWithValue }) => {
    try {
        const response = await fetch('/api/siteSettings/getSiteSettings');
        if (!response.ok) showToast.error('Something went wrong in retriving the site basic data', { duration: 4000, progress: true, position: "bottom-center", transition: "bounceIn" })
        const result = await response.json();
        return result.data;
    } catch (error) {
        showToast.error('Something went wrong in retriving the site basic data', { duration: 4000, progress: true, position: "bottom-center", transition: "bounceIn" })
        return rejectWithValue(error.message);
    };
});

/* Site settings slice. */
const siteSettingsSlice = createSlice({
    name: 'siteSettings',
    initialState: { data: null, loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSiteSettings.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSiteSettings.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchSiteSettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

/* Store creation using reducers. */
export default configureStore({
    reducer: {
        siteSettings: siteSettingsSlice.reducer,
        userDetails
    }
});