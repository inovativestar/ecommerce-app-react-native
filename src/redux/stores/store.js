import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import Reducer from '../reducers/reducer'; //Import the reducer

// Connect our store to the reducers
export default createStore(Reducer, applyMiddleware(thunk));