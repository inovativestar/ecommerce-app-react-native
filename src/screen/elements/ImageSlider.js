import React, { PureComponent } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  PanResponder,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions
} from "react-native";

import FastImage from 'react-native-fast-image';
const reactNativePackage = require("react-native/package.json");
//const splitVersion = reactNativePackage.version.split(".");
//const majorVersion = +splitVersion[0];
//const minorVersion = +splitVersion[1];

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#EEE"
  },
  buttons: {
    height: 15,
    marginTop: -15,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  button: {
    margin: 3,
    width: 6,
    height: 6,
    borderRadius: 6 / 2,
    backgroundColor: "#ccc",
    opacity: 0.9
  },
  buttonSelected: {
    opacity: 1,
    backgroundColor: "#fff"
  }
});

export default class ImageSlider extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      position: 0,
      height: Dimensions.get("window").width * (4 / 9) + 30,
      width: Dimensions.get("window").width,
      scrolling: false
    };
  }

  _onRef = (ref) => {
    this._ref = ref;
    if (ref && this.state.position !== this._getPosition()) {
      this._move(this._getPosition());
    }
  }

  _move = (index) => {
    const splitVersion = reactNativePackage.version.split(".");
const majorVersion = +splitVersion[0];
const minorVersion = +splitVersion[1];

    const isUpdating = index !== this._getPosition();
    const x = this.state.width * index;
    if (majorVersion === 0 && minorVersion <= 19) {
      this._ref.scrollTo(0, x, true); // use old syntax
    } else {
      this._ref.scrollTo({ x: this.state.width * index, y: 0, animated: true });
    }
    this.setState({ position: index });
    if (isUpdating && this.props.onPositionChanged) {
      this.props.onPositionChanged(index);
    }
  }

  _getPosition() {
    if (typeof this.props.position === "number") {
      return this.props.position;
    }
    return this.state.position;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.position !== this.props.position) {
      this._move(this.props.position);
    }
  }

  componentWillMount() {
    const width = this.state.width;

    let release = (e, gestureState) => {
      const width = this.state.width;
      const relativeDistance = gestureState.dx / width;
      const vx = gestureState.vx;
      let change = 0;

      if (relativeDistance < -0.5 || (relativeDistance < 0 && vx <= 0.5)) {
        change = 1;
      } else if (
        relativeDistance > 0.5 ||
        (relativeDistance > 0 && vx >= 0.5)
      ) {
        change = -1;
      }
      const position = this._getPosition();
      if (position === 0 && change === -1) {
        change = 0;
      } else if (position + change >= this.props.images.length) {
        change = this.props.images.length - (position + change);
      }
      this._move(position + change);
      return true;
    };

    this._panResponder = PanResponder.create({
      onPanResponderRelease: release
    });

    this._interval = setInterval(() => {
      const newWidth = Dimensions.get("window").width;
      var pos = this._getPosition() + 1;
      if (pos == this.props.images.length) pos = 0;

      this._move(pos);
      if (newWidth !== this.state.width) {
        this.setState({ width: newWidth });
      }
    }, 3000);
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  _onPressImage = (image, index) => {
    this.props.onPress({ image, index });
  }

  _onPressSlideButton = (index) => {
    this._move(index);
  }

  render() {
    const width = this.state.width;
    const height = this.props.height || this.state.height;
    return (
      <View style={{ zIndex: 200 }}>
        <ScrollView
          ref={this._onRef.bind(this)}
          decelerationRate={0.99}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          {...this._panResponder.panHandlers}
          style={[styles.container, this.props.style, { height: height }]}
        >
          {this.props.images.map((image, index) => {
            const imageObject =
              typeof image === "string" ? { uri: image } : image;
            const imageComponent = (
              <FastImage
                key={index}
                source={imageObject}
                style={{ height, width }}
              />
            );
            if (this.props.onPress) {
              return (
                <TouchableOpacity
                  activeOpacity={0.9}
                  key={index}
                  style={{ height, width }}
                  onPress={this._onPressImage.bind(this, image, index)}
                >
                  {imageComponent}
                </TouchableOpacity>
              );
            } else {
              return imageComponent;
            }
          })}
        </ScrollView>
        <View style={styles.buttons}>
          {this.props.images.map((image, index) => {
            return (
              <TouchableHighlight
                key={index}
                underlayColor="#ccc"
                onPress={this._onPressSlideButton.bind(this, index)}
                style={[
                  styles.button,
                  this._getPosition() === index && styles.buttonSelected
                ]}
              >
                <View />
              </TouchableHighlight>
            );
          })}
        </View>
      </View>
    );
  }
}
