import React, { PureComponent } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions
} from "react-native";

import CONFIG from "../../configs";
import StarRating from "react-native-star-rating";
import FastImage from 'react-native-fast-image';

var windowSize = Dimensions.get("window");
//const playUserIcon = require("../../assets/ic_avatar_default3.png");

export default class CardReview extends PureComponent {
  constructor(props) {
    super(props);
  }

  _onPressComponent = () => {
    this.props.detailReview(this.props.info);
  }

  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.cardContainer}
        onPress={this._onPressComponent}
      >
        <View style={styles.userContainer}>
          <View>
            <FastImage
              source={{
                uri: `${CONFIG.ENDPOINT_OUR}${this.props.info.user_photo}`
              }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 50
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "column",
              marginLeft: 15,
              width: windowSize.width - 200
            }}
          >
            <Text
              style={{
                color: CONFIG.PRIMARY_COLOR,
                lineHeight: 25,
                fontSize: 17
              }}
            >
              {this.props.info.mobile_number}
            </Text>
            <View>
              <Text
                numberOfLines={1}
                style={{
                  color: CONFIG.SECONDARY_COLOR,
                  lineHeight: 25,
                  fontSize: 13
                }}
              >
                {this.props.info.created_at}
              </Text>
            </View>
          </View>
          <View style={{ alignItems: "flex-end", paddingTop: 5, width: 100 }}>
            <StarRating
              disabled={true}
              maxStars={5}
              starSize={15}
              rating={this.props.info.score}
              selectedStar={rating => this.onStarRatingPress(rating)}
              fullStarColor={CONFIG.PRIMARY_COLOR}
            />
          </View>
        </View>
        <View style={{ width: windowSize.width - 20, marginTop: 15 }}>
          <Text numberOfLines={2} style={{ width: windowSize.width - 30 }}>
            {this.props.info.feedback}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginTop: 10,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {this.props.info.pic_arr.map((info, index) => (
            <FastImage
              key={index}
              style={{
                width: 140,
                height: 125,
                margin: 5
              }}
              source={{ uri: CONFIG.ENDPOINT_OUR + info }}
            />
          ))}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    width: windowSize.width,
    backgroundColor: "white",
    flexDirection: "column",
    marginBottom: 3,
    borderBottomColor: CONFIG.Green_COLOR,
    borderTopColor: CONFIG.Green_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  userContainer: {
    flexDirection: "row"
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
    position: "absolute",
    width: 30,
    height: 30,
    resizeMode: "stretch",
    bottom: 3,
    left: 11,
    borderRadius: 40
  }
});
