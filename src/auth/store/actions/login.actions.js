import authService from 'services/auth';
import menuService from '../../../services/menu';
import {ADD_AUTH_NAVIGATION} from "../../../store/actions/fuse";

export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT';
export const CHANGE_REGION_ID = 'CHANGE_REGION_ID';
export const LOGIN_START = 'LOGIN_START';
export const CLOSE_ALERT_DIALOG = 'CLOSE_ALERT_DIALOG';
export const INITIALIZE_FROM_LOCAL = 'INITIALIZE_FROM_LOCAL';
export const LOADED_MENU = 'LOADED_MENU';

export function submitSignIn(email, password)  {
    return (dispatch) => {
        dispatch({
            type: LOGIN_START,
            payload: true
        });
        (async () => {
            let res = await authService.authSignin(email, password);
            if (res.IsSuccess) {

                let navigations = await menuService.loadAccountMenu();
                console.log('load_nav = ' , navigations);
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: res
                });
                dispatch({
                    type: ADD_AUTH_NAVIGATION,
                    payload: navigations
                });
            } else {
                dispatch({
                    type: LOGIN_ERROR,
                    payload: res.response.data.Message
                })
            }
        })();
    }
}

export function changeRegionId (id){
    return (dispatch) => {
        dispatch({
            type: CHANGE_REGION_ID,
            payload: id
        });
    }
}

export function loadedMenu (){
    return (dispatch) => {
        (async () => {
                let navigations = await menuService.loadAccountMenu();
                dispatch({
                    type: ADD_AUTH_NAVIGATION,
                    payload: navigations
                });

            dispatch({
                type: LOADED_MENU,
                payload: true
            });

        })();
    }

}


export function logoutUser () {
    authService.logout();
    return (dispatch) => {
        dispatch({
            type: USER_LOGGED_OUT
        });
    }
}

export function closeDialog() {
    return (dispatch) => {
        dispatch({
            type: CLOSE_ALERT_DIALOG
        });
    }
}
