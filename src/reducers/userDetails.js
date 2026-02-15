/* Helpers. */
import {
    GET_USER_DETAILS_START,
    GET_USER_DETAILS_SUCCESS,
    GET_USER_DETAILS_ERROR
} from "@/constants/auth";

export const userDetails = (state = { loader: false }, action) => {
    switch (action.type) {
        case GET_USER_DETAILS_START:
            return { ...state, loader: true };
        case GET_USER_DETAILS_SUCCESS:
            return { ...state, data: action?.payload, loader: false };
        case GET_USER_DETAILS_ERROR:
            return { ...state, loader: false }
        default:
            return state;
    };
};