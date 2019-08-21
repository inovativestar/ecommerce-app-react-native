import React, { PureComponent } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions
} from "react-native";

import CONFIG from "../../configs";
import FastImage from 'react-native-fast-image';

var windowSize = Dimensions.get("window");

export default class CardPrevious extends PureComponent {
  constructor(props) {
    super(props);
  }

  _onPressComponent = () => {
    this.props.showWonProduct(this.props.info);
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
        activeOpacity={0.8}
        onPress={this._onPressComponent}
      >
        <View style={styles.cardContainer}>
          <View
            style={{
              height: 35,
              flexDirection: "row",
              borderBottomColor: "#e0e0e0",
              borderBottomWidth: 1,
              alignItems: "center",
              paddingHorizontal: 10
            }}
          >
            <View style={{ justifyContent: "flex-start", flex: 0.5 }}>
              <Text style={{ fontSize: 13 }}>
                Period No: {this.props.info.qishu}
              </Text>
            </View>
            <View style={{ flex: 0.5 }}>
              <Text
                style={{
                  alignSelf: "flex-end",
                  color: CONFIG.SECONDARY_COLOR,
                  fontSize: 13
                }}
              >
                {" "}
                {this.props.info.q_end_time}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 10,
              paddingVertical: 10
            }}
          >
            <View style={{ alignItems: "center", paddingTop: 5 }}>
              <FastImage
                style={styles.avatar_img}
                source={{
                  uri: `${CONFIG.ENDPOINT_OUR}${this.props.info.q_user.avatar}`
                }}
              />
            </View>
            <View style={{ flexDirection: "column", paddingHorizontal: 10 }}>
              <Text
                style={{ lineHeight: 30, color: CONFIG.COLOR_BUTTON_TITLE }}
              >
                Winner: {this.props.info.q_user.mobile_number}
              </Text>
              <Text
                style={{ lineHeight: 30, color: CONFIG.COLOR_BUTTON_TITLE }}
              >
                Spent: {this._getTicket()} ticket
              </Text>
              <Text
                style={{ lineHeight: 30, color: CONFIG.COLOR_BUTTON_TITLE }}
              >
                Winning Number: {this.props.info.q_user_code}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    height: 160,
    width: windowSize.width,
    backgroundColor: "white",
    flexDirection: "column",
    marginBottom: 3
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
    height: 115
  },
  cardTitleContainer: {
    justifyContent: "center"
  },
  cardTitle: {
    color: CONFIG.Forth_COLOR,
    fontSize: 10,
    textAlign: "left",
    paddingHorizontal: 5,
    paddingTop: 7,
    fontFamily: "FontAwesome",
    lineHeight: 15
  },

  imgContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 7,
    paddingTop: 7,
    position: "relative"
  },
  avatar_img: {
    width: 40,
    height: 40,
    borderRadius: 40
  }
});
