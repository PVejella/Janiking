import axios from "axios";

export const GET_ALL_INVOICES = "[INVOICES] GETS ALL";
export const DELETE_SELECTED_INVOICES = "[INVOICES] DELETE SELECTED";
export const REMOVE_SELECTED_INVOICE = "[INVOICE] REMOVE SELECTED";
export const TOGGLE_SUMMARY_PANEL = "[INVOICES] TOGGLE SUMMARY PANEL";
export const TOGGLE_FILTER_STATUS = "[INVOICES] TOGGLE FILTER STATUS";
export const TOGGLE_FILTER_PANEL = "[INVOICES] TOGGLE FILTER PANEL";
// for Add/Edit
export const OPEN_NEW_INVOICE_FORM = '[INVOICES APP] OPEN NEW INVOICE FORM';
export const CLOSE_NEW_INVOICE_FORM = '[INVOICES APP] CLOSE NEW INVOICE FORM';
export const OPEN_EDIT_INVOICE_FORM = '[INVOICES APP] OPEN EDIT INVOICE FORM';
export const CLOSE_EDIT_INVOICE_FORM = '[INVOICES APP] CLOSE EDIT INVOICE FORM';
export const ADD_INVOICE = '[INVOICES APP] ADD INVOICE';
export const UPDATE_INVOICE = '[INVOICES APP] UPDATE INVOICE';
export const UPDATE_INVOICE_LINE = '[INVOICES APP] UPDATE INVOICE LINE';


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

export function toggleFilterPanel(){
    return {
        type: TOGGLE_FILTER_PANEL
    }
}

export function toggleSummaryPanel(){
    return {
        type: TOGGLE_SUMMARY_PANEL
    }
}

export function toggleStatus(key, status){
    return {
        type: TOGGLE_FILTER_STATUS,
        payload: {[key]: status}
    }
}


export function deleteInvoices(keys, invoices) {
    return dispatch => {
        const request = axios.post("/api/invoices/delete", { ids: keys, invoices: invoices });

        return request.then(response => {
            return dispatch({
                type: DELETE_SELECTED_INVOICES,
                payload: response.data
            });
        });
    };
}

export function removeInvoice(key, invoices) {
    return dispatch => {
        const request = axios.post("/api/invoices/remove", { id: key, invoices: invoices });

        return request.then(response => {
            return dispatch({
                type: REMOVE_SELECTED_INVOICE,
                payload: response.data
            });
        });
    };
}

export function openNewInvoiceForm()
{
    return {
        type: OPEN_NEW_INVOICE_FORM
    }
}

export function closeNewInvoiceForm()
{
    return {
        type: CLOSE_NEW_INVOICE_FORM
    }
}

export function openEditInvoiceForm(data)
{
    return {
        type: OPEN_EDIT_INVOICE_FORM,
        data
    }
}

export function closeEditInvoiceForm()
{
    return {
        type: CLOSE_EDIT_INVOICE_FORM
    }
}

export function addInvoice(newInvoice)
{
    return (dispatch, getState) => {

        console.log('state', getState());

        // const {routeParams} = getState().contactsApp.contacts;

        const request = axios.post('/api/contacts-app/add-contact', {
            newInvoice
        });

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: ADD_INVOICE
                })
            ]).then(() => dispatch(getInvoices()))
        );
    };
}

export function updateInvoice(invoice)
{
    return (dispatch, getState) => {

        // const {routeParams} = getState().contactsApp.contacts;

        const request = axios.post('/api/contacts-app/update-contact', {
            invoice
        });

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: UPDATE_INVOICE
                })
            ]).then(() => dispatch(getInvoices()))
        );
    };
}

export function updateInvoiceLine(data) {
    return {
        type: UPDATE_INVOICE_LINE,
        payload: data
    }
}
