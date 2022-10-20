const reducer = (state = null, action) =>{
    switch (action.type) {
        case "changeChainId":
            return action.payload;
        default: 
            return state;
    }
}

export default reducer;