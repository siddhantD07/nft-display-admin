const reducer = (state = "", action) =>{
    switch (action.type) {
        case "changeAccount":
            return action.payload;
        default: 
            return state;
    }
}

export default reducer;