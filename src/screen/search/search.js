import React, { PureComponent } from "react";
import {
  View,
  StatusBar,
  Platform,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  TextInput,
  Keyboard
} from "react-native";

import {
  Container,
  Content,
  Header,
  Body,
  Left,
  Title,
  Card,
  Text
} from "native-base";

import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import CONFIG from "../../configs";
import Toast from "../elements/Toast/lib/Toast";
import axios from "axios";
import FastImage from 'react-native-fast-image';

/*
const backIco = require("../../assets/bg_back_arrow.png");
const errorIco = require("../../assets/ic_error_24dp5.png");
const search_icon = require("../../assets/bg_search1.png");
*/

var windowSize = Dimensions.get("window");

class Search extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      verify_code: "",
      isRefreshing: true,
      isVisible_modal_buy: false,
      search_str: ""
    };
  }

  _onRefresh = () => {
    this.setState({ isRefreshing: true });
    this.componentWillMount();
  }

  show_toast = (str) => {
    var msg = (
      <View style={{ flexDirection: "row" }}>
        <FastImage
          source={require("../../assets/ic_error_24dp5.png")}
          style={{ width: 20, height: 18 }}
        />
        <Text style={{ fontSize: 12, color: "white" }}> {str}</Text>
      </View>
    );
    var toast = Toast.show(msg, {
      duration: Toast.durations.LONG,
      position: windowSize.height - 180,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      onShow: () => {
        // calls on toast\`s appear animation start
      },
      onShown: () => {
        // calls on toast\`s appear animation end.
      },
      onHide: () => {
        // calls on toast\`s hide animation start.
      },
      onHidden: () => {
        // calls on toast\`s hide animation end.
      }
    });

    // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
    setTimeout(function() {
      Toast.hide(toast);
    }, 1800);
  }

  showDetail = (obj) => {
    Actions.Productdetail({ params: { obj: obj } });
  }

  showWonProduct = (obj) => {
    Actions.WonProduct({ params: { obj: obj } });
  }

  _goRecommended = (recom_str) => {
    this.setState({ search_str: recom_str });
    const URL = CONFIG.ENDPOINT_OUR + "/api/search/" + recom_str;
    console.log("search.js", "_goRecommended", URL);
    
    axios
      .get(URL)
      .then(res => {
        if (res.data.success == "success") {
          if (res.data.searchresult.length == 0) {
            this.show_toast("There is nothing the result.");
            return;
          }

          Actions.SearchResult({ params: { obj: res.data.searchresult } });
        } else {
          this.show_toast("Network Error");
        }
      })
      .catch(error => {
        console.log(error);
        this.show_toast("Network Error");
      });
  }

  goSubmit = () => {
    Keyboard.dismiss();
    if (this.state.search_str == "") {
      this.show_toast("please enter the word to search");
      return;
    }

    const URL = CONFIG.ENDPOINT_OUR + "/api/search/" + this.state.search_str;
    console.log("search.js", "goSubmit", URL);
    
    axios
      .get(URL)
      .then(res => {
        if (res.data.success == "success") {
          if (res.data.searchresult.length == 0) {
            this.show_toast("There is nothing the result.");
            return;
          }

          Actions.SearchResult({ params: { obj: res.data.searchresult } });
        } else {
          this.show_toast("Network Error");
        }
      })
      .catch(error => {
        console.log(error);
        this.show_toast("Network Error");
      });
  }

  _onPressBackIcon = () => {
    Actions.pop();
  }

  render() {
    return (
      <Container style={{ backgroundColor: "#fff" }}>
        <StatusBar
          backgroundColor="#000"
          barStyle="dark-content"
          translucent={false}
        />
        <Header
          style={{
            height: 50,
            backgroundColor: "white",
            borderBottomColor: CONFIG.SECONDARY_COLOR,
            borderBottomWidth: 1
          }}
        >
          <Left>
            <TouchableOpacity onPress={this._onPressBackIcon}>
              <FastImage
                source={require("../../assets/bg_back_arrow.png")}
                style={{ width: 15, height: 12 }}
              />
            </TouchableOpacity>
          </Left>
          <Body>
            <Title
              style={{
                marginLeft: 30,
                color: CONFIG.PRIMARY_COLOR,
                fontSize: 15
              }}
            >
              Search
            </Title>
          </Body>
        </Header>
        <Content>
          <Card>
            <View style={{ flexDirection: "row", flex: 1, paddingTop: 10 }}>
              <View
                style={{
                  flex: 0.8,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 2,
                  position: "relative"
                }}
              >
                <TextInput
                  style={styles.search_txt}
                  onChangeText={text => {
                    this.setState({ search_str: text });
                  }}
                />
                <FastImage
                  source={require("../../assets/bg_search1.png")}
                  style={{
                    width: 15,
                    height: 18,
                    position: "absolute",
                    top: 12,
                    left: 10
                  }}
                />
              </View>
              <View
                style={{
                  flex: 0.2,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={this.goSubmit}
                  style={{
                    backgroundColor: CONFIG.PRIMARY_COLOR,
                    paddingHorizontal: 7,
                    paddingVertical: 3,
                    borderRadius: 3
                  }}
                >
                  <Text style={{ color: "white", fontSize: 13 }}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ marginTop: 30, flex: 1, paddingHorizontal: 15 }}>
              <View>
                <Text
                  style={{ color: CONFIG.COLOR_BUTTON_TITLE, fontSize: 13 }}
                >
                  Recommend
                </Text>
              </View>
              <View
                style={{
                  marginTop: 10,
                  flexDirection: "row",
                  marginBottom: 20
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={this._goRecommended.bind(this, "apple")}
                  style={{
                    paddingHorizontal: 15,
                    paddingVertical: 3,
                    borderRadius: 4,
                    backgroundColor: "#EEE",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text style={{ color: CONFIG.Forth_COLOR, fontSize: 13 }}>
                    Apple
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={this._goRecommended.bind(this, "huawei")}
                  style={{
                    marginLeft: 10,
                    paddingHorizontal: 15,
                    paddingVertical: 3,
                    borderRadius: 4,
                    backgroundColor: "#EEE",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text style={{ color: CONFIG.Forth_COLOR, fontSize: 13 }}>
                    Huawei
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        </Content>
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

  search_txt: {
    fontSize: 15,
    width: "99%",
    height: 40,
    backgroundColor: "#e8e9e9",
    opacity: 0.6,
    borderRadius: 5,
    borderWidth: 0,
    paddingTop: 10,
    paddingTop: 10,
    paddingLeft: 30,
    paddingRight: 15,
    alignItems: "center",
    justifyContent: "center",
    color: "#000"
  }
});

function mapStateToProps(state, props) {
  return {
    upcoming: state.rootReducer.upcoming
  };
}

export default connect(
  mapStateToProps,
  null
)(Search);
