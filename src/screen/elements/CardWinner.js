import React, { PureComponent } from "react";

import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions
} from "react-native";

import CONFIG from "../../configs";
import { Actions } from "react-native-router-flux";
import FastImage from 'react-native-fast-image';

//const coinIcon = require("../../assets/bg_coin_backage.png");

var windowSize = Dimensions.get("window");

export default class CardWinner extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { default_avartar: "public/avatar/default.jpg", coin_val: 1 };
  }

  _onPressComponent = () => {
    this.props.showWonProduct(this.props.info);
  }

  _onPressProfile = () => {
    Actions.UserParticipation({
      params: { user: this.props.info.q_user }
    });
  }

  _getTicket() {
    var ticket = 0;
    this.props.info.record.map(info => {
      if (info.uid == this.props.info.q_user.id) {
        ticket = ticket + parseInt(info.gonumber);
      }
    });
    return ticket;
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.cardContainer}
        activeOpacity={0.9}
        onPress={this._onPressComponent}
      >
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {this.props.info.title}
          </Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceTitle}>Coins:{this.props.info.money}</Text>
        </View>
        <View style={styles.imgContainer}>
          <FastImage
            style={styles.cardImage}
            source={{
              uri: `${this.props.info.cloud_url}${
                this.props.info.upload_path_url
              }${this.props.info.thumb}`
            }}
          />
        </View>
        <View style={styles.cardBottom} />

        <View style={styles.shadow_container} />
        <View style={styles.winner_container}>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={this._onPressProfile}
              style={{
                justifyContent: "flex-start",
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <FastImage
                source={{
                  uri: `${CONFIG.ENDPOINT_OUR}${this.props.info.q_user.avatar}`
                }}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 30
                }}
              />
              <Text
                style={{
                  color: CONFIG.Percent_bar,
                  fontSize: 14,
                  marginLeft: 10,
                  fontWeight: "600"
                }}
              >
                {this.props.info.q_user.mobile_number}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                justifyContent: "flex-end",
                flexDirection: "row",
                flex: 1,
                alignItems: "center"
              }}
            >
              <FastImage
                source={require("../../assets/bg_coin_backage.png")}
                style={{ width: 20, height: 15 }}
              />
              <Text style={{ color: CONFIG.Percent_bar, fontSize: 12 }}>
                {" "}
                {this._getTicket()}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 5, marginLeft: 15 }}>
            <Text style={{ fontSize: 11, color: "white" }}>Winner Number:</Text>
          </View>
          <Text
            style={{ fontSize: 16, color: CONFIG.Percent_bar, marginLeft: 15 }}
          >
            {this.props.info.q_user_code}
          </Text>
          <Text style={{ fontSize: 12, color: "white", marginLeft: 15 }}>
            {this.props.info.q_end_time}
          </Text>
          <Text style={{ fontSize: 12, color: "white", marginLeft: 15 }}>
            Period No: {this.props.info.qishu}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    width: (windowSize.width - 10) / 2,
    height: 230,
    backgroundColor: "white",
    flexDirection: "column",
    margin: 2,
    borderRadius: 2,
    zIndex: 0.5,
    position: "relative"
  },
  cardImage: {
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
    fontWeight: "normal",
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

  cardBottom: {
    flexDirection: "row"
  },
  shadow_container: {
    position: "absolute",
    height: 120,
    width: (windowSize.width - 10) / 2,
    backgroundColor: CONFIG.PRIMARY_COLOR,
    opacity: 0.6,
    bottom: 0,
    zIndex: 90
  },
  winner_container: {
    position: "absolute",
    height: 120,
    width: (windowSize.width - 10) / 2,
    bottom: 0,
    zIndex: 100,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "column"
  }
});
