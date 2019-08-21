import React, { PureComponent } from "react";

import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  Animated,
  Easing
} from "react-native";

import * as Progress from "react-native-progress";
import CONFIG from "../../configs";
import FastImage from 'react-native-fast-image';


//const playUserIcon = require("../../assets/ic_avatar_default3.png");
//const coinIcon = require("../../assets/bg_coin_backage.png");

var windowSize = Dimensions.get("window");
var _interuptAnimation = false;
export default class CardProduct extends PureComponent {

  constructor(props) {
    super(props);
    this.state = { default_avartar: "public/avatar/default.jpg", coin_val: 1 };
    this.animatedValue = new Animated.Value(0);
    
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.disableAnimation == false && this.props.disableAnimation == true ) {
      _interuptAnimation = true;
      console.log("interupt animation");
      var x = Math.floor(Math.random() * 3 + 2);
      this.animate(x * 1000);
    }
  }

  componentDidMount() {

    var x = Math.floor(Math.random() * 10 + 5);
    this._interval = setInterval(() => {
      if (this.props.info.record.length != 0) {
        this.getRandomInt();
      }
      if(_interuptAnimation == false) this.animate();
    }, 1000 * x);
    
  }

  animate = (delay = 0) => {
    this.animatedValue.setValue(0);

    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(this.animatedValue, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear
      })
    ]).start(() => {
      _interuptAnimation = false;
    });
  }

  getRandomInt = () => {
    var record_index = Math.floor(
      Math.random() * Math.floor(this.props.info.record.length)
    );
    this.setState({
      default_avartar: this.props.info.record[record_index].uphoto,
      coin_val: this.props.info.record[record_index].gonumber
    });
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  _onPressItem = () => {
    this.props.showDetail(this.props.info);
  }

  _onPressBuyNow = () => {
    this.props.buyNow(this.props.info);
  }

  _getPercentage = () => {
    let percent_temp = (this.props.info.canyurenshu / this.props.info.zongrenshu) * 10000;
    let percent = parseInt(parseInt(percent_temp) / 100);
    if ((percent_temp != 0) & (percent == 0)) {
      let percent = parseInt(percent_temp) / 100;
    }
    return percent;
  }

  _renderMuliTicket = () => {
    if (this.props.info.yunjiage > 1) {
      return (
        <View
          style={{
            backgroundColor: "red",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 3,
            height: 15
          }}
        >
          <Text style={{ color: "white", fontSize: 10 }}>
            {parseInt(this.props.info.yunjiage)} Tickets
          </Text>
        </View>
      );
    } else {
      return null;
    }
  }

  _renderUserAnimate = () => {
    if (this.props.info.record.length > 0) {
      console.log("CardProduct-animation Rendered", this.props.info.title);
      return (
        <Animated.Image
          style={{
            opacity: this.animatedValue.interpolate({
                inputRange: [0, 0.1, 0.3, 1],
                outputRange: [0, 1, 1, 0]
            }),
            height: this.animatedValue.interpolate({
                inputRange: [0, 0.2, 1],
                outputRange: [12, 12, 8]
            }),
            position: "absolute",
            width: this.animatedValue.interpolate({
                inputRange: [0, 0.2, 1],
                outputRange: [12, 12, 8]
            }),
            borderRadius: this.animatedValue.interpolate({
                inputRange: [0, 0.2, 1],
                outputRange: [12, 12, 8]
            }),
            bottom: this.animatedValue.interpolate({
                inputRange: [0, 0.1, 0.7, 1],
                outputRange: [32, 50, 132, 152]
            }),
            right: this.animatedValue.interpolate({
                inputRange: [0, 0.2, 1],
                outputRange: [32, 32, 17]
            }),
            zIndex: 300
          }}
          source={require("../../assets/bg_coin_backage.png")}
        />
      );
    } else {
      return <View />;
    }
  }

  _renderTxtAnimate = () => {
    if (this.props.info.record.length > 0) {

      var len = this.state.coin_val.toString().length;
      
      var right = this.animatedValue.interpolate({
          inputRange: [0, 0.2, 1],
          outputRange: [25, 25, 12]                
        });
      if (len == 2)
        right = this.animatedValue.interpolate({
          inputRange: [0, 0.2, 1],
          outputRange: [19, 19, 6]                
        });
      else if (len > 2)
        right = this.animatedValue.interpolate({
          inputRange: [0, 0.2, 1],
          outputRange: [13, 13, 1]                
        });

      return (
        <Animated.Text
          style={{
            opacity: this.animatedValue.interpolate({
                inputRange: [0, 0.1, 0.3, 1],
                outputRange: [0, 1, 1, 0]
            }),
            fontSize: this.animatedValue.interpolate({
                inputRange: [0, 0.2, 1],
                outputRange: [12, 12, 7]
            }),
            bottom: this.animatedValue.interpolate({
                inputRange: [0, 0.1, 0.7, 1],
                outputRange: [30, 48, 130, 150]
            }),
            zIndex: 300,
            right: right,
            position: "absolute",
            color: CONFIG.SECONDARY_COLOR
          }}
        >
          {this.state.coin_val}
        </Animated.Text>
      );
    } else {
      return <View />;
    }
  }

  _renderCoinAnimate = () => {
    if (this.props.info.record.length > 0) {
      return (
        <Animated.Image
          style={{
            opacity: this.animatedValue.interpolate({
                inputRange: [0, 0.1, 0.3, 1],
                outputRange: [0, 1, 1, 0]
            }),
            height: this.animatedValue.interpolate({
                inputRange: [0, 0.2, 1],
                outputRange: [20, 20, 10]
            }),
            position: "absolute",
            width: this.animatedValue.interpolate({
                inputRange: [0, 0.2, 1],
                outputRange: [20, 20, 10]
            }),
            borderRadius: this.animatedValue.interpolate({
                inputRange: [0, 0.2, 1],
                outputRange: [20, 20, 10]
            }),
            bottom: this.animatedValue.interpolate({
              inputRange: [0, 0.1, 0.7, 1],
              outputRange: [28, 29, 130, 150]
            }),
            right: 2,
            zIndex: 300
          }}
          source={{ uri: CONFIG.ENDPOINT_OUR + this.state.default_avartar }}
        />
      );
    } else {
      return <View />;
    }
  }

  render() {
    //console.log("CardProduct Render", this.props.info.title);
    
    return (
      <TouchableOpacity
        style={styles.cardContainer}
        activeOpacity={0.9}
        onPress={this._onPressItem}
      >
        <View style={styles.cardTitleContainer}>
          {this._renderMuliTicket()}
          <Text style={styles.cardTitle} numberOfLines={2}>
            {this.props.info.title}
          </Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceTitle}>Coins:{this.props.info.money}</Text>
        </View>
        <View style={styles.imgContainer}>    
        {console.log("CardProduct.js", this.props.info.thumb)}    
          <FastImage
            style={styles.cardImage}
            source={{
              uri: `${this.props.info.cloud_url}${
                this.props.info.upload_path_url
              }${this.props.info.thumb}`
            }}
          />
        </View>
        {!this.props.disableAnimation && this._renderUserAnimate()}
        {!this.props.disableAnimation && this._renderTxtAnimate()}
        {!this.props.disableAnimation && this._renderCoinAnimate()}

        <View style={styles.cardBottom}>
          <View style={styles.progressContainer}>
            <Text style={styles.progressTitle}>Progress</Text>
            <Text style={styles.percentTtile}>{this._getPercentage()}%</Text>
            <Progress.Bar
              progress={this._getPercentage() / 100}
              height={3}
              color={CONFIG.Percent_bar}
              borderColor={"white"}
              unfilledColor={"#CCC"}
              width={windowSize.width / 4 + 10}
            />
          </View>
          <View style={styles.buyBtnContainer}>
            <TouchableOpacity
              onPress={this._onPressBuyNow}
            >
              <View style = {styles.buyBtnBack} >
                  <Text style={styles.buyBtn}>BUY NOW</Text>
              </View>
            {/*
              <FastImage
                style={styles.buyBtnImg}
                source={require("../../assets/bg_yellow_btn_default.png")}
              /> 
              <Text style={styles.buyBtn}>BUY NOW</Text>
              */}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    width: (windowSize.width - 10) / 2,
    height: 210,
    backgroundColor: "white",
    flexDirection: "column",
    margin: 2,
    borderRadius: 2,
    zIndex: 0.5,

    position: "relative"
  },
  cardImage: {
    width: 90,
    height: 110,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3
  },
  cardTitleContainer: {
    alignItems: "center",
    flexDirection: "row",
    height: 35
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
  progressContainer: {
    marginTop: 23,
    marginLeft: 5,
    paddingBottom: 3,
    position: "relative"
  },
  buyBtnContainer: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 5,
    position: "relative",
    zIndex: 5.5
  },
  buyBtnBack: {
    width: 55,
    height: 23,
    borderRadius: 3,
    backgroundColor: CONFIG.BUTTON_COLOR,
  },
  buyBtnImg: {
    width: 55,
    height: 23,
    borderRadius: 3
  },
  cardBottom: {
    flexDirection: "row"
  },
  buyBtn: {
    fontSize: 10,
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
