import { combineReducers } from "redux";

const initialState = {
  // global
  user: null,
  loading: true,
  AllData: null,
  upcoming: [], // comming soon,
  newlist: [], //newlist
  itembyprice: [], //items by price
  tabIndex: 0
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "onLoadingAction":
      state = Object.assign({}, state, {
        loading: action.loading,
        user: action.user,
        upcoming: action.upcoming,
        newlist: action.newlist,
        itembypricedesc: action.itembypricedesc,
        itembypriceasc: action.itembypriceasc,
        reviews: action.reviews,
        record: action.record,
        slide: action.slide
      });
      //console.log("reducer", "onLoadingAction", state);
      return state;

    case "onUserLoginAction":
      state = Object.assign({}, state, {
        user: action.user
      });
      //console.log("reducer", "onUserLoginAction", state);
      return state;

    case "onLogOutAction":
      state = Object.assign({}, state, {
        user: null
      });
//      console.log("reducer", "onLogOutAction", state);
      return state;

    case "onInitialAction":
      state = Object.assign({}, state, {
        loading: action.loading
      });
      return state;

    case "onMoveTab":
      state = Object.assign({}, state, {
        tabIndex: action.tabIndex
      });
      return state;

    case "onGetUserData":
      state = Object.assign({}, state, {
        user: action.user
      });
      return state;

    default:
      return state;
  }
};

const Reducer = combineReducers({
  rootReducer
});

export default Reducer;
