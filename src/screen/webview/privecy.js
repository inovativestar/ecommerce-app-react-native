import React, { PureComponent } from "react";
import {
  WebView,
  Platform,
  ActivityIndicator,
  StyleSheet
} from "react-native";

import {
  Container,
  Header,
  Body,
  Left,
  Title,
  Button
} from "native-base";

import { Actions } from "react-native-router-flux";
import CONFIG from "../../configs";
import FastImage from 'react-native-fast-image';

//const backIco = require("../../assets/bg_back_arrow.png");

class Privecy extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      verify_code: "",
      code: "",
      phone: "",
      animating: false
    };
  }

  _onPressBackIcon = () => {
    Actions.pop();
  }

  ActivityIndicatorLoadingView() {
    return (
      <ActivityIndicator
        color={CONFIG.Progress_Bar}
        size="large"
        style={styles.ActivityIndicatorStyle}
      />
    );
  }

  render() {
    return (
      <Container style={{ backgroundColor: "#fff" }}>
        <Header
          style={{
            height: 50,
            backgroundColor: "white",
            borderBottomColor: CONFIG.SECONDARY_COLOR,
            borderBottomWidth: 1
          }}
        >
          <Left>
            <Button transparent onPress={this._onPressBackIcon}>
              <FastImage
                source={require("../../assets/bg_back_arrow.png")}
                style={{ width: 15, height: 12 }}
              />
            </Button>
          </Left>
          <Body>
            <Title style={{ color: CONFIG.PRIMARY_COLOR, fontSize: 15 }}>
              Privecy Policy
            </Title>
          </Body>
        </Header>

        <WebView
          style={styles.WebViewStyle}
          source={{ uri: CONFIG.ENDPOINT_OUR + "home/helpcenter/2" }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          renderLoading={this.ActivityIndicatorLoadingView}
          startInLoadingState={true}
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  WebViewStyle: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginTop: Platform.OS === "ios" ? 20 : 0
  },

  ActivityIndicatorStyle: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default Privecy;
