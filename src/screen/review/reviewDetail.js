import React, { PureComponent } from "react";
import {
  View,
  StatusBar,
  ScrollView,
  Platform,
  TouchableOpacity,
  Dimensions,
  StyleSheet
} from "react-native";

import {
  Container,
  Header,
  Body,
  Left,
  Title,
  Button,
  Text
} from "native-base";

import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import CONFIG from "../../configs";
import Toast from "../elements/Toast/lib/Toast";
import StarRating from "react-native-star-rating";
import FastImage from 'react-native-fast-image';

/*
const backIco = require("../../assets/bg_back_arrow.png");
const errorIco = require("../../assets/ic_error_24dp5.png");
*/
var windowSize = Dimensions.get("window");

class ReviewDetail extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isRefreshing: true
    };
  }

  show_toast = (str) => {
    var msg = (
      <View style={{ flexDirection: "row" }}>
        <FastImage
          source={require("../../assets/ic_error_24dp5.png")}
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

  _onPressBackIcon = () => {
    Actions.pop();
  }

  _onPressProfile = () => {
    Actions.UserParticipation({
      params: {
        user: {
          id: this.props.params.obj.user_id,
          avatar: this.props.params.obj.user_photo,
          mobile_number: this.props.params.obj.mobile_number
        }
      }
    });
  }

  render() {
    return (
      <Container style={{ backgroundColor: "#fff" }}>
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
                source={require("../../assets/bg_back_arrow.png")}
                style={{ width: 15, height: 12 }}
              />
            </Button>
          </Left>
          <Body>
            <Title
              style={{
                marginLeft: 30,
                color: CONFIG.PRIMARY_COLOR,
                fontSize: 15
              }}
            >
              Review
            </Title>
          </Body>
        </Header>

        <View style={{ flex: 1 }}>
          <ScrollView
            style={styles.container}
            showsHorizontalScrollIndicator={false}
          >
            <View
              style={{
                flexDirection: "row",
                width: windowSize.width,
                padding: 15
              }}
            >
              <TouchableOpacity
                onPress={this._onPressProfile}
              >
                <FastImage
                  source={{
                    uri: `${CONFIG.ENDPOINT_OUR}${
                      this.props.params.obj.user_photo
                    }`
                  }}
                  style={{
                    width: 55,
                    height: 55,
                    borderRadius: 55
                  }}
                />
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "column",
                  paddingTop: 10,
                  marginLeft: 15
                }}
              >
                <Text
                  style={{
                    color: CONFIG.PRIMARY_COLOR,
                    lineHeight: 25,
                    fontSize: 17
                  }}
                >
                  {this.props.params.obj.mobile_number}
                </Text>
                <TouchableOpacity style={{ width: windowSize.width - 100 }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: CONFIG.Percent_bar,
                      lineHeight: 25,
                      fontSize: 13
                    }}
                  >
                    {this.props.params.obj.pinf.title}
                  </Text>
                </TouchableOpacity>

                <Text
                  numberOfLines={1}
                  style={{
                    color: CONFIG.COLOR_BUTTON_TITLE,
                    lineHeight: 25,
                    fontSize: 13
                  }}
                >
                  Period No : {this.props.params.obj.pinf.qishu}
                </Text>

                <Text
                  numberOfLines={1}
                  style={{
                    color: CONFIG.COLOR_BUTTON_TITLE,
                    lineHeight: 25,
                    fontSize: 13
                  }}
                >
                  Revealed Time : {this.props.params.obj.pinf.time}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    color: CONFIG.COLOR_BUTTON_TITLE,
                    lineHeight: 25,
                    fontSize: 13
                  }}
                >
                  Winning Number : {this.props.params.obj.pinf.q_user_code}
                </Text>
              </View>
            </View>

            <View
              style={{
                backgroundColor: "#e9e9ef",
                width: windowSize.width,
                height: 10
              }}
            />

            <View style={{ flex: 1, padding: 20, flexDirection: "column" }}>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 0.6 }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: CONFIG.SECONDARY_COLOR,
                      lineHeight: 25,
                      fontSize: 13,
                      alignSelf: "flex-start"
                    }}
                  >
                    Date : {this.props.params.obj.created_at}
                  </Text>
                </View>
                <View style={{ flex: 0.4, alignItems: "flex-end" }}>
                  <StarRating
                    disabled={true}
                    maxStars={5}
                    starSize={15}
                    rating={this.props.params.obj.score}
                    selectedStar={rating => this.onStarRatingPress(rating)}
                    fullStarColor={CONFIG.PRIMARY_COLOR}
                  />
                </View>
              </View>
              <View style={{ width: windowSize.width - 100 }}>
                <Text
                  numberOfLines={3}
                  style={{
                    color: CONFIG.COLOR_BUTTON_TITLE,
                    lineHeight: 25,
                    fontSize: 13
                  }}
                >
                  {" "}
                  {this.props.params.obj.feedback}
                </Text>
              </View>
            </View>

            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                padding: 20,
                paddingTop: 0
              }}
            >
              {this.props.params.obj.pic_arr.map((info, index) => {
                return (
                  <FastImage
                    key={index}
                    source={{ uri: CONFIG.ENDPOINT_OUR + info }}
                    style={{
                      width: windowSize.width - 40,
                      height: windowSize.height / 2 + 50,
                      marginBottom: 15
                    }}
                  />
                );
              })}
            </View>
          </ScrollView>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  WebViewStyle: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginTop: Platform.OS === "ios" ? 20 : 0
  }
});

function mapStateToProps(state, props) {
  return {
    upcoming: state.rootReducer.upcoming
  };
}

export default connect(
  mapStateToProps,
  null
)(ReviewDetail);
