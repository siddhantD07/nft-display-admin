import { combineReducers } from "redux";

import accountReducer from "./accountReducer";
import providerReducer from "./providerReducer";
import web3InstanceReducer from "./web3InstanceReducer";
import chainIdReducer from "./chainIdReducer";
import contractReducer from "./contractReducer";
import displaysOwnedReducer from "./displaysOwnedReducer";

const reducers = combineReducers({
    account: accountReducer,
    provider: providerReducer,
    web3Instance: web3InstanceReducer,
    chainId: chainIdReducer,
    contract: contractReducer,
    displaysOwned: displaysOwnedReducer,
});

export default reducers;