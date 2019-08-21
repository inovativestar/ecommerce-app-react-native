import React, { PureComponent } from "react";
import { Container } from "native-base";
import BackgroundImage from "./bg-image";
const bgImage = require("../../assets/bg_splash.png");

import { Platform, Dimensions, PixelRatio, AsyncStorage } from "react-native";

class Boot extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <BackgroundImage image={bgImage} />
      </Container>
    );
  }
}

export default Boot;
