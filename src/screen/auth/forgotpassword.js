import React, { PureComponent } from "react";
import {
  View,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Keyboard
} from "react-native";
import {
  Container,
  Content,
  Header,
  Body,
  Left,
  Right,
  Title,
  Button,
  Text
} from "native-base";

import { Actions } from "react-native-router-flux";
import CONFIG from "../../configs";
import Toast from "../elements/Toast/lib/Toast";
import FastImage from 'react-native-fast-image';

const backIco = require("../../assets/bg_back_arrow.png");
const errorIco = require("../../assets/ic_error_24dp5.png");

var windowSize = Dimensions.get("window");

class Forgotpassword extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      verify_code: "",
      code: "",
      phone: "",
      animating: false
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

    setTimeout(function() {
      Toast.hide(toast);
    }, 2000);
  }

  onSubmit = () => {
    Keyboard.dismiss();
    const phone = this.state.phone;
    if (phone.length == 0) {
      this.show_toast("Phone number is required");
      return;
    } else if (isNaN(phone) || phone.length != 10) {
      this.show_toast("Please enter a valid phone number");
      return;
    }

    this.setState({ animating: true });

    var API_URL = CONFIG.ENDPOINT_OUR + "/api/resend";
    console.log("forgotpassword.js", "onSubmit", API_URL);

    fetch(API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        phone: phone
      })
    })
    .then(response => response.json())
    .then(responseJson => {
        this.setState({ animating: false });
        if (responseJson.success == "success") {
          this.setState({ code: responseJson.verify_code });
          //this.show_toast(responseJson.verify_code);
          Actions.Resetpassword({
            params: {
              from: "forgotpassword",
              code: responseJson.verify_code,
              phone: this.state.phone
            }
          });
          //this.props.onUserLoginAction(responseJson.user)
        } else {
          this.show_toast(responseJson.msg);
        }
    })
    .catch(error => {
        this.setState({ animating: false });
        this.show_toast("Network error..");

        console.error(error);
    });
  }

  componentDidMount() {}

  _onPressBackIcon = () => {
    Actions.pop();
  }

  render() {
    return (
      <Container style={{ backgroundColor: "#fff" }}>
        <Header style={{ height: 50, backgroundColor: "white" }}>
          <Left>
            <Button transparent onPress={this._onPressBackIcon}>
              <FastImage
                source={backIco}
                style={{ width: 15, height: 12 }}
              />
            </Button>
          </Left>
          <Body>
            <Title style={{ color: CONFIG.PRIMARY_COLOR, fontSize: 15 }}>
              RETRIEVE PASSWORD
            </Title>
          </Body>
        </Header>
        <Content>
          <View style={{ padding: 20, marginBottom: 10, paddingRight: 40 }}>
            <Text
              style={{
                marginTop: 20,
                marginBottom: 5,
                fontSize: 13,
                color: CONFIG.SECONDARY_COLOR
              }}
            >
              Forgot your password?
            </Text>
            <Text
              numberOfLines={2}
              style={{
                marginTop: 5,
                marginBottom: 5,
                fontSize: 13,
                color: CONFIG.SECONDARY_COLOR
              }}
            >
              Enter your phone number below and we'll send you instructions to
              reset your passwrod?
            </Text>
          </View>

          <View style={{ paddingHorizontal: 20 }}>
            <TextInput
              placeholder="Phone number"
              placeholderTextColor="#b0b0b0"
              style={{
                fontSize: 13,
                height: 35,
                color: "#333333",
                borderColor: CONFIG.PRIMARY_COLOR,
                borderWidth: 1,
                textAlignVertical: "center",
                paddingHorizontal: 10
              }}
              onChangeText={text => {
                this.setState({ phone: text });
              }}
            />
          </View>

          <View
            style={{
              paddingHorizontal: 20,
              flexDirection: "row",
              marginTop: 20
            }}
          >
            <TouchableOpacity
              onPress={this.onSubmit}
              style={{
                borderRadius: 2,
                alignItems: "center",
                flex: 1,
                backgroundColor: CONFIG.PRIMARY_COLOR,
                shadowRadius: 3,
                shadowOffset: { height: 15, width: 65 }
              }}
            >
              <Text
                style={{
                  alignItems: "center",
                  padding: 9,
                  fontSize: 16,
                  color: "#FFF"
                }}
              >
                Submit
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 20 }}>
            <ActivityIndicator
              size="large"
              color={CONFIG.Progress_Bar}
              animating={this.state.animating}
            />
          </View>
        </Content>
      </Container>
    );
  }
}
export default Forgotpassword;
