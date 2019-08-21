import React, { PureComponent } from "react";

import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions
} from "react-native";

import axios from "axios";
import CONFIG from "../../configs";
import { Actions } from "react-native-router-flux";
import FastImage from 'react-native-fast-image';

var windowSize = Dimensions.get("window");

export default class CardUserWon extends PureComponent {
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
    console.log("CardUserWon.js", "onGoNextPeriod", URL);
    
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
    this.props.info.pitem.record.map(info => {
      if (info.uid == this.props.userId) {
        ticket = ticket + parseInt(info.gonumber);
      }
    });
    return ticket;
  }

  _renderCardType = () => {
    if (this.props.info.pitem.q_end_time != null && this.props.info.pitem.q_uid == this.props.userId) {
      return (
        <View style={styles.cardContainer}>
          <View
            style={{ flexDirection: "row", paddingTop: 10, paddingBottom: 5 }}
          >
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <FastImage
                source={{
                  uri: `${this.props.info.pitem.cloud_url}${
                          this.props.info.pitem.upload_path_url}${
                          this.props.info.pitem.thumb}`
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
                {this.props.info.pitem.title}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  lineHeight: 23,
                  color: CONFIG.SECONDARY_COLOR
                }}
              >
                {this.props.info.pitem.q_end_time}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  lineHeight: 23,
                  color: CONFIG.SECONDARY_COLOR
                }}
              >
                Period No : {this.props.info.pitem.qishu}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  lineHeight: 23,
                  color: CONFIG.SECONDARY_COLOR
                }}
              >
                Winning Number : {this.props.info.pitem.q_user_code}
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
        </View>
      );
    }
  }

  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={this.goOtherPage.bind(this, 2, this.props.info.pitem)}
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
  buyBtnImg: {
    width: 65,
    height: 27,
    borderRadius: 3,
    resizeMode: "stretch"
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
