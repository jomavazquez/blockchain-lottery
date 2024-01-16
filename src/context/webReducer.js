import { types } from "../types/types";

export const webReducer = ( state = {}, action ) => {
    switch( action.type ){
        case types.error:
            return {
                ...state,
                errorMessage: action.payload
            }
        case types.account:
            return {
                ...state,
                account: action.payload
            }
        case types.contract:
            return {
                ...state,
                contract: action.payload
            }
        case types.loading:
            return {
                ...state,
                isLoading: action.payload
            }
        default:
            return state;
    }
}