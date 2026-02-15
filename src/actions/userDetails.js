/* Plugins. */
import { showToast } from "nextjs-toast-notify"

/* Helpers. */
import {
    GET_USER_DETAILS_START,
    GET_USER_DETAILS_SUCCESS,
    GET_USER_DETAILS_ERROR
} from "@/constants/auth";

export const userDetails = () => {
    return async (dispatch) => {
        try {

            dispatch({ type: GET_USER_DETAILS_START });

            const response = await fetch('/api/auth/tokenVerification', { method: 'GET' })
            const result = await response.json();

            if (Number(response?.status) === 200) {
                dispatch({ type: GET_USER_DETAILS_SUCCESS, payload: result?.data });
                return "";
            };

        } catch (error) {
            dispatch({ type: GET_USER_DETAILS_ERROR, payload: error });
            showToast.error(error, { duration: 4000, progress: true, position: "top-right", transition: "bounceIn" });
            return "";
        };
    };
};