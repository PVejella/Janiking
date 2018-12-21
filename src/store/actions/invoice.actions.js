import axios from "axios";

export const GET_ALL_INVOICES = "[INVOICES] GETS ALL";
export const OPEN_SUMMARY_PANEL = "[INVOICES] OPEN SUMMARY PANEL";
export const CLOSE_SUMMARY_PANEL = "[INVOICES] CLOSE SUMMARY PANEL";
export const OPEN_FILTER_PANEL = "[INVOICES] OPEN FILTER PANEL";
export const CLOSE_FILTER_PANEL = "[INVOICES] CLOSE FILTER PANEL";
export const TOGGLE_FILTER_STATUS = "[INVOICES] TOGGLE FILTER STATUS";

export function getInvoices() {
    return dispatch => {
        const request = axios.get("/api/invoices/gets");

        return request.then(response => {
            return dispatch({
                type: GET_ALL_INVOICES,
                payload: response.data
            });
        });
    };
}

export function openSummaryPanel(){
    return {
        type: OPEN_SUMMARY_PANEL
    }
}
export function closeSummaryPanel(){
    return {
        type: CLOSE_SUMMARY_PANEL
    }
}

export function openFilterPanel(){
    return {
        type: OPEN_FILTER_PANEL
    }
}
export function closeFilterPanel(){
    return {
        type: CLOSE_FILTER_PANEL
    }
}

export function toggleStatus(key, status){
    return {
        type: TOGGLE_FILTER_STATUS,
        payload: {[key]: status}
    }
}
