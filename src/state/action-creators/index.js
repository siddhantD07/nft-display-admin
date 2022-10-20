export const setAccount = (address) => {
    return (dispatch) => {
        dispatch({
            type: "changeAccount",
            payload: address
        })
    }
}


export const setProvider = (provider) =>{
    return (dispatch) =>{
        dispatch({
            type: "changeProvider",
            payload: provider
        })
    }
}

export const setWeb3Instance = (web3Instance) =>{
    return (dispatch) =>{
        dispatch({
            type: "changeWeb3Instance",
            payload: web3Instance
        })
    }
}

export const setChainId = (chainId) =>{
    return (dispatch) =>{
        dispatch({
            type: "changeChainId",
            payload: chainId
        })
    }
}


export const setContract = (contract) =>{
    return (dispatch) =>{
        dispatch({
            type: "changeContract",
            payload: contract
        })
    }
}

export const setDisplaysOwned = (displays) =>{
    return (dispatch) =>{
        dispatch({
            type: "changeDisplaysOwned",
            payload: displays
        })
    }
}