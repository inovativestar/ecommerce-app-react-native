import React, { PureComponent } from "react";

import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions
} from "react-native";

import axios from "axios";
import CONFIG from "../../../configs";
import Toast from "../../elements/Toast/lib/Toast";
import { Actions } from "react-native-router-flux";
import FastImage from 'react-native-fast-image';

const coinIcon = require("../../../assets/bg_coin_backage.png");
const cupIcon = require("../../../assets/ic_cup.png");
const errorIco = require("../../../assets/ic_error_24dp5.png");
const winnerBackground = require("../../../assets/bg_other_winner_2.png");

var windowSize = Dimensions.get("window");

export default class CardMyWon extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { default_avartar: "public/avatar/default.jpg", coin_val: 1 };
  }

  goOtherPage = (cardid, obj) => {
    if (cardid == 0) Actions.Productdetail({ params: { obj: obj } });
    else {
      Actions.WonProduct({ params: { obj: obj } });
    }
  }

  onGoNextPeriod = (obj) => {
    const URL = CONFIG.ENDPOINT_OUR + "/api/getnewperiod/" + obj.sid;
    console.log("CardMyWon.js", "onGoNextPeriod", URL);
    
    axios
    .get(URL)
    .then(res => {
        if (res.data.success == "success") {
          Actions.Productdetail({ params: { obj: res.data.nextperiod } });
        } else if (res.data.success == "failed") {
          this.show_toast("Please Re-click the play button...");
        } else {
          this.show_toast("Network Error");
        }
    })
    .catch(error => {
        console.log(error);
        this.show_toast("Network Error");
    });
  }

  show_toast = (str) => {
        var msg = (
          <View style={{ flexDirection: "row" }}>
            <Image
              source={errorIco}
              style={{ width: 20, height: 18, resizeMode: "stretch" }}
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

  _getTicket = () => {
    var ticket = 0;
    this.props.info.record.map(info => {
      if (info.uid == this.props.userId) {
        ticket = ticket + parseInt(info.gonumber);
      }
    });
    return ticket;
  }

  _getTicketTxt = () => {
    return this._getTicket() == 1 ? "Ticket" : "Tickets";
  }

  _renderCardType = () => {
    if (this.props.info.q_end_time != null && this.props.info.q_uid != null) {
      if (this.props.info.q_uid == this.props.userId) {
        return (
          <View style={[styles.cardContainer, { paddingBottom: 5 }]}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderBottomColor: "#EFEFEF",
                borderBottomWidth: 1,
                paddingBottom: 3
              }}
            >
              <View
                style={{
                  flex: 0.7,
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <FastImage
                  source={{
                    uri: `${this.props.info.cloud_url}${
                      this.props.info.upload_path_url
                    }${this.props.info.thumb}`
                  }}
                  style={{
                    width: 40,
                    height: 30,
                    marginTop: 3
                  }}
                />
                <Text
                  style={{
                    color: CONFIG.COLOR_BUTTON_TITLE,
                    fontSize: 12,
                    marginLeft: 5,
                    width: windowSize.width - 200
                  }}
                  numberOfLines={1}
                >
                  {this.props.info.title}
                </Text>
              </View>
              <View
                style={{
                  flex: 0.3,
                  justifyContent: "flex-end",
                  alignItems: "center",
                  paddingRight: 5
                }}
              >
                <Text
                  style={{
                    color: CONFIG.SECONDARY_COLOR,
                    fontSize: 10,
                    alignSelf: "flex-end"
                  }}
                >
                  {this.props.info.q_end_time}
                </Text>
              </View>
            </View>
            <FastImage
              source={winnerBackground}
              style={{
                width: windowSize.width - 20,
                height: 110,
                borderRadius: 5,
                marginTop: 7
              }}
            />

            <View
              style={{
                position: "absolute",
                width: windowSize.width - 20,
                height: 110,
                bottom: 7,
                left: 10
              }}
            >
              <View
                style={{
                  width: windowSize.width - 20,
                  height: 110,
                  flexDirection: "row"
                }}
              >
                <View
                  style={{
                    flex: 0.35,
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 10,
                    paddingLeft: 5
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 14, lineHeight: 25 }}
                  >
                    WINNER NUMBER
                  </Text>
                  <Text
                    style={{ color: "white", fontSize: 25, fontWeight: "bold" }}
                  >
                    {this.props.info.q_user_code}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center"
                    }}
                  >
                    <Text
                      style={{ color: "white", fontSize: 14, lineHeight: 25 }}
                    >
                      SPENT:{" "}
                    </Text>
                    <FastImage
                      source={coinIcon}
                      style={{ width: 25, height: 20 }}
                    />

                    <Text
                      style={{ color: "white", fontSize: 12, lineHeight: 25 }}
                    >
                      {" "}
                      {this._getTicket()} {this._getTicketTxt()}{" "}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flex: 0.65,
                    justifyContent: "flex-end",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 10
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 20,
                      lineHeight: 25,
                      fontWeight: "bold"
                    }}
                  >
                    YOU WINNER !
                  </Text>

                  <FastImage
                    source={{
                      uri: `${CONFIG.ENDPOINT_OUR}${
                        this.props.info.q_user.avatar
                      }`
                    }}
                    style={{
                      width: 45,
                      height: 45,
                      borderColor: "white",
                      borderWidth: 1,
                      borderRadius: 45
                    }}
                  />
                  <Text
                    style={{
                      color: "white",
                      fontSize: 14,
                      fontWeight: "bold",
                      lineHeight: 25
                    }}
                  >
                    {this.props.info.q_user.mobile_number}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        );

      } else {
        return (
          <View style={styles.cardContainer}>
            <View style={{ flexDirection: "row", paddingTop: 10 }}>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <FastImage
                  source={{
                    uri: `${this.props.info.cloud_url}${
                      this.props.info.upload_path_url
                    }${this.props.info.thumb}`
                  }}
                  style={{ width: 70, height: 65 }}
                />
              </View>
              <View style={{ flexDirection: "column", paddingHorizontal: 10 }}>
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 21,
                    width: windowSize.width - 130
                  }}
                  numberOfLines={2}
                >
                  {this.props.info.title}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    lineHeight: 23,
                    color: CONFIG.SECONDARY_COLOR
                  }}
                >
                  Period No : {this.props.info.qishu}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    lineHeight: 23,
                    color: CONFIG.SECONDARY_COLOR
                  }}
                >
                  Spent : {this._getTicket()}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    lineHeight: 23,
                    color: CONFIG.SECONDARY_COLOR
                  }}
                >
                  Winner Number : {this.props.info.q_user_code}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginTop: 5,
                alignItems: "center",
                marginBottom: 10
              }}
            >
              <View
                style={{
                  flex: 0.8,
                  flexDirection: "row",
                  marginTop: 5,
                  paddingTop: 3,
                  alignItems: "center"
                }}
              >
                <Text style={{ color: CONFIG.PRIMARY_COLOR }}>
                  Winner: {this.props.info.q_user.mobile_number}
                </Text>
                <FastImage
                  source={cupIcon}
                  style={{
                    width: 30,
                    height: 30,
                    marginLeft: 15
                  }}
                />
              </View>
              <View style={styles.buyBtnContainer}>
                <TouchableOpacity
                  onPress={this.onGoNextPeriod.bind(this, this.props.info)}                  
                > 
                  <View style = {styles.buyBtnBack} >
                    <Text style={styles.buyBtn}>BUY NOW</Text>
                  </View>
                {/*                 
                  <FastImage
                    style={styles.buyBtnImg}
                    source={require("../../../assets/bg_yellow_btn_default.png")}
                  />

                  <Text style={styles.buyBtn}>BUY NOW</Text>
                  */}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      }
    }
  }

  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={this.goOtherPage.bind(this, 1, this.props.info)}
      >
        {this._renderCardType()}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    width: windowSize.width,
    backgroundColor: "white",
    flexDirection: "column",
    position: "relative",
    marginBottom: 5,
    paddingHorizontal: 10
  },
  cardImage: {
    resizeMode: "stretch",
    width: 90,
    height: 105,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3
  },
  cardTitleContainer: {
    justifyContent: "center"
  },
  cardTitle: {
    color: CONFIG.Forth_COLOR,
    fontSize: 11,
    textAlign: "left",
    paddingHorizontal: 5,
    paddingTop: 5,
    lineHeight: 15
  },
  priceContainer: {
    marginLeft: 5,
    marginTop: 5,
    marginBottom: 6
  },
  priceTitle: {
    color: CONFIG.SECONDARY_COLOR,
    fontSize: 10
  },
  imgContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  progressContainer: {
    marginTop: 23,
    marginLeft: 5,
    paddingBottom: 3,
    position: "relative"
  },
  buyBtnContainer: {
    flex: 0.2,
    alignItems: "flex-end",
    position: "relative",
    zIndex: 200
  },
  buyBtnBack: {
    width: 65,
    height: 27,
    borderRadius: 3,
    backgroundColor: CONFIG.BUTTON_COLOR,
  },
  buyBtnImg: {
    width: 65,
    height: 27,
    borderRadius: 3
  },
  cardBottom: {
    flexDirection: "row"
  },
  buyBtn: {
    fontSize: 12,
    textAlign: "center",
    color: "white",
    position: "absolute",
    top: 5,
    left: 5
  },
  progressTitle: {
    fontSize: 8,
    color: CONFIG.SECONDARY_COLOR,
    position: "absolute",
    top: -12
  },
  percentTtile: {
    position: "absolute",
    right: 0,
    fontSize: 8,
    color: CONFIG.Percent_bar,
    top: -12
  }
});

