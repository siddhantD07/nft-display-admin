const reducer = (state = {}, action) =>{
    switch (action.type) {
        case "changeWeb3Instance":
            return action.payload;
        default: 
            return state;
    }
}

export default reducer;