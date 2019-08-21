import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity
} from "react-native";

import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import CONFIG from "../../../configs";
import { onLogOutAction } from "../../../redux/actions/action";
import FastImage from 'react-native-fast-image';

const top_user_back = require("../../../assets/user_top.png");
const menu_messageIcon = require("../../../assets/ic_menu_message_24dp.png");
const playUserIcon = require("../../../assets/ic_avatar_default3.png");
const transactionIcon = require("../../../assets/bg_transaction1.png");
const rechargeIcon = require("../../../assets/ic_nav_monetization_24dp1.png");
const checkIcon = require("../../../assets/ic_chevron_right_24dp2.png");
const partionIcon = require("../../../assets/ic_nav_history_24dp3.png");
const winningIcon = require("../../../assets/ic_nav_star_24dp1.png");
const reviewIcon = require("../../../assets/ic_nav_camera_24dp.png");
const userprofileIcon = require("../../../assets/ic_avatar_default2.png");
const coin_icon = require("../../../assets/bg_coin_backage.png");

var windowSize = Dimensions.get("window");

class Me extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { user: this.props.user };
  }

  componentWillReceiveProps(nextprops) {
    this.setState({ user: nextprops.user });
  }

  _gomywinnerRecord = () => {
    if (this.state.user != null) {
      Actions.winningRecord();
    } else {
      Actions.Login();
    }
  }

  _goMyParticipation = () => {
    if (this.state.user != null) {
      Actions.MyParticipation();
    } else {
      Actions.Login();
    }
  }

  _goMyReview = () => {
    if (this.state.user != null) {
      Actions.MyReview();
    } else {
      Actions.Login();
    }
  }

  _goProfile = () => {
    if (this.state.user != null) {
      Actions.MyProfile();
    } else {
      Actions.Login();
    }
  }

  _goExpensehistory = () => {
    if (this.state.user != null) {
      Actions.ExpenseRecord();
    } else {
      Actions.Login();
    }
  }

  _goRecharedhistory = () => {
    if (this.state.user != null) {
      Actions.RechargeRecord();
    } else {
      Actions.Login();
    }
  }

  _goLogout = () => {
    this.props.onLogOutAction();
    Actions.Main();
  }

  _onPressNotification = () => {
    Actions.NotificationRecord();
  }

  _onPressLogin = () => {
    Actions.Login();
  }

  _renderTopBar = () => {
    if (this.state.user != null) {
      return (
        <View
          style={{
            width: windowSize.width,
            height: 130,
            flexDirection: "row",
            alignItems: "center",
            zIndex: 50,
            paddingHorizontal: 10
          }}
        >
          <View
            style={{ flex: 0.8, flexDirection: "row", alignItems: "center" }}
          >
            <FastImage
              source={{
                uri: `${CONFIG.ENDPOINT_OUR}${this.state.user.avatar}`
              }}
              style={{
                width: 70,
                height: 70,
                borderRadius: 70,
                borderColor: "white",
                borderWidth: 1,
                borderRadius: 70
              }}
            />
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "600",
                marginLeft: 15
              }}
            >
              {this.state.user.mobile_number}
            </Text>
          </View>
          <TouchableOpacity
            style={{ flex: 0.2 }}
            onPress={this._onPressNotification}
          >
            <FastImage
              source={menu_messageIcon}
              style={{
                width: 35,
                height: 35,
                alignSelf: "flex-end"
              }}
            />
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View
          style={{
            width: windowSize.width,
            height: 130,
            flexDirection: "column",
            alignItems: "center",
            zIndex: 50,
            paddingHorizontal: 10,
            justifyContent: "center"
          }}
        >
          <View style={{ alignItems: "center" }}>
            <FastImage
              source={playUserIcon}
              style={{
                width: 70,
                height: 70,
                borderRadius: 70,
                borderColor: "white",
                borderWidth: 1,
                borderRadius: 70
              }}
            />
          </View>
          <TouchableOpacity
            style={{ marginTop: 5 }}
            onPress={this._onPressLogin}
          >
            <Text style={{ color: "white" }}>Login ></Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  _renderRechargeBar = () => {
    if (this.state.user != null) {
      return (
        <View
          style={{
            width: windowSize.width,
            height: 80,
            backgroundColor: "#FFF4DA",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <View
            style={{
              flex: 0.6,
              flexDirection: "row",
              paddingLeft: 40,
              alignItems: "center"
            }}
          >
            <FastImage
              source={coin_icon}
              style={{ width: 35, height: 30 }}
            />
            <Text
              style={{
                marginLeft: 10,
                color: CONFIG.Percent_bar,
                fontSize: 17,
                fontWeight: "800"
              }}
            >
              {this.state.user.money}
            </Text>
          </View>
        </View>
      );
    } else {
      return <View />;
    }
  }

  _renderLogInf = () => {
    if (this.state.user != null) {
      return (
        <TouchableOpacity
          onPress={this._goLogout}
          style={{
            width: windowSize.width,
            height: 45,
            borderBottomColor: "#DEDEDE",
            marginTop: 4,
            borderBottomWidth: 1,
            backgroundColor: "white",
            paddingLeft: 10,
            justifyContent: "center",
            flexDirection: "row"
          }}
        >
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: CONFIG.COLOR_BUTTON_TITLE, fontSize: 13 }}>
              Log out
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={this._onPressLogin}
          style={{
            width: windowSize.width,
            height: 45,
            borderBottomColor: "#DEDEDE",
            marginTop: 4,
            borderBottomWidth: 1,
            backgroundColor: "white",
            paddingLeft: 10,
            justifyContent: "center",
            flexDirection: "row"
          }}
        >
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: CONFIG.COLOR_BUTTON_TITLE, fontSize: 13 }}>
              Log in
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <FastImage
          source={top_user_back}
          style={{
            width: windowSize.width,
            height: 130,
            position: "absolute",
            top: 0
          }}
        />

        {this._renderTopBar()}
        {this._renderRechargeBar()}

        <TouchableOpacity
          onPress={this._goExpensehistory}
          style={{
            paddingLeft: 10,
            width: windowSize.width,
            height: 55,
            marginTop: 10,
            borderTopColor: "#DEDEDE",
            borderBottomColor: "#DEDEDE",
            borderBottomWidth: 1,
            borderTopWidth: 1,
            backgroundColor: "white",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <View
            style={{ flex: 0.8, flexDirection: "row", alignItems: "center" }}
          >
            <FastImage
              source={transactionIcon}
              style={{ width: 23, height: 25 }}
            />
            <Text
              style={{
                color: CONFIG.COLOR_BUTTON_TITLE,
                fontSize: 13,
                marginLeft: 10
              }}
            >
              Expense History
            </Text>
          </View>
          <View
            style={{
              flex: 0.2,
              flexDirection: "row",
              justifyContent: "flex-end",
              paddingRight: 10,
              alignItems: "center"
            }}
          >
            <FastImage
              source={checkIcon}
              style={{ width: 25, height: 30 }}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this._goRecharedhistory}
          style={{
            width: windowSize.width,
            height: 55,
            borderBottomColor: "#DEDEDE",
            borderBottomWidth: 1,
            backgroundColor: "white",
            paddingLeft: 8,
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <View
            style={{ flex: 0.8, flexDirection: "row", alignItems: "center" }}
          >
            <FastImage
              source={rechargeIcon}
              style={{ width: 25, height: 25 }}
            />
            <Text
              style={{
                color: CONFIG.COLOR_BUTTON_TITLE,
                fontSize: 13,
                marginLeft: 10
              }}
            >
              Recharge History
            </Text>
          </View>
          <View
            style={{
              flex: 0.2,
              flexDirection: "row",
              justifyContent: "flex-end",
              paddingRight: 10,
              alignItems: "center"
            }}
          >
            <FastImage
              source={checkIcon}
              style={{ width: 25, height: 30 }}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this._goMyParticipation}
          style={{
            width: windowSize.width,
            height: 55,
            marginTop: 10,
            borderBottomColor: "#DEDEDE",
            borderTopWidth: 1,
            borderTopColor: "#DEDEDE",
            borderBottomWidth: 1,
            backgroundColor: "white",
            paddingLeft: 8,
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <View
            style={{ flex: 0.8, flexDirection: "row", alignItems: "center" }}
          >
            <FastImage
              source={partionIcon}
              style={{ width: 25, height: 25 }}
            />
            <Text
              style={{
                color: CONFIG.COLOR_BUTTON_TITLE,
                fontSize: 13,
                marginLeft: 10
              }}
            >
              My Participation
            </Text>
          </View>
          <View
            style={{
              flex: 0.2,
              flexDirection: "row",
              justifyContent: "flex-end",
              paddingRight: 10,
              alignItems: "center"
            }}
          >
            <FastImage
              source={checkIcon}
              style={{ width: 25, height: 30 }}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this._gomywinnerRecord}
          style={{
            width: windowSize.width,
            height: 55,
            borderBottomColor: "#DEDEDE",
            borderBottomWidth: 1,
            backgroundColor: "white",
            paddingLeft: 10,
            justifyContent: "center",
            flexDirection: "row"
          }}
        >
          <View
            style={{ flex: 0.8, flexDirection: "row", alignItems: "center" }}
          >
            <FastImage
              source={winningIcon}
              style={{ width: 25, height: 25 }}
            />
            <Text
              style={{
                color: CONFIG.COLOR_BUTTON_TITLE,
                fontSize: 13,
                marginLeft: 10
              }}
            >
              Winning Record
            </Text>
          </View>
          <View
            style={{
              flex: 0.2,
              flexDirection: "row",
              justifyContent: "flex-end",
              paddingRight: 10,
              alignItems: "center"
            }}
          >
            <FastImage
              source={checkIcon}
              style={{ width: 25, height: 30 }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this._goMyReview}
          style={{
            width: windowSize.width,
            height: 55,
            borderBottomColor: "#DEDEDE",
            borderBottomWidth: 1,
            backgroundColor: "white",
            paddingLeft: 10,
            justifyContent: "center",
            flexDirection: "row"
          }}
        >
          <View
            style={{ flex: 0.8, flexDirection: "row", alignItems: "center" }}
          >
            <FastImage
              source={reviewIcon}
              style={{ width: 25, height: 25 }}
            />
            <Text
              style={{
                color: CONFIG.COLOR_BUTTON_TITLE,
                fontSize: 13,
                marginLeft: 10
              }}
            >
              Reviews
            </Text>
          </View>
          <View
            style={{
              flex: 0.2,
              flexDirection: "row",
              justifyContent: "flex-end",
              paddingRight: 10,
              alignItems: "center"
            }}
          >
            <FastImage
              source={checkIcon}
              style={{ width: 25, height: 30 }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this._goProfile}
          style={{
            width: windowSize.width,
            height: 55,
            borderBottomColor: "#DEDEDE",
            borderBottomWidth: 1,
            backgroundColor: "white",
            paddingLeft: 10,
            justifyContent: "center",
            flexDirection: "row"
          }}
        >
          <View
            style={{ flex: 0.8, flexDirection: "row", alignItems: "center" }}
          >
            <FastImage
              source={userprofileIcon}
              style={{ width: 25, height: 25 }}
            />
            <Text
              style={{
                color: CONFIG.COLOR_BUTTON_TITLE,
                fontSize: 13,
                marginLeft: 10
              }}
            >
              Profile
            </Text>
          </View>
          <View
            style={{
              flex: 0.2,
              flexDirection: "row",
              justifyContent: "flex-end",
              paddingRight: 10,
              alignItems: "center"
            }}
          >
            <FastImage
              source={checkIcon}
              style={{ width: 25, height: 30 }}
            />
          </View>
        </TouchableOpacity>
        {this._renderLogInf()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f7",
    position: "relative",
    flexDirection: "column"
  }
});

function mapStateToProps(state, props) {
  return {
    user: state.rootReducer.user
  };
}

export default connect(
  mapStateToProps,
  { onLogOutAction }
)(Me);
