const reducer = (state = null, action) =>{
    switch (action.type) {
        case "changeContract":
            return action.payload;
        default: 
            return state;
    }
}

export default reducer;