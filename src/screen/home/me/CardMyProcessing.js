import React, { PureComponent } from "react";

import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions
} from "react-native";

import axios from "axios";
import * as Progress from "react-native-progress";
import CONFIG from "../../../configs";
import Toast from "../../elements/Toast/lib/Toast";
import { Actions } from "react-native-router-flux";
import FastImage from 'react-native-fast-image';

//const errorIco = require("../../../assets/ic_error_24dp5.png");
var windowSize = Dimensions.get("window");

export default class CardMyProcessing extends PureComponent {
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

  show_toast = (str) => {
          var msg = (
            <View style={{ flexDirection: "row" }}>
              <Image
                source={require("../../../assets/ic_error_24dp5.png")}
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

  onGoNextPeriod(obj) {
    const URL = CONFIG.ENDPOINT_OUR + "/api/getnewperiod/" + obj.sid;
    console.log("CardMyProcessing.js", "onGoNextPeriod", URL);
    
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

  _getTicket = () => {
    var ticket = 0;
    this.props.info.record.map(info => {
      if (info.uid == this.props.userId) {
        ticket = ticket + parseInt(info.gonumber);
      }
    });
    return ticket;
  }

  _getPercent = () => {
    if (this.props.info.q_end_time === null) {
        var percent_temp = (this.props.info.canyurenshu / this.props.info.zongrenshu) * 10000;
        var percent = parseInt(parseInt(percent_temp) / 100);
        if ((percent_temp != 0) & (percent == 0)) {
            var percent = parseInt(percent_temp) / 100;
        }
        return percent;
    }
    return 0;
  }

  _renderCardType = () => {
    if (this.props.info.q_end_time === null) {
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
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  marginTop: 15,
                  alignItems: "center",
                  marginBottom: 10
                }}
              >
                <View style={{ flex: 0.8, flexDirection: "column", marginTop: 5 }}>
                  <Progress.Bar
                    progress={this._getPercent() / 100}
                    height={4}
                    color={CONFIG.Percent_bar}
                    borderColor={"white"}
                    unfilledColor={"#CCC"}
                    width={windowSize.width - 100}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      width: windowSize.width - 100,
                      paddingTop: 3
                    }}
                  >
                    <View style={{ flex: 0.5 }}>
                      <Text
                        style={{
                          alignSelf: "flex-start",
                          fontSize: 13,
                          color: CONFIG.COLOR_BUTTON_TITLE
                        }}
                      >
                        Tickets {this.props.info.zongrenshu}
                      </Text>
                    </View>
                    <View style={{ flex: 0.5 }}>
                      <Text
                        style={{
                          alignSelf: "flex-end",
                          fontSize: 13,
                          color: CONFIG.COLOR_BUTTON_TITLE
                        }}
                      >
                        {" "}
                        {this.props.info.canyurenshu}/{this.props.info.zongrenshu}{" "}
                        Tickets
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.buyBtnContainer}>
                  <TouchableOpacity
                    onPress={this.goOtherPage.bind(this, 0, this.props.info)}
                  >
                    <View style = {styles.buyBtnBack}>
                      <Text style={styles.buyBtn}>BUY NOW</Text>
                    </View>
                    {/*
                    <FastImage
                      style={styles.buyBtnImg}
                      source={require("../../../assets/bg_yellow_btn_default.png")}
                    /> 
                    <Text style={styles.buyBtn}>BUY NOW</Text>
                    */ }
                  </TouchableOpacity>
                </View>
              </View>
            </View>
        );
    }
  }

  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={this.goOtherPage.bind(this, 0, this.props.info)}
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
    backgroundColor: CONFIG.BUTTON_COLOR
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

