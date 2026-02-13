/* Helpers. */
import {
    GET_SITE_SETTINGS_DATA_START,
    GET_SITE_SETTINGS_DATA_SUCCESS,
    GET_SITE_SETTINGS_DATA_ERROR
} from "@/constants/siteSettings";

export const siteSettings = (state = { loader: false }, action) => {
    switch (action.type) {
        case GET_SITE_SETTINGS_DATA_START:
            return { ...state, loader: true };
        case GET_SITE_SETTINGS_DATA_SUCCESS:
            return { ...state, ...action?.payload, loader: false };
        case GET_SITE_SETTINGS_DATA_ERROR:
            return { ...state, loader: false }
        default:
            return state;
    };
};