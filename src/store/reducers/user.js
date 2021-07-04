import * as actionTypes from '../actionTypes';

const initialState = {
    firstName: null,
    lastName: null,
    username: null,
    email: null
}

const setUser = (state, action) => {
    return {
        ...state,
        firstName: action.firstName,
        lastName: action.lastName,
        username: action.username,
        email: action.email
    }
}

const clearUser = (state, action) => {
    return {
        firstName: null,
        lastName: null,
        username: null,
        email: null
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.USER_SET: return setUser(state, action);
        case actionTypes.USER_CLEAR: return clearUser(state, action);
        default: return state;
    }
}

export default reducer;