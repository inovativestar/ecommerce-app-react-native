import React, { PureComponent } from "react";

import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions
} from "react-native";

import CONFIG from "../../../configs";
import { Actions } from "react-native-router-flux";
import FastImage from 'react-native-fast-image';

var windowSize = Dimensions.get("window");

export default class CardUnshare extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { default_avartar: "public/avatar/default.jpg", coin_val: 1 };
  }

  goOtherPage = (cardid, obj) => {
    Actions.WonProduct({ params: { obj: obj } });
  }

  onLeaveReview = (obj) => {
    Actions.FeedbackWrite({ params: { obj: obj } });
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

  _renderCardType = () => {
    if (this.props.info.q_end_time != null) {
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
                {this.props.info.q_end_time}
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
              alignItems: "center",
              marginBottom: 10
            }}
          >
            <View
              style={{
                flex: 0.7,
                flexDirection: "row",
                paddingTop: 3,
                alignItems: "center"
              }}
            />
            <View style={styles.buyBtnContainer}>
              <TouchableOpacity
                onPress={this.onLeaveReview.bind(this, this.props.info)}
              >
                <View
                    style = {styles.buyBtnBack}
                   >
                    <Text style={styles.buyBtn}>BUY NOW</Text>
                </View>
                  {/*
                <FastImage
                  style={styles.buyBtnImg}
                  source={require("../../../assets/bg_yellow_btn_default.png")}
                />
                <Text style={styles.buyBtn}>Leave Review</Text>
                */}
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
        onPress={this.goOtherPage.bind(this, 2, this.props.info)}
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
    flex: 0.3,
    alignItems: "flex-end",
    position: "relative",
    zIndex: 200
  },
  buyBtnBack: {
    width: 100,
    height: 27,
    borderRadius: 3,
    backgroundColor: CONFIG.BUTTON_COLOR,
  },
  buyBtnImg: {
    width: 100,
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
    left: 13
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

