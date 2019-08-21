import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  Animated
} from "react-native";

class Show extends PureComponent {
  constructor() {
    super();
    this.springValue = new Animated.Value(0.3);
    this.opacityValue = new Animated.Value(0.1);
  }

  spin = () => {
    this.springValue.setValue(0);
    this.opacityValue.setValue(0);
    Animated.parallel([
      Animated.spring(this.springValue, {
        toValue: 1,
        friction: 1
      }),
      Animated.timing(this.opacityValue, {
        toValue: 1,
        duration: 7000
      })
    ]).start(() => this.spin());
  }

  render() {
    const scaleText = this.springValue.interpolate({
      inputRange: [0, 0.2, 1],
      outputRange: [0.1, 1, 1]
    });
    const opacity = this.opacityValue.interpolate({
      inputRange: [0, 0.9, 1],
      outputRange: [1, 1, 0]
    });
    return <View style={{ flex: 1 }} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  box: {
    backgroundColor: "blue",
    width: 50,
    height: 100
  }
});

export default Show;
