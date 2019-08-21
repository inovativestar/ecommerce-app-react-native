import React, { PureComponent } from "react";
import FastImage from 'react-native-fast-image';
import { StyleSheet } from "react-native";

class BackgroundImage extends PureComponent {
  render() {
    return <FastImage source={this.props.image} style={Style.image} />;
  }
}

const Style = StyleSheet.create({
  image: {
    flex: 1,
    width: "100%",
    height: "100%"
  }
});

export default BackgroundImage;
