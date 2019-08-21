import React, { PureComponent } from "react";
import { YellowBox } from "react-native";
import { Provider } from "react-redux";

import store from "./redux/stores/store";
import Route from "./Route";

YellowBox.ignoreWarnings(["Warning: ..."]);
console.disableYellowBox = true;

export default class Setup extends PureComponent {
  render() {
    return (
      <Provider store={store}>
        <Route />
      </Provider>
    );
  }
}
