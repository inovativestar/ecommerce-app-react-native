import React, { PureComponent } from "react";
import {
  View,
  StatusBar,
  Keyboard,
  TouchableOpacity,
  Dimensions,
  Text,
  KeyboardAvoidingView
} from "react-native";

import {
  Content,
  Header,
  Body,
  Left,
  Card,
  Textarea,
  Title,
  Button,
  ActionSheet
} from "native-base";

import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import ImagePicker from "react-native-image-crop-picker";
import CONFIG from "../../../configs";
import Toast from "../../elements/Toast/lib/Toast";
import StarRating from "react-native-star-rating";
import FastImage from 'react-native-fast-image';

const backIco = require("../../../assets/bg_back_arrow.png");
const errorIco = require("../../../assets/ic_error_24dp5.png");
const camera_icon = require("../../../assets/ic_nav_camera_24dp.png");

var windowSize = Dimensions.get("window");
var BUTTONS = ["Camera", "Library", "Delete", "Cancel"];
var DESTRUCTIVE_INDEX = 2;
var CANCEL_INDEX = 3;

class FeedbackWrite extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      verify_code: "",
      starCount: 0,
      description: "",
      img1: null,
      img2: null,
      camera_sel: 0
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
        title: "Upload the image(Max 2 files)"
      },
      buttonIndex => {
        if (buttonIndex == 0) {
          ImagePicker.openCamera({
            width: 400,
            height: 300,
            cropping: true,
            mediaType: "photo"
          }).then(image => {
            if (this.state.camera_sel == 0) {
              this.setState({ camera_sel: 1 });
              this.setState({
                img1: {
                  uri: image.path,
                  width: image.width,
                  height: image.height
                }
              });
            } else {
              this.setState({ camera_sel: 0 });
              this.setState({
                img2: {
                  uri: image.path,
                  width: image.width,
                  height: image.height
                }
              });
            }
          });
        } else if (buttonIndex == 1) {
          ImagePicker.openPicker({
            width: 400,
            height: 300,
            cropping: true,
            mediaType: "photo",
            multiple: true
          }).then(image => {
            image.map((info, index) => {
              if (index == 0)
                this.setState({
                  img1: {
                    uri: info.path,
                    width: info.width,
                    height: info.height
                  }
                });
              else if (index == 1) {
                this.setState({
                  img2: {
                    uri: info.path,
                    width: info.width,
                    height: info.height
                  }
                });
              }
            });
          });
        } else if (buttonIndex == 2) {
          this.setState({
            img1: null,
            img2: null
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

    if (this.state.description.length === 0) {
      this.show_toast("Please enter the feedback.");
      return;
    }
    if (this.state.description.length > 1000) {
      this.show_toast("The feedback is the max 1000 characters");
      return;
    }

    if (this.state.img1 == null) {
      var image_url_1 = null;
    } else {
      var image_url_1 = this.state.img1.uri;
    }

    if (this.state.img2 == null) {
      var image_url_2 = null;
    } else {
      var image_url_2 = this.state.img2.uri;
    }

    const URL = CONFIG.ENDPOINT_OUR + "/api/givereview";
    console.log("feebackWrite.js", "onClickSubmitButton", URL);

    const data = new FormData();
    data.append("userid", this.props.user.id);
    data.append("sid", this.props.params.obj.sid);
    data.append("product_id", this.props.params.obj.id);
    data.append("mobile_number", this.props.user.mobile_number);
    data.append("user_email", this.props.user.email);
    data.append("user_photo", this.props.user.avatar);
    data.append("score", this.state.starCount);
    data.append("feedback", this.state.description);

    if (this.state.img1 != null)
      data.append("photo[0]", {
        uri: image_url_1,
        type: "image/jpeg", // or photo.type
        name: "photo"
      });
    if (this.state.img2 != null)
      data.append("photo[1]", {
        uri: image_url_2,
        type: "image/jpeg", // or photo.type
        name: "photo2"
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
          this.show_toast("Successed!");
          Actions.pop();
          Actions.pop();
          Actions.MyReview();
        } else {
          this.show_toast("Uploading is failed.");
        }
    })
    .catch(error => {
        this.show_toast("Uploading is failed.");
    });
  }

  _onPressBackIcon = () => {
    Actions.pop();
  }

  _onFocusReviewText = () => {
    this.setState({ placeholder_str: "" });
  }

  _onChangeTextReview = (text) => {
    this.setState({ description: text });
  }

  render() {
    return (
      <KeyboardAvoidingView
        style={{ backgroundColor: "#EEE", flex: 1 }}
        behavior="height"
        enabled={false}
      >
        <StatusBar
          backgroundColor="#000"
          barStyle="dark-content"
          translucent={false}
        />
        <Header
          style={{
            height: 50,
            backgroundColor: "white",
            borderBottomColor: CONFIG.SECONDARY_COLOR,
            borderBottomWidth: 1
          }}
        >
          <Left>
            <Button transparent onPress={this._onPressBackIcon}>
              <FastImage
                source={backIco}
                style={{ width: 15, height: 12 }}
              />
            </Button>
          </Left>
          <Body>
            <Title
              style={{
                marginLeft: 26,
                color: CONFIG.PRIMARY_COLOR,
                fontSize: 15
              }}
            >
              Review
            </Title>
          </Body>
        </Header>

        <Content>
          <Card>
            <View
              style={{
                paddingVertical: 10,
                paddingHorizontal: 10,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  lineHeight: 21,
                  width: windowSize.width - 40,
                  color: CONFIG.SECONDARY_COLOR
                }}
                numberOfLines={2}
              >
                {this.props.params.obj.title}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 15,
                marginTop: 30
              }}
            >
              <Text style={{ color: CONFIG.COLOR_BUTTON_TITLE }}>Rating: </Text>
              <View style={{ alignItems: "center", marginLeft: 20 }}>
                <StarRating
                  disabled={false}
                  maxStars={5}
                  starSize={20}
                  rating={this.state.starCount}
                  selectedStar={this.onStarRatingPress.bind(this)}
                  fullStarColor={CONFIG.PRIMARY_COLOR}
                />
              </View>
            </View>
            <View
              style={{
                marginTop: 25,
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 10
              }}
            >
              <Textarea
                style={{ width: windowSize.width - 30, fontSize: 13 }}
                rowSpan={5}
                bordered
                placeholder={"Your review"}
                onFocus={this._onFocusReviewText}
                onChangeText={this._onChangeTextReview.bind(this)}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                marginTop: 30,
                alignItems: "center",
                paddingBottom: 30
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
                <FastImage
                  source={this.state.img1}
                  style={{ width: 55, height: 55 }}
                />
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: 15
                }}
              >
                <FastImage
                  source={this.state.img2}
                  style={{ width: 55, height: 55 }}
                />
              </View>
            </View>
          </Card>
        </Content>

        <TouchableOpacity
          onPress={this._onPressBackIcon}
          style={{
            position: "absolute",
            width: "45%",
            alignContent: "center",
            justifyContent: "center",
            height: 35,
            bottom: 10,
            left: 10,
            backgroundColor: "#fff",
            alignItems: "center",
            borderRadius: 3
          }}
        >
          <Text>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.onClickSubmitButton}
          style={{
            position: "absolute",
            width: "45%",
            height: 35,
            bottom: 10,
            right: 10,
            backgroundColor: CONFIG.PRIMARY_COLOR,
            alignItems: "center",
            alignContent: "center",
            justifyContent: "center",
            borderRadius: 3
          }}
        >
          <Text style={{ color: "#fff" }}>Save</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    user: state.rootReducer.user
  };
}

export default connect(
  mapStateToProps,
  null
)(FeedbackWrite);
