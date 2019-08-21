import React, { PureComponent } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions
} from "react-native";

import {
  Text
} from "native-base";

import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import CONFIG from "../../../configs";
import Toast from "../../elements/Toast/lib/Toast";
import { onMoveTab } from "../../../redux/actions/action";
import FastImage from 'react-native-fast-image';

const errorIco = require("../../../assets/ic_error_24dp5.png");
const success_img = require("../../../assets/bg_invite_friend1.png");

var windowSize = Dimensions.get("window");

class PaySuccess extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isRefreshing: true,
      purchase_time: "",
      number_ticket: "",
      codes: ""
    };
  }

  _onRefresh = () => {
    this.setState({ isRefreshing: true });
    this.componentWillMount();
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
    }, 2000);
  }

  showDetail = (obj) => {
    Actions.Productdetail({ params: { obj: obj } });
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.userId != 0 && nextProps.user == null) {
      this.setState({ userId: nextProps.user == null ? 0 : nextProps.user.id });
    }
  }

  componentWillMount() {
    var API_URL = CONFIG.ENDPOINT_OUR + "/api/getlatestrecord";
    console.log("paysuccess.js", "componentWillMount", API_URL);
    
    fetch(API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.user.api_token
      },
      body: JSON.stringify({
        uid: this.props.user.id,
        pid: this.props.params.pid
      })
    })
    .then(response => response.json())
    .then(res => {
        if (res.success == "success") {
          this.setState({
            purchase_time: "Purchase Time : " + res.latestrecord.time,
            number_ticket: " Purchased Tickets :  " + res.latestrecord.gonumber,
            codes: "Purchased Codes : " + res.latestrecord.goucode
          });
        } else {
          this.show_toast("Something error.");
        }
    })
    .catch(error => {
        this.show_toast("Network error.");
    });
  }

  detailReview = (info) => {
    Actions.ReviewDetail({ params: { obj: info } });
  }

  _goShopping = () => {
    this.props.onMoveTab(0);
    Actions.Main();
  }

  _onPressHistory = () => {
    Actions.MyParticipation();
  }

  render() {
    return (
      <View style={{ flex: 1, position: "relative" }}>
        <FastImage
          source={success_img}
          style={{
            position: "absolute",
            top: 0,
            width: windowSize.width,
            height: windowSize.height
          }}
        />

        <View
          style={{
            marginTop: 130,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text
            style={{
              width: windowSize.width - 80,
              color: CONFIG.Percent_bar,
              fontSize: 20,
              fontWeight: "600",
              lineHeight: 40,
              textAlign: "center"
            }}
            numberOfLines={4}
          >
            Congratulations. The payment is successful!. Please wait for the
            system to announce for you!
          </Text>
        </View>

        <View
          style={{
            marginTop: 30,
            justifyContent: "center",
            alignItems: "center",
            width: windowSize.width,
            flexDirection: "column"
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 15,
              fontWeight: "400",
              lineHeight: 25
            }}
          >
            {this.state.purchase_time}
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: 15,
              fontWeight: "400",
              lineHeight: 25
            }}
          >
            {this.state.number_ticket}
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: 15,
              fontWeight: "400",
              width: windowSize.width - 40,
              textAlign: "center",
              lineHeight: 25
            }}
            numberOfLines={3}
          >
            {this.state.codes}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 15
          }}
        >
          <TouchableOpacity onPress={this._onPressHistory}>
            <Text
              style={{
                fontSize: 13,
                color: "red",
                textDecorationLine: "underline"
              }}
            >
              Check Purchase history
            </Text>
          </TouchableOpacity>
          <Text style={{ color: "white", fontSize: 12 }}> Or </Text>
          <TouchableOpacity onPress={this._goShopping}>
            <Text
              style={{
                fontSize: 13,
                color: "red",
                textDecorationLine: "underline"
              }}
            >
              Continue Shopping
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
  { onMoveTab }
)(PaySuccess);
