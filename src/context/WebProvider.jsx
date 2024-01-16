import { useReducer } from "react";
import { WebContext } from "./WebContext";
import { webReducer } from "./webReducer";
import { types } from "../types/types";

const init = () => {
    return {
        isLoading: true,
        account: '0x0',
        contract: null,
        errorMessage: ''
    }
}

export const WebProvider = ({ children }) => {

    const [ webState, dispatch ] = useReducer( webReducer, {}, init );

    const sendError = async ( errMessage = '' ) => {
        const action = {
            type: types.error,
            payload: errMessage
        }
        dispatch( action );
    }

    const setAccount = async( account = '0x0' ) => {
        const action = {
            type: types.account,
            payload: account
        }
        dispatch( action );
    }

    const setContract = async( contract ) => {
        const action = {
            type: types.contract,
            payload: contract
        }
        dispatch( action );
    }

    const setLoading = async ( loading = true ) => {
        const action = {
            type: types.loading,
            payload: loading
        }
        dispatch( action );
    }

    return(
        <WebContext.Provider value={{ ...webState, sendError, setAccount, setContract, setLoading }}>
            { children }
        </WebContext.Provider>
    );

}