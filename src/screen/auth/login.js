import React, { PureComponent } from "react";
import {
  View,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Text,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView
} from "react-native";
import {
  Container,
  Content,
  Header,
  Left,
  Right,
  Title,
  Button,
  Form,
  Input,
  Item,
  Thumbnail
} from "native-base";

import axios from "axios";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import Toast from "../elements/Toast/lib/Toast";
import { onUserLoginAction } from "../../redux/actions/action";
import CONFIG from "../../configs";
import FastImage from 'react-native-fast-image';

const bgLogin = require("../../assets/bg_login_in.png");
const logoImg = require("../../assets/ic_login_in_logo.png");
const closeIco = require("../../assets/ic_login_in_close.png");
const errorIco = require("../../assets/ic_error_24dp5.png");

var windowSize = Dimensions.get("window");

class Login extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      phone: "",
      password: "",
      toastVisible: false,
      toastMsg: "Phone number is required",
      loadingBar: false
    };
  }

  show_toast = (str) => {
    var msg = (
      <View style={{ flexDirection: "row" }}>
        <FastImage
          source={errorIco}
          style={{ width: 20, height: 18 }}
        />
        <Text style={{ fontSize: 12, color: "white" }}> {str}</Text>
      </View>
    );
    var toast = Toast.show(msg, {
      duration: Toast.durations.LONG,
      position: windowSize.height - 180,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      onShow: () => {
        // calls on toast\`s appear animation start
      },
      onShown: () => {
        // calls on toast\`s appear animation end.
      },
      onHide: () => {
        // calls on toast\`s hide animation start.
      },
      onHidden: () => {
        // calls on toast\`s hide animation end.
      }
    });

    // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
    setTimeout(function() {
      Toast.hide(toast);
    }, 1800);
  }

  onClickLogin = () => {
    Keyboard.dismiss();
    const phone = this.state.phone;
    if (phone.length == 0) {
      this.show_toast("Phone number is required");
      return;
    } else if (isNaN(phone) || phone.length != 10) {
      this.setState({ toastMsg: "Please enter a valid phone number" });
      this.show_toast("Please enter a valid phone number");
      return;
    }

    if (this.state.password.length == 0) {
      this.setState({ toastMsg: "Password is required" });
      this.show_toast("Password is required");
      return;
    }

    this.setState({ loadingBar: true });
    var API_URL = CONFIG.ENDPOINT_OUR + "/api/login";
    console.log("login.js", "onClickLogin", API_URL);

    fetch(API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: phone,
        password: this.state.password
      })
    })
    .then(response => response.json())
    .then(responseJson => {
        this.setState({ loadingBar: false });
        if (responseJson.success == "success") {
          if (responseJson.user.status != "active") {
            global.phone = phone;
            global.password = this.state.password;
            Actions.Confirm({
              params: {
                from: "login",
                code: "",
                phone: phone,
                api_token: responseJson.user.api_token
              }
            });
            return;
          } else {
            this.props.onUserLoginAction(responseJson.user);
            Actions.Main();
          }
        } else {
          this.show_toast("These credentials  do not match our records");
        }
    })
    .catch(error => {
        this.setState({ loadingBar: false });
        this.show_toast("Network error..");

        console.error(error);
    });
  }

  _pageClose = () => {
    // Actions.Main();

    Actions.pop();
    return;
  }

  _onPressSignUp = () => {
    Actions.SignUp();
  }

  _onPressForgotPassword = () => {
    Actions.Forgotpassword();
  }

  _onPressTerms = () => {
    Actions.Terms();
  }

  _onPressPrivacy = () => {
    Actions.Privecy();
  }

  render() {
    var loginBTn = (
      <TouchableOpacity
        onPress={this.onClickLogin}
        style={{
          borderRadius: 4,
          alignItems: "center",
          backgroundColor: "#F1f1f1",
          shadowRadius: 2,
          shadowOffset: { height: 15, width: 65 }
        }}
      >
        <Text
          style={{
            alignItems: "center",
            padding: 9,
            fontSize: 16,
            color: CONFIG.PRIMARY_COLOR
          }}
        >
          Login
        </Text>
      </TouchableOpacity>
    );

    var progressBar = (
      <ActivityIndicator
        size="large"
        color={CONFIG.Progress_Bar}
        animating={true}
      />
    );

    return (
      <KeyboardAvoidingView
        behavior="height"
        enabled={false}
        style={{
          flex: 1,
          justifyContent: "flex-start",
          flexDirection: "column",
          paddingHorizontal: 27,
          backgroundColor: "#fff"
        }}
      >
        <FastImage
          source={bgLogin}
          style={{
            position: "absolute",
            width: windowSize.width,
            height: windowSize.height
          }}
        />
        <TouchableOpacity
          style={{ position: "absolute", top: 18, right: 13 }}
          onPress={this._pageClose}
        >
          <FastImage source={closeIco} style={{ width: 18, height: 18 }} />
        </TouchableOpacity>
        <View style={styles.logContainer}>
          <FastImage
            source={logoImg}
            style={{ width: 200, height: 120 }}
          />
        </View>
        <View
          style={{
            justifyContent: "flex-start",
            flexDirection: "column",
            marginTop: 5,
            paddingHorizontal: 15
          }}
        >
          <TextInput
            placeholder="Phone Number"
            placeholderTextColor="#b0b0b0"
            style={styles.phoneSt}
            onChangeText={text => {
              this.setState({ phone: text });
            }}
          />
        </View>

        <View
          style={{
            justifyContent: "flex-start",
            flexDirection: "column",
            marginTop: 25,
            paddingHorizontal: 15
          }}
        >
          <TextInput
            placeholder="Password"
            placeholderTextColor="#b0b0b0"
            secureTextEntry
            returnKeyType="done"
            style={styles.phoneSt}
            onChangeText={text => {
              this.setState({ password: text });
            }}
          />
        </View>

        <View
          style={{
            height: 33,
            justifyContent: "flex-start",
            flexDirection: "row",
            marginTop: 5,
            position: "relative",
            paddingHorizontal: 15
          }}
        >
          <TouchableOpacity
            transparent
            onPress={this._onPressSignUp}
            style={{ top: 5, left: 15, position: "absolute" }}
          >
            <Text style={{ color: "#FFF", fontSize: 13 }}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            transparent
            onPress={this._onPressForgotPassword}
            style={{ top: 5, right: 10, position: "absolute" }}
          >
            <Text style={{ color: "#FFF", fontSize: 12 }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            height: 45,
            justifyContent: "flex-start",
            flexDirection: "column",
            marginTop: 6,
            paddingHorizontal: 15
          }}
        >
          {this.state.loadingBar ? progressBar : loginBTn}
        </View>

        <View style={styles.bottomCotainer}>
          <Text style={styles.agreeST}> By signing up, you agree to our</Text>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              marginTop: 2
            }}
          >
            <TouchableOpacity
              onPress={this._onPressTerms}
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <Text
                style={{
                  fontSize: 13,
                  color: "#EEE",
                  textDecorationLine: "underline",
                  marginRight: 5
                }}
              >
                Terms of Use
              </Text>
            </TouchableOpacity>
            <Text style={styles.agreeST}>&</Text>
            <TouchableOpacity
              onPress={this._onPressPrivacy}
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <Text
                style={{
                  fontSize: 13,
                  color: "#EEE",
                  textDecorationLine: "underline",
                  marginLeft: 5
                }}
              >
                Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
const styles = StyleSheet.create({
  logContainer: {
    flex: 0.5,
    position: "relative",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10
  },
  phoneSt: {
    fontSize: 15,
    width: "100%",
    height: 40,
    backgroundColor: "#e8e9e9",
    opacity: 0.6,
    // borderColor:"#e9e9e9",
    borderRadius: 5,
    borderWidth: 0,
    paddingTop: 10,
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: "center",
    justifyContent: "center",
    color: "#000"
  },
  bottomCotainer: {
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    position: "absolute",
    bottom: 0,
    marginBottom: 25,
    paddingHorizontal: 15,

    width: windowSize.width
  },
  agreeST: {
    color: "#FFF",
    opacity: 0.5,
    fontSize: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  progressBarContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginTop: windowSize.height / 2,
    width: windowSize.width
  }
});

/**
function mapStateToProps(state, props) {
    return {
        user: state.rootReducer.user,
    }
}
*/

//Connect everything
export default connect(
  null,
  { onUserLoginAction }
)(Login);
//export default Login;
