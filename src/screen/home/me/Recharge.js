import React, { PureComponent } from "react";
import {
  View,
  StatusBar,
  ScrollView,
  Platform,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ToastAndroid,
  Alert
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
import CONFIG from "../../../configs";
import Toast from "../../elements/Toast/lib/Toast";
import axios from "axios";
import { onMoveTab } from "../../../redux/actions/action";
import IPay88, { Pay } from "ipay88-sdk";
import FastImage from 'react-native-fast-image';

//const backIco = require("../../../assets/bg_back_arrow.png");
//const errorIco = require("../../../assets/ic_error_24dp5.png");
//const bid_back_1 = require("../../../assets/bg_bid_back_1.png");
//const bid_back_2 = require("../../../assets/bg_bid_back_2.png");
//const bid_back_3 = require("../../../assets/bg_bid_back_3.png");
//const bid_back_4 = require("../../../assets/bg_bid_back_4.png");
//const bid_back_5 = require("../../../assets/bg_bid_back_5.png");
//const bid_back_6 = require("../../../assets/bg_bid_back_6.png");
//const recharge_sel = require("../../../assets/bg_recharge_selected.png");
//const securIcon = require("../../../assets/secure.png");

var windowSize = Dimensions.get("window");

var sel_shadow = (
  <View
    style={{
      backgroundColor: "#FFBE0F",
      position: "absolute",
      top: 0,
      borderColor: CONFIG.PRIMARY_COLOR,
      borderWidth: 1,
      width: (windowSize.width - 20) / 3,
      height: 180,
      opacity: 0.2
    }}
  >
    <FastImage
      source={require("../../../assets/bg_recharge_selected.png")}
      style={{
        width: 15,
        height: 15,
        position: "absolute",
        right: 0,
        top: 0,
        opacity: 1
      }}
    />
  </View>
);
var blank_shadow = null;

class Recharge extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      card_sel_1: sel_shadow,
      card_sel_2: blank_shadow,
      card_sel_3: blank_shadow,
      card_sel_4: blank_shadow,
      card_sel_5: blank_shadow,
      card_sel_6: blank_shadow,
      money: "10.00",
      mechantKey: "",
      mechantCode: "",
      refNo: ""
    };
  }

  componentDidMount() {
    this.getPaymentInfo();
  }

  show_toast = (str) => {
    var msg = (
      <View style={{ flexDirection: "row" }}>
        <FastImage
          source={require("../../../assets/ic_error_24dp5.png")}
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

  onCardSel = (cid) => {
    if (cid == 1) {
      this.setState({
        card_sel_1: sel_shadow,
        card_sel_2: blank_shadow,
        card_sel_3: blank_shadow,
        card_sel_4: blank_shadow,
        card_sel_5: blank_shadow,
        card_sel_6: blank_shadow
      });
      this.setState({ money: "10.00" });
    }
    if (cid == 2) {
      this.setState({
        card_sel_1: blank_shadow,
        card_sel_2: sel_shadow,
        card_sel_3: blank_shadow,
        card_sel_4: blank_shadow,
        card_sel_5: blank_shadow,
        card_sel_6: blank_shadow
      });
      this.setState({ money: "30.00" });
    }
    if (cid == 3) {
      this.setState({
        card_sel_1: blank_shadow,
        card_sel_2: blank_shadow,
        card_sel_3: sel_shadow,
        card_sel_4: blank_shadow,
        card_sel_5: blank_shadow,
        card_sel_6: blank_shadow
      });
      this.setState({ money: "50.00" });
    }
    if (cid == 4) {
      this.setState({
        card_sel_1: blank_shadow,
        card_sel_2: blank_shadow,
        card_sel_3: blank_shadow,
        card_sel_4: sel_shadow,
        card_sel_5: blank_shadow,
        card_sel_6: blank_shadow
      });
      this.setState({ money: "100.00" });
    }
    if (cid == 5) {
      this.setState({
        card_sel_1: blank_shadow,
        card_sel_2: blank_shadow,
        card_sel_3: blank_shadow,
        card_sel_4: blank_shadow,
        card_sel_5: sel_shadow,
        card_sel_6: blank_shadow
      });
      this.setState({ money: "200.00" });
    }
    if (cid == 6) {
      this.setState({
        card_sel_1: blank_shadow,
        card_sel_2: blank_shadow,
        card_sel_3: blank_shadow,
        card_sel_4: blank_shadow,
        card_sel_5: blank_shadow,
        card_sel_6: sel_shadow
      });
      this.setState({ money: "300.00" });
    }
  }

  successNotify = data => {
    const {
      transactionId,
      referenceNo,
      amount,
      remark,
      authorizationCode
    } = data;

    if (data.authorizationCode) {
      if (Platform.OS === "ios") {
        Alert.alert(
          "Message",
          `Payment authcode is ${authorizationCode}.Payment successful`,
          {
            cancelable: true
          }
        );
      } else {
        ToastAndroid.show(
          `Message: Payment authcode is ${authorizationCode}.Payment successful`,
          ToastAndroid.LONG
        );
      }
    }
    this.response(data);
  };

  cancelNotify = data => {
    const { transactionId, referenceNo, amount, remark, error } = data;
    if (Platform.OS === "ios") {
      Alert.alert("Message", `${error}`, { cancelable: true });
    } else {
      ToastAndroid.show(`Message: ${error}`, ToastAndroid.LONG);
    }
  };

  failedNotify = data => {
    const { transactionId, referenceNo, amount, remark, error } = data;

    if (Platform.OS === "ios") {
      Alert.alert("Message", `${error}`, { cancelable: true });
    } else {
      ToastAndroid.show(`Message: ${error}`, ToastAndroid.LONG);
    }
  };

  getPaymentInfo = () => {
    const URL = CONFIG.ENDPOINT_OUR + "/api/getRefNo";
    console.log("Recharge.js", "getPaymentInfo", URL);
    
    axios
      .get(URL)
      .then(res => {
        if (res.data.success == "success") {
          var payInfo = res.data.payInfo;
          this.setState({
            mechantKey: payInfo.mechantKey,
            mechantCode: payInfo.mechantCode,
            refNo: payInfo.refNo
          });
        } else {
          this.show_toast("Network Error");
        }
      })
      .catch(error => {
        console.log(error);
        this.show_toast("Network Error");
      });
  }

  paymentProcess = () => {
    this.pay88();
  }

  pay88 = () => {
    this.state.money = "1.00"; // for testing
    try {
      const data = {};
      data.merchantKey = this.state.mechantKey;
      data.merchantCode = this.state.mechantCode;
      data.referenceNo = this.state.refNo;
      data.amount = this.state.money;
      data.productDescription = "Recharge " + this.state.money;
      data.userName = this.props.user.name;
      data.userEmail = this.props.user.email;
      data.userContact = this.props.user.mobile_number;
      data.paymentId = "2"; // refer to ipay88 docs
      data.remark = Date.now().toString();
      data.currency = "MYR";
      data.utfLang = "UTF-8";
      data.country = "MY";
      data.backendUrl = "http://haipsy3.selfip.com/satumall/";
      const errs = Pay(data);
      if (Object.keys(errs).length > 0) {
        console.log(errs, "yyy");
      }
    } catch (e) {
      console.log(e, "ttt");
    }
  }

  response = data => {
    var API_URL = CONFIG.ENDPOINT_OUR + "/api/response";
    console.log("Recharge.js", "response", API_URL);
    
    fetch(API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.user.api_token
      },
      body: JSON.stringify({
        uid: this.props.user.id,
        data: data
      })
    })
    .then(response => response.json())
    .then(res => {
        Actions.pop();
    })
    .catch(error => {
        this.show_toast("Network error.");
        console.error(error);
    });
  };

  _onPressBackIcon = () => {
    Actions.pop();
  }

  _onPressTerms = () => {
    Actions.Terms();
  }

  _onPressPrivacy = () => {
    Actions.Privecy();
  }

  render() {
    return (
      <Container style={{ backgroundColor: "#EEE" }}>
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
                source={require("../../../assets/bg_back_arrow.png")}
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
              Recharge
            </Title>
          </Body>
        </Header>

        <ScrollView style={styles.container}>
          <View
            style={{
              height: 25,
              width: windowSize.width,
              backgroundColor: "#32B16C",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row"
            }}
          >
            <FastImage
              source={require("../../../assets/secure.png")}
              style={{
                width: 13,
                height: 15,
                marginRight: 5
              }}
            />
            <Text style={{ color: "white", fontSize: 11, fontWeight: "500" }}>
              Your payment process is secure
            </Text>
          </View>

          <View style={{ paddingHorizontal: 10, paddingVertical: 15 }}>
            <Text style={{ color: CONFIG.SECONDARY_COLOR, fontSize: 15 }}>
              Select Coins You Buy
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 5,
              justifyContent: "space-between"
            }}
          >
            <TouchableOpacity
              onPress={this.onCardSel.bind(this, 1)}
              style={styles.coin_card}
            >
              <View
                style={{
                  height: 90,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 5
                }}
              >
                <FastImage source={require("../../../assets/bg_bid_back_1.png")} style={{ width: 80, height: 80 }} />
              </View>
              <View
                style={{
                  height: 35,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={{ fontSize: 18, color: CONFIG.Percent_bar }}>
                  10{" "}
                  <Text style={{ fontSize: 13, color: CONFIG.SECONDARY_COLOR }}>
                    Tickets
                  </Text>
                </Text>
              </View>
              <View
                style={{
                  height: 55,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: 5
                }}
              >
                <View
                  style={{
                    borderRadius: 20,
                    paddingHorizontal: 20,
                    backgroundColor: "#FFBE0F",
                    paddingVertical: 4
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 12, fontWeight: "500" }}
                  >
                    RM 10.00
                  </Text>
                </View>
              </View>
              {this.state.card_sel_1}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.onCardSel.bind(this, 2)}
              style={styles.coin_card}
            >
              <View
                style={{
                  height: 90,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 5
                }}
              >
                <FastImage source={require("../../../assets/bg_bid_back_2.png")} style={{ width: 80, height: 80 }} />
              </View>
              <View
                style={{
                  height: 35,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={{ fontSize: 18, color: CONFIG.Percent_bar }}>
                  30{" "}
                  <Text style={{ fontSize: 13, color: CONFIG.SECONDARY_COLOR }}>
                    Tickets
                  </Text>
                </Text>
              </View>
              <View
                style={{
                  height: 55,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: 5
                }}
              >
                <View
                  style={{
                    borderRadius: 20,
                    paddingHorizontal: 20,
                    backgroundColor: "#FFBE0F",
                    paddingVertical: 4
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 12, fontWeight: "500" }}
                  >
                    RM 30.00
                  </Text>
                </View>
              </View>
              {this.state.card_sel_2}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.onCardSel.bind(this, 3)}
              style={styles.coin_card}
            >
              <View
                style={{
                  height: 90,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 5
                }}
              >
                <FastImage source={require("../../../assets/bg_bid_back_3.png")} style={{ width: 80, height: 80 }} />
              </View>
              <View
                style={{
                  height: 35,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={{ fontSize: 18, color: CONFIG.Percent_bar }}>
                  50{" "}
                  <Text style={{ fontSize: 13, color: CONFIG.SECONDARY_COLOR }}>
                    Tickets
                  </Text>
                </Text>
              </View>
              <View
                style={{
                  height: 55,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: 5
                }}
              >
                <View
                  style={{
                    borderRadius: 20,
                    paddingHorizontal: 20,
                    backgroundColor: "#FFBE0F",
                    paddingVertical: 4
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 12, fontWeight: "500" }}
                  >
                    RM 50.00
                  </Text>
                </View>
              </View>
              {this.state.card_sel_3}
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 5,
              justifyContent: "space-between",
              marginTop: 5
            }}
          >
            <TouchableOpacity
              onPress={this.onCardSel.bind(this, 4)}
              style={styles.coin_card}
            >
              <View
                style={{
                  height: 90,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 5
                }}
              >
                <FastImage source={require("../../../assets/bg_bid_back_4.png")} style={{ width: 80, height: 80 }} />
              </View>
              <View
                style={{
                  height: 35,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={{ fontSize: 18, color: CONFIG.Percent_bar }}>
                  100{" "}
                  <Text style={{ fontSize: 13, color: CONFIG.SECONDARY_COLOR }}>
                    Tickets
                  </Text>
                </Text>
              </View>
              <View
                style={{
                  height: 55,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: 5
                }}
              >
                <View
                  style={{
                    borderRadius: 20,
                    paddingHorizontal: 20,
                    backgroundColor: "#FFBE0F",
                    paddingVertical: 4
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 12, fontWeight: "500" }}
                  >
                    RM 100.00
                  </Text>
                </View>
              </View>
              {this.state.card_sel_4}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.onCardSel.bind(this, 5)}
              style={styles.coin_card}
            >
              <View
                style={{
                  height: 90,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 5
                }}
              >
                <FastImage source={require("../../../assets/bg_bid_back_5.png")} style={{ width: 80, height: 80 }} />
              </View>
              <View
                style={{
                  height: 35,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={{ fontSize: 18, color: CONFIG.Percent_bar }}>
                  200{" "}
                  <Text style={{ fontSize: 13, color: CONFIG.SECONDARY_COLOR }}>
                    Tickets
                  </Text>
                </Text>
              </View>
              <View
                style={{
                  height: 55,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: 5
                }}
              >
                <View
                  style={{
                    borderRadius: 20,
                    paddingHorizontal: 20,
                    backgroundColor: "#FFBE0F",
                    paddingVertical: 4
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 12, fontWeight: "500" }}
                  >
                    RM 200.00
                  </Text>
                </View>
              </View>
              {this.state.card_sel_5}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.onCardSel.bind(this, 6)}
              style={styles.coin_card}
            >
              <View
                style={{
                  height: 90,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 5
                }}
              >
                <FastImage source={require("../../../assets/bg_bid_back_6.png")} style={{ width: 80, height: 80 }} />
              </View>
              <View
                style={{
                  height: 35,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={{ fontSize: 18, color: CONFIG.Percent_bar }}>
                  300{" "}
                  <Text style={{ fontSize: 13, color: CONFIG.SECONDARY_COLOR }}>
                    Tickets
                  </Text>
                </Text>
              </View>
              <View
                style={{
                  height: 55,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: 5
                }}
              >
                <View
                  style={{
                    borderRadius: 20,
                    paddingHorizontal: 20,
                    backgroundColor: "#FFBE0F",
                    paddingVertical: 4
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 12, fontWeight: "500" }}
                  >
                    RM 300.00
                  </Text>
                </View>
              </View>
              {this.state.card_sel_6}
            </TouchableOpacity>
          </View>

          <View
            style={{
              paddingHorizontal: 30,
              flexDirection: "row",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 15
            }}
          >
            <Text
              style={{ fontSize: 12, color: CONFIG.SECONDARY_COLOR }}
              numberOfLines={1}
            >
              By tapping "Pay Now" button, you agree on
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <TouchableOpacity onPress={this._onPressTerms}>
              <Text
                style={{
                  fontSize: 12,
                  color: CONFIG.PRIMARY_COLOR,
                  textDecorationLine: "underline"
                }}
              >
                Terms of use
              </Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 12, color: CONFIG.SECONDARY_COLOR }}>
              {" "}
              and{" "}
            </Text>
            <TouchableOpacity onPress={this._onPressPrivacy}>
              <Text
                style={{
                  fontSize: 12,
                  color: CONFIG.PRIMARY_COLOR,
                  textDecorationLine: "underline"
                }}
              >
                Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 30, marginTop: 70 }} />
        </ScrollView>

        <View
          style={{
            position: "absolute",
            flex: 1,
            paddingHorizontal: 10,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            width: windowSize.width,
            paddingVertical: 7,
            backgroundColor: "white",
            borderTopColor: "#ddd",
            borderTopWidth: 1
          }}
        >
          <IPay88
            successNotify={this.successNotify}
            failedNotify={this.failedNotify}
            cancelNotify={this.cancelNotify}
          />
          <TouchableOpacity
            onPress={this.paymentProcess}
            style={{
              backgroundColor: CONFIG.PRIMARY_COLOR,
              borderRadius: 40,
              justifyContent: "center",
              alignItems: "center",
              width: windowSize.width - 30,
              paddingVertical: 5
            }}
          >
            <Text style={{ color: "white", fontSize: 15, fontWeight: "400" }}>
              {" "}
              IMMEDIATE RECHARGE RM {this.state.money}
            </Text>
          </TouchableOpacity>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#Efefef",
    flexDirection: "column",
    flex: 1
  },
  coin_card: {
    width: (windowSize.width - 20) / 3,
    height: 180,
    flexDirection: "column",
    backgroundColor: "white",
    borderColor: "#EFEFEF",
    borderWidth: 1,
    paddingBottom: 10,
    position: "relative"
  }
});

function mapStateToProps(state, props) {
  return {
    user: state.rootReducer.user
  };
}

export default connect(
  mapStateToProps,
  { onMoveTab }
)(Recharge);
