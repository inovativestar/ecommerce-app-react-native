import React, { PureComponent } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Animated,
  Easing
} from "react-native";

import { Thumbnail } from "native-base";

//const bubble_ico = require("../../assets/ic_bubble_spent1.png");
//const winner_ico = require("../../assets/ic_bubble_winner.png");

var windowSize = Dimensions.get("window");

export default class NotifyBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      bubble_txt:
        "Wow ! 0123***7894 spent 2 tickets in Apple 1 (Apple) iPhone 6 (A1586) 16GB Gold Mobile",
      winner_txt:
        "Congrats ! 0123***7894 won Apple 1 (Apple) iPhone 6 (A1586) 16GB Gold Mobile",
      color: "#f90338",
      spent_txt: "",
      logo_ico: require("../../assets/ic_bubble_winner.png"),
      notifyIndex:0,
      prev_notify:""
    };
    this.animatedValue = new Animated.Value(0);
    this.animatedValue_2 = new Animated.Value(0);
    this.animatedValue_3 = new Animated.Value(0);
    this.animatedValue_4 = new Animated.Value(0);
  }

  componentDidMount() {
    this.animate();
    this._interval1 = setInterval(() => {      
      this.animate();
    }, 6000);
  }

  getRandomInt = () => {
    var record_index = Math.floor(
      Math.random() * Math.floor(this.props.info.length)
    );

    if (this.props.info.length != 0) {
      if (this.props.info[record_index].huode != 0) {
        this.setState({
          winner_txt:
            "Congrats! " +
            this.props.info[record_index].username +
            "  won on " +
            this.props.info[record_index].shopname,
          logo_ico: require("../../assets/ic_bubble_winner.png")
        });
      } else {
        var ticket_txt =
          this.props.info[record_index].gonumber == 1
            ? " ticket on "
            : " tickets on ";
        this.setState({
          bubble_txt:
            "Wow! " +
            this.props.info[record_index].username +
            " spent " +
            this.props.info[record_index].gonumber +
            ticket_txt +
            this.props.info[record_index].shopname,
          logo_ico: require("../../assets/ic_bubble_winner.png")
        });
      }
    }
  }

  _first_animate = () => {
    this.getRandomInt();
    this.animatedValue_2.setValue(0);
    
    Animated.timing(this.animatedValue_2, {
      toValue: 1,
      duration: 6000,
      easing: Easing.linear
    }).start();
  }

  _second_animate = () => {
    this.getRandomInt();
    this.animatedValue_3.setValue(0);

    Animated.timing(this.animatedValue_3, {
      toValue: 1,
      duration: 6000,
      easing: Easing.linear
    }).start();
  }

  _third_animate = () => {
    this.getRandomInt();
    this.animatedValue_4.setValue(0);
    
    Animated.timing(this.animatedValue_4, {
      toValue: 1,
      duration: 6000,
      easing: Easing.linear
    }).start();
  
  }
  getNotify = () => {

    var txt = this.state.notifyIndex== 2 ? this.state.bubble_txt : this.state.winner_txt;
    var notifyStyles = [styles.cardContainer, styles.cardContainer_2, styles.cardContainer_3, styles.cardContainer_4]
    var notifyStyle = notifyStyles[this.state.notifyIndex];
    
    return (
    <Animated.View
          style={[
            notifyStyle,
            {
                opacity: this.animatedValue.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 1, 1]
                }),
                bottom: this.animatedValue.interpolate({
                    inputRange: [0, 0.3, 0.7, 1],
                    outputRange: [-30, 0, 0, 0]
                })
            }
          ]}
        >
          <Thumbnail
            square
            source={require("../../assets/ic_bubble_winner.png")}
            style={{ width: 18, height: 18, marginRight: 12 }}
          />
          <View style={styles.txtContainer}>
            <Text
              style={styles.notiTitle}
              numberOfLines={1}
              ellipsizeMode={"tail"}
            >
              {txt}
            </Text>
          </View>
        </Animated.View>
    );

  }
  getPrevNotify = () => {

    var notifyStyles = [styles.cardContainer, styles.cardContainer_2, styles.cardContainer_3, styles.cardContainer_4]
    var notifyStyle = notifyStyles[(this.state.notifyIndex + 2) % 3];
    return (
    <View style={ notifyStyle } >
        <Thumbnail
          square
          source={require("../../assets/ic_bubble_winner.png")}
          style={{ width: 18, height: 18, marginRight: 12 }}
        />
        <View style={styles.txtContainer}>
          <Text
            style={styles.notiTitle}
            numberOfLines={1}
            ellipsizeMode={"tail"}
          >
            {this.state.prev_notify}
          </Text>
        </View>
      </View>
    );
  }
  animate = () => {

    this.state.prev_notify = this.state.notifyIndex == 2 ? this.state.bubble_txt : this.state.winner_txt;
    this.setState({notifyIndex: (this.state.notifyIndex + 1) % 3})

    this.getRandomInt();    
    
    this.animatedValue.setValue(0);
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 6000,
      easing: Easing.linear
    }).start();
    //setTimeout(() => {this._first_animate();}, 8400);
    //setTimeout(() => {this._second_animate();}, 8400);
    //setTimeout(() => {this._third_animate();}, 12600);
    //setTimeout(() => {this.animate();}, 8400);
    //this._first_animate();
    //this._second_animate();
    //this._third_animate();


  }
  animate2 = () => {
    this.getRandomInt();  
    this.animatedValue_2.setValue(0);
    Animated.timing(this.animatedValue_2, {
      toValue: 1,
      duration: 6000,
      easing: Easing.linear
    }).start();
  }

  render() {
    return (
      <View style={styles.animate_container}>
        {this.getPrevNotify()}
        {this.getNotify()}

        {/*
        <Animated.View
          style={[
            styles.cardContainer,
            {
                opacity: this.animatedValue.interpolate({
                    inputRange: [0, 0.5, 0.7, 1],
                    outputRange: [1, 1, 1, 0.2]
                }),
                bottom: this.animatedValue.interpolate({
                    inputRange: [0, 0.3, 0.7, 1],
                    outputRange: [-30, 0, 0, 0]
                })
            }
          ]}
        >
          <Thumbnail
            square
            source={require("../../assets/ic_bubble_winner.png")}
            style={{ width: 18, height: 18, marginRight: 12 }}
          />
          <View style={styles.txtContainer}>
            <Text
              style={styles.notiTitle}
              numberOfLines={1}
              ellipsizeMode={"tail"}
            >
              {this.state.winner_txt}
            </Text>
          </View>
        </Animated.View>
        */}
        {/*
        <Animated.View
          style={[
            styles.cardContainer_2,
            {
                opacity: this.animatedValue_2.interpolate({
                    //red
                    inputRange: [0, 0.3, 0.9, 1],
                    outputRange: [0.5, 1, 0.9, 0.4]
                }),
                bottom: this.animatedValue_2.interpolate({
                    inputRange: [0, 0.3, 0.7, 1],
                    outputRange: [-30, 0, 0, 30]
                })
            }
          ]}
        >
          <Thumbnail
            square
            source={require("../../assets/ic_bubble_winner.png")}
            style={{ width: 18, height: 18, marginRight: 12 }}
          />
          <View style={styles.txtContainer}>
            <Text
              style={styles.notiTitle}
              numberOfLines={1}
              ellipsizeMode={"tail"}
            >
              {this.state.winner_txt}
            </Text>
          </View>
        </Animated.View>
        */}
        {/*
        <Animated.View
          style={[
            styles.cardContainer_3,
            {
                opacity: this.animatedValue_3.interpolate({
                    inputRange: [0, 0.3, 0.9, 1],
                    outputRange: [0.5, 1, 0.9, 0.4]
                }),
                bottom: this.animatedValue_3.interpolate({
                    inputRange: [0, 0.35, 0.72, 1],
                    outputRange: [-30, 0, 0, 30]
                })
            }
          ]}
        >
          <Thumbnail
            square
            source={bubble_ico}
            style={{ width: 18, height: 18, marginRight: 12 }}
          />
          <View style={styles.txtContainer}>
            <Text
              style={styles.notiTitle}
              numberOfLines={1}
              ellipsizeMode={"tail"}
            >
              {this.state.bubble_txt}
            </Text>
          </View>
        </Animated.View>
        <Animated.View
          style={[
            styles.cardContainer_4,
            {
                opacity: this.animatedValue_4.interpolate({
                    inputRange: [0, 0.3, 0.9, 1],
                    outputRange: [0.5, 1, 0.9, 0.4]
                }),
                bottom: this.animatedValue_4.interpolate({
                    inputRange: [0, 0.35, 0.72, 1],
                    outputRange: [-30, 0, 0, 30]
                })
            }
          ]}
        >
          <Thumbnail
            square
            source={bubble_ico}
            style={{ width: 18, height: 18, marginRight: 12 }}
          />
          <View style={styles.txtContainer}>
            <Text
              style={styles.notiTitle}
              numberOfLines={1}
              ellipsizeMode={"tail"}
            >
              {this.state.winner_txt}
            </Text>
          </View>
        </Animated.View>
        */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  animate_container: {
    height: 30,
    width: windowSize.width,
    position: "relative",
    zIndex: 0.5
  },
  cardContainer: {
    height: 30,
    width: windowSize.width,
    backgroundColor: "#fe7f19",
    flexDirection: "row",
    paddingHorizontal: 5,
    paddingVertical: 3,
    alignItems: "center",
    position: "absolute"
  },
  cardContainer_2: {
    height: 30,
    width: windowSize.width,
    backgroundColor: "#f90338",
    flexDirection: "row",
    paddingHorizontal: 5,
    paddingVertical: 3,
    alignItems: "center",
    position: "absolute"
  },
  cardContainer_3: {
    height: 30,
    width: windowSize.width,
    backgroundColor: "#3499de",
    flexDirection: "row",
    paddingHorizontal: 5,
    paddingVertical: 3,
    alignItems: "center",
    position: "absolute"
  },
  cardContainer_4: {
    height: 30,
    width: windowSize.width,
    backgroundColor: "#fe7f19",
    flexDirection: "row",
    paddingHorizontal: 5,
    paddingVertical: 3,
    alignItems: "center",
    position: "absolute"
  },
  notiTitle: {
    fontFamily: "Zocial",
    fontSize: 11,
    color: "white",
    paddingRight: 10,
    width: windowSize.width - 30
  },
  txtContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 10
  }
});
