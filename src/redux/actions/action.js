import { AsyncStorage, Platform, Alert } from "react-native";

import { Actions } from "react-native-router-flux";
//import { Toast } from "native-base";
import axios from "axios";
//import DeviceInfo from "react-native-device-info";
import CONFIG from "../../configs";
//import Check from "./check";

export function onLoadingAction() {
  return dispatch => {
    const URL = CONFIG.ENDPOINT_OUR + "/api/getalldata";
    console.log("action.js", "onLoadingAction", URL);
    
    axios
      .get(URL)
      .then(res => {
        // var res=res.json();
        var upcoming_data = res.data.upcoming.data;
        //upcoming_data.splice(10);

        var itembypricedesc_data = res.data.itembypricedesc.data;
        var newlist_data = res.data.newlist.data;
        //newlist_data.splice(10);

        var itembypriceasc_data = res.data.itembypriceasc.data;
        var reviews_data = res.data.reviews.data;
        var record_data = res.data.record.data;
        var slide = res.data.slide;

        AsyncStorage.getItem("user")
          .then(value => {
            dispatch({
              type: "onLoadingAction",
              loading: false,
              user: JSON.parse(value),
              upcoming: upcoming_data,
              itembypricedesc: itembypricedesc_data,
              newlist: newlist_data,
              itembypriceasc: itembypriceasc_data,
              reviews: reviews_data,
              record: record_data,
              slide: slide
            });
          })
          .done();
      })
      .catch(error => {
        console.log(error);
        dispatch({
          type: "onLoadingAction",
          loading: false,
          user: null,
          upcoming: [],
          itembypricedesc: [],
          newlist: [],
          itembypriceasc: [],
          reviews: [],
          record: [],
          slide: []
        });
      });
  };
}
export function onUserLoginAction(User) {
  return dispatch => {
    dispatch({
      type: "onUserLoginAction",
      user: User
    });
    // global.user = User;
    AsyncStorage.setItem("user", JSON.stringify(User));
  };
}

export function onLogOutAction() {
  return dispatch => {
    dispatch({
      type: "onLogOutAction",
      user: null
    });
    global.user = null;
    AsyncStorage.removeItem("user");
  };
}

export function onInitialAction() {
  return dispatch => {
    dispatch({
      type: "onInitialAction",
      loading: true
    });
  };
}

export function onMoveTab(tabIndex = 0) {
  return dispatch => {
    dispatch({
      type: "onMoveTab",
      tabIndex: tabIndex
    });
  };
}

export function onGetUserData(phone = 0, api_token = "") {
  return dispatch => {
    var API_URL = CONFIG.ENDPOINT_OUR + "/api/userdata";
    console.log("action.js", "onGetUserData", API_URL);
    
    fetch(API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + api_token
      },
      body: JSON.stringify({
        phone: phone
      })
    })
    .then(response => response.json())
    .then(responseJson => {
        if (responseJson.success == "success") {
          AsyncStorage.setItem("user", JSON.stringify(responseJson.user));
          dispatch({
            type: "onGetUserData",
            user: responseJson.user
          });
        } else {
          dispatch({
            type: "onGetUserData",
            user: null
          });
          AsyncStorage.removeItem("user");
        }
    })
    .catch(error => {
        console.error(error);
    });
  };
}
