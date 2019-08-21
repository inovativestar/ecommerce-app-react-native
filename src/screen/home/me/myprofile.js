import React, { PureComponent } from "react";
import {
  View,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  Text
} from "react-native";

import {
  Card,
  Input,
  ActionSheet
} from "native-base";

import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import ImagePicker from "react-native-image-crop-picker";
import CONFIG from "../../../configs";
import Toast from "../../elements/Toast/lib/Toast";
import { onUserLoginAction } from "../../../redux/actions/action";
import FastImage from 'react-native-fast-image';

const backIco = require("../../../assets/ic_arrow_back_24dp5.png");
const errorIco = require("../../../assets/ic_error_24dp5.png");
const top_bg = require("../../../assets/user_top.png");
const camera_icon = require("../../../assets/ic_nav_camera_24dp.png");

var windowSize = Dimensions.get("window");
var BUTTONS = ["Camera", "Library", "Delete", "Cancel"];
var DESTRUCTIVE_INDEX = 2;
var CANCEL_INDEX = 3;

class MyProfile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      verify_code: "",
      starCount: 0,
      image: null,
      first_name: this.props.user.name,
      last_name: this.props.user.last_name,
      city: this.props.user.city == null ? "" : this.props.user.city,
      postal_code:
        this.props.user.zip_code == null ? "" : this.props.user.zip_code,
      shipping_address:
        this.props.user.address == null ? "" : this.props.user.address,
      email: this.props.user.email,
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

    // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
    setTimeout(function() {
      Toast.hide(toast);
    }, 1800);
  }

  onStarRatingPress = (rating) => {
    this.setState({
      starCount: rating
    });
  }

  onClickCameraButton = () => {
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
        title: "Upload your photo"
      },
      buttonIndex => {
        if (buttonIndex == 0) {
          ImagePicker.openCamera({
            width: 400,
            height: 300,
            cropping: true,
            mediaType: "photo"
          }).then(image => {
            this.setState({
              image: {
                uri: image.path,
                width: image.width,
                height: image.height
              }
            });
          });
        } else if (buttonIndex == 1) {
          ImagePicker.openPicker({
            width: 400,
            height: 300,
            cropping: true,
            mediaType: "photo"
          }).then(image => {
            this.setState({
              image: {
                uri: image.path,
                width: image.width,
                height: image.height
              }
            });
          });
        } else if (buttonIndex == 2) {
          this.setState({
            image: null
          });
        } else if (buttonIndex == 3) {
        }
      },
      (onSelect = index => {
        
      })
    );
  }

  onClickSubmitButton = () => {
    Keyboard.dismiss();

    if (this.state.shipping_address.length === 0) {
      this.show_toast("Please enter the shipping address.");
      return;
    }
    if (this.state.city.length == 0) {
      this.show_toast("Please enter the city.");
      return;
    }
    if (this.state.postal_code.length == 0) {
      this.show_toast("Please enter the postal code.");
      return;
    }

    this.setState({ animating: true });

    const URL = CONFIG.ENDPOINT_OUR + "/api/saveprofile";
    console.log("myprofile.js", "onClickSubmitButton", URL);

    const data = new FormData();
    data.append("first_name", this.state.first_name);
    data.append("last_name", this.state.last_name);
    data.append("email", this.state.email);
    data.append("shipping_address", this.state.shipping_address);
    data.append("postal_code", this.state.postal_code);
    data.append("city", this.state.city);
    data.append("user_id", this.props.user.id);

    if (this.state.image != null)
      data.append("photo", {
        uri: this.state.image.uri,
        type: "image/jpeg", // or photo.type
        name: "photo"
      });

    data.append("Content-Type", "image/png");
    fetch(URL, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data"
      },
      body: data
    })
    .then(response => response.json())
    .then(res => {
        if (res.success == "success") {
          this._getUserdata();
        } else {
          this.setState({ animating: false });
          this.show_toast("Uploading is failed.");
        }
    })
    .catch(error => {
        this.setState({ animating: false });
        this.show_toast("Network error.");
    });
  }

  _getUserdata = () => {
    var API_URL = CONFIG.ENDPOINT_OUR + "/api/userdata";
    console.log("myprofile.js", "_getUserdata", API_URL);
    
    fetch(API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.user.api_token
      },
      body: JSON.stringify({
        phone: this.props.user.mobile_number
      })
    })
    .then(response => response.json())
    .then(responseJson => {
        this.setState({ animating: false });
        if (responseJson.success == "success") {
          this.props.onUserLoginAction(responseJson.user);
          this.show_toast("Successfully Updated!.");
        } else {
          this.show_toast("Network errors.");
        }
    })
    .catch(error => {
        this.setState({ animating: false });
        this.show_toast("Network error.");

        console.error(error);
    });
  }

  _onPressBackIcon = () => {
    Actions.pop();
  }

  _renderUserPhoto = () => {
    if (this.state.image == null) {
      return (
        <FastImage
          source={{ uri: `${CONFIG.ENDPOINT_OUR}${this.props.user.avatar}` }}
          style={{
            width: 70,
            height: 70,
            borderRadius: 70,
            borderColor: "white",
            borderWidth: 1,
            borderRadius: 70
          }}
        />
      );
    } else {
      return (
        <FastImage
          source={this.state.image}
          style={{
            width: 70,
            height: 70,
            borderRadius: 70,
            borderColor: "white",
            borderWidth: 1,
            borderRadius: 70
          }}
        />
      );
    }
  }

  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
        <View style={{ justifyContent: "center" }}>
          <FastImage
            source={top_bg}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: windowSize.width,
              height: 120
            }}
          />
          <View
            style={{
              width: windowSize.width,
              height: 120,
              flexDirection: "column",
              alignItems: "center",
              paddingHorizontal: 10,
              justifyContent: "center",
              position: "relative"
            }}
          >
            <View style={{ alignItems: "center" }}>{this._renderUserPhoto()}</View>
            <TouchableOpacity style={{ marginTop: 5 }}>
              <Text style={{ color: "white", fontWeight: "600" }}>
                {this.props.user.mobile_number}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{ position: "absolute", top: 10, left: 15, zIndex: 50 }}
            onPress={this._onPressBackIcon}
          >
            <FastImage
              source={backIco}
              style={{ width: 25, height: 25 }}
            />
          </TouchableOpacity>
        </View>

        <Card>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 15,
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 5,
              marginTop: 20
            }}
          >
            <Text>First Name:</Text>
            <Input
              value={this.state.first_name}
              style={{
                marginLeft: 10,
                fontSize: 13,
                width: "93%",
                height: 30,
                borderColor: "#e9e9e9",
                borderRadius: 2,
                borderWidth: 1,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 5
              }}
              onChangeText={text => {
                this.setState({ first_name: text });
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 15,
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 5
            }}
          >
            <Text>Last Name:</Text>
            <Input
              value={this.state.last_name}
              style={{
                marginLeft: 10,
                fontSize: 13,
                width: "93%",
                height: 30,
                borderColor: "#e9e9e9",
                borderRadius: 2,
                borderWidth: 1,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 5
              }}
              onChangeText={text => {
                this.setState({ last_name: text });
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 15,
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 5
            }}
          >
            <Text>Email:</Text>
            <Input
              value={this.state.email}
              keyboardType="email-address"
              style={{
                marginLeft: 10,
                fontSize: 13,
                width: "93%",
                height: 30,
                borderColor: "#e9e9e9",
                borderRadius: 2,
                borderWidth: 1,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 5
              }}
              onChangeText={text => {
                this.setState({ email: text });
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 15,
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 5
            }}
          >
            <Text>
              Shipping Address : <Text style={{ color: "red" }}>*</Text>
            </Text>
            <Input
              value={this.state.shipping_address}
              style={{
                marginLeft: 10,
                fontSize: 13,
                width: "93%",
                height: 30,
                borderColor: "#e9e9e9",
                borderRadius: 2,
                borderWidth: 1,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 5
              }}
              onChangeText={text => {
                this.setState({ shipping_address: text });
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 15,
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 5
            }}
          >
            <Text>
              City : <Text style={{ color: "red" }}>*</Text>
            </Text>
            <Input
              value={this.state.city}
              style={{
                marginLeft: 10,
                fontSize: 13,
                width: "93%",
                height: 30,
                borderColor: "#e9e9e9",
                borderRadius: 2,
                borderWidth: 1,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 5
              }}
              onChangeText={text => {
                this.setState({ city: text });
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 15,
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 5
            }}
          >
            <Text>
              Postal Code : <Text style={{ color: "red" }}>*</Text>
            </Text>
            <Input
              value={this.state.postal_code}
              style={{
                marginLeft: 10,
                fontSize: 13,
                width: "93%",
                height: 30,
                borderColor: "#e9e9e9",
                borderRadius: 2,
                borderWidth: 1,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 5
              }}
              onChangeText={text => {
                this.setState({ postal_code: text });
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              marginTop: 30,
              alignItems: "center",
              paddingBottom: 20
            }}
          >
            <TouchableOpacity onPress={this.onClickCameraButton}>
              <FastImage
                source={camera_icon}
                style={{ height: 37, width: 40 }}
              />
            </TouchableOpacity>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 20
              }}
            >
              <Text style={{ color: CONFIG.SECONDARY_COLOR }}>
                Upload your photo
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              paddingBottom: 10,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              onPress={this._onPressBackIcon}
              style={{
                width: "45%",
                alignContent: "center",
                justifyContent: "center",
                height: 35,
                backgroundColor: "#EEE",
                alignItems: "center",
                borderRadius: 3,
                marginRight: 5
              }}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.onClickSubmitButton}
              style={{
                width: "45%",
                height: 35,
                backgroundColor: CONFIG.PRIMARY_COLOR,
                marginLeft: 5,
                alignItems: "center",
                alignContent: "center",
                justifyContent: "center",
                borderRadius: 3
              }}
            >
              <Text style={{ color: "#fff" }}>Save</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              position: "absolute",
              top: windowSize.height / 2 - 150,
              width: windowSize.width,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <ActivityIndicator
              size="large"
              color={CONFIG.Progress_Bar}
              animating={this.state.animating}
              style={{ zIndex: 900 }}
            />
          </View>
        </Card>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#Efefef"
  },

  ActivityIndicatorStyle: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center"
  }
});

function mapStateToProps(state, props) {
  return {
    user: state.rootReducer.user
  };
}

export default connect(
  mapStateToProps,
  { onUserLoginAction }
)(MyProfile);
