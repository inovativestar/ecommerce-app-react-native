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

//const readMessage = require("../../assets/ic_message_read_24dp2.png");
//const unReadMessage = require("../../assets/ic_message_normal_24dp5.png");

var windowSize = Dimensions.get("window");

export default class CardNotify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { coin_val: 1 };
  }

  _onPressComponent = () => {
    this.props.showWonProduct(this.props.info)
  }

  _getImageSource = () => {
    if (this.props.info.feedback == 1 || this.props.info.feedback == null) {
      return require("../../assets/ic_message_normal_24dp5.png");
    } else {
      return require("../../assets/ic_message_read_24dp2.png");
    }
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.cardContainer}
        activeOpacity={0.9}
        onPress={this._onPressComponent}
      >
        <View
          style={{
            flex: 1,
            height: 50,
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 10
            }}
          >
            <FastImage
              source={this._getImageSource()}
              style={{ width: 22, height: 22 }}
            />
          </View>

          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 12,
                color: CONFIG.SECONDARY_COLOR,
                width: windowSize.width / 2
              }}
              numberOfLines={1}
            >
              You Won in {this.props.info.title}
            </Text>
          </View>
          <View style={{ paddingLeft: 10 }}>
            <Text style={{ fontSize: 12, color: "#DDD" }}>
              {this.props.info.q_end_time}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "white",
    zIndex: 0.5,
    position: "relative",
    marginBottom: 1
  }
});

