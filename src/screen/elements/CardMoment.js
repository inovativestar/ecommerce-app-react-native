import React, { PureComponent } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet
} from "react-native";

import CONFIG from "../../configs";
import FastImage from 'react-native-fast-image';

export default class CardMoment extends PureComponent {
  constructor(props) {
    super(props);
  }

  _onPressComponent = () => {
    this.props.showReview(this.props.info);
  }

  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={this._onPressComponent}
      >
        <View style={styles.cardContainer}>
          <View style={styles.imgContainer}>
            <FastImage
              style={styles.cardImage}
              source={{
                uri: `${CONFIG.ENDPOINT_OUR}${this.props.info.pic_arr[0]}`
              }}
            />
            <FastImage
              style={styles.avatar_img}
              source={{
                uri: `${CONFIG.ENDPOINT_OUR}${this.props.info.user_photo}`
              }}
            />
          </View>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {this.props.info.feedback}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    height: 165,
    width: 150,
    backgroundColor: "white",
    flexDirection: "column",
    marginRight: 5,
    borderRadius: 3,
    zIndex: 0.5
  },
  cardImage: {
    width: "100%",
    height: "100%",
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
    position: "absolute",
    width: 30,
    height: 30,
    bottom: 3,
    left: 11,
    borderRadius: 40
  }
});
