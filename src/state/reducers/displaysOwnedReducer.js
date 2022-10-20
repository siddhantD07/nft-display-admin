const reducer = (state = [], action) =>{
    switch (action.type) {
        case "changeDisplaysOwned":
            return action.payload;
        default: 
            return state;
    }
}

export default reducer;