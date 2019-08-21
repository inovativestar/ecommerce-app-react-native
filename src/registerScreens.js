import { Navigation } from "react-native-navigation";
import * as app from "./app";

const registerScreens = () => {
  Navigation.registerComponent("splash", () => app.LoginScreen);
};

export default registerScreens;
