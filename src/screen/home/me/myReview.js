import React, { PureComponent } from "react";
import {
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ListView,
  StyleSheet,
  RefreshControl
} from "react-native";

import {
  Container,
  Header,
  Body,
  Left,
  Tabs,
  Tab,
  Title,
  Button,
  Text
} from "native-base";

import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import CONFIG from "../../../configs";
import axios from "axios";
import Toast from "../../elements/Toast/lib/Toast";
import CardUnshare from "./CardUnshare";
import CardUserReview from "../../elements/CardUserReview";
import FastImage from 'react-native-fast-image';

const backIco = require("../../../assets/bg_back_arrow.png");
const errorIco = require("../../../assets/ic_error_24dp5.png");
//const btn_icon = require("../../../assets/bg_yellow_btn_default.png");
const nothing_icon = require("../../../assets/bg_moment_empty.png");

var windowSize = Dimensions.get("window");

class MyReview extends PureComponent {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      verify_code: "",
      isRefreshing: true,
      dataSource: ds.cloneWithRows([]),
      allreviews: ["0"],
      userId: 0,
      page: 0,
      reviews: [],
      dataSource_1: ds.cloneWithRows([]),
      unshare: []
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
          source={errorIco}
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

  componentWillMount() {
    if (this.props.user.id == null || this.props.user.id == "") {
      var userid = 0;
    } else {
      var userid = this.props.user.id;
    }

    const URL = CONFIG.ENDPOINT_OUR + "/api/getmyreview/" + userid;
    console.log("myReview.js", "componentWillMount", URL);
    
    axios
      .get(URL)
      .then(res => {
        if (res.data.success == "success") {
          this.setState({
            isRefreshing: false,
            dataSource: this.state.dataSource.cloneWithRows(
              res.data.reviewlist
            ),
            allreviews: res.data.reviewlist,
            dataSource_1: this.state.dataSource_1.cloneWithRows(
              res.data.unshare
            ),
            unshare: res.data.unshare
          });
        } else {
          this.setState({
            isRefreshing: false
          });
          this.show_toast("Network Error");
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({
          isRefreshing: false
        });
        this.show_toast("Network Error");
      });
  }

  detailReview = (info) => {
    Actions.ReviewDetail({ params: { obj: info } });
  }

  _onPressShareNow = () => {
    this.setState({ page: 1 });
  }

  _onPressBuyNow = () => {
    Actions.pop();
  }

  _onPressBackIcon = () => {
    Actions.pop();
  }

  _renderReviewObj = () => {
    if (this.state.allreviews.length > 0) {
      return (
        <ListView
          enableEmptySections
          style={{ flex: 1, paddingTop: 3, backgroundColor: "#EEE" }}
          contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}
          dataSource={this.state.dataSource}
          renderRow={rowData => {
            return (
              <CardUserReview
                key={rowData.id}
                userId={this.props.user.id}
                detailReview={this.detailReview}
                info={rowData}
              />
            );
          }}
        />
      );
    } else {
      return (
        <View
          style={{
            height: windowSize.height - 190,
            justifyContent: "center",
            backgroundColor: "#EEE",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <FastImage
            source={nothing_icon}
            style={{ width: 120, height: 110 }}
          />

          <Text style={{ color: CONFIG.SECONDARY_COLOR, marginTop: 20 }}>
            You haven't shared before.
          </Text>

          <TouchableOpacity
            style={{ position: "relative", marginTop: 20 }}
            onPress={this._onPressShareNow}
          >
            <View style={styles.shareBtnBack} >
                <Text style={styles.shareBtnTXT}>SHARE NOW</Text>
            </View>
          {/*
            <FastImage
              source={btn_icon}
              style={{
                width: 110,
                height: 30,
                borderRadius: 5
              }}
            />
            <Text
              style={{
                position: "absolute",
                bottom: 6,
                fontSize: 13,
                color: "white",
                left: 16
              }}
            >
              SHARE NOW
            </Text>
            */}
          </TouchableOpacity>
        </View>
      );
    }
  }

  _renderUnsharedObj = () => {
    if (this.state.unshare.length > 0) {
      return (
        <ListView
          enableEmptySections
          style={{ flex: 1, paddingTop: 3, backgroundColor: "#EEE" }}
          contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}
          dataSource={this.state.dataSource_1}
          renderRow={rowData => {
            return (
              <CardUnshare
                key={rowData.id}
                userId={this.props.user.id}
                detailReview={this.detailReview}
                info={rowData}
              />
            );
          }}
        />
      );
    } else {
      return (
        <View
          style={{
            height: windowSize.height - 190,
            justifyContent: "center",
            backgroundColor: "#EEE",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <FastImage
            source={nothing_icon}
            style={{ width: 120, height: 110 }}
          />

          <Text style={{ color: CONFIG.SECONDARY_COLOR, marginTop: 20 }}>
            Nothing to share
          </Text>

          <TouchableOpacity
            style={{ position: "relative", marginTop: 20 }}
            onPress={this._onPressBuyNow}
          >
            <View style={styles.buyBtnBack}>
              <Text style={styles.buyBtnTXT}>BUY NOW</Text>
            </View>
          {/*
            <FastImage
              source={btn_icon}
              style={{
                width: 110,
                height: 30,
                borderRadius: 5
              }}
            />
            <Text
              style={{
                position: "absolute",
                bottom: 6,
                fontSize: 13,
                color: "white",
                left: 25
              }}
            >
              BUY NOW
            </Text>
            */}

          </TouchableOpacity>
        </View>
      );
    }
  }

  render() {
    return (
      <Container style={{ backgroundColor: "#EEE" }}>
        <StatusBar
          backgroundColor="#000"
          barStyle="dark-content"
          translucent={false}
        />
        <Header
          hasTabs
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
                source={backIco}
                style={{ width: 15, height: 12 }}
              />
            </Button>
          </Left>
          <Body>
            <Title
              style={{
                marginLeft: 30,
                color: CONFIG.PRIMARY_COLOR,
                fontSize: 15
              }}
            >
              Reviews
            </Title>
          </Body>
        </Header>

        <Tabs
          tabBarUnderlineStyle={{ backgroundColor: "#FB8C00", height: 2 }}
          page={this.state.page}
        >
          <Tab
            heading="Share"
            activeTextStyle={styles.actTXT}
            textStyle={styles.tabTxt}
            activeTabStyle={styles.actTab}
            tabStyle={styles.tabStyle}
          >
            <ScrollView
              style={styles.container}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isRefreshing}
                  onRefresh={this._onRefresh}
                  colors={["#EA0000"]}
                  tintColor="white"
                  title="loading..."
                  titleColor="white"
                  progressBackgroundColor="white"
                />
              }
            >
              {this._renderReviewObj()}
            </ScrollView>
          </Tab>
          <Tab
            heading="Unshared"
            activeTextStyle={styles.actTXT}
            textStyle={styles.tabTxt}
            activeTabStyle={styles.actTab}
            tabStyle={styles.tabStyle}
          >
            <ScrollView
              style={styles.container}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isRefreshing}
                  onRefresh={this._onRefresh}
                  colors={["#EA0000"]}
                  tintColor="white"
                  title="loading..."
                  titleColor="white"
                  progressBackgroundColor="white"
                />
              }
            >
              {this._renderUnsharedObj()}
            </ScrollView>
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EEE"
  },

  tabStyle: {
    backgroundColor: "white",

    borderBottomColor: "white"
  },
  actTab: {
    backgroundColor: "white",
    color: "#f28c00"
  },
  tabTxt: {
    fontSize: 13,
    color: CONFIG.SECONDARY_COLOR,
    fontWeight: "normal"
  },
  actTXT: {
    fontSize: 12,
    color: "#333",
    fontWeight: "normal"
  },
  shareBtnBack: {
    width: 110,
    height: 30,
    borderRadius: 5,
    backgroundColor: CONFIG.BUTTON_COLOR,
  },
  shareBtnTXT: {
    position: "absolute",
    bottom: 6,
    fontSize: 13,
    color: "white",
    left: 16
  },
  buyBtnBack: {
    width: 110,
    height: 30,
    borderRadius: 5,
    backgroundColor: CONFIG.BUTTON_COLOR,
  },
  buyBtnTXT: {
    position: "absolute",
    bottom: 6,
    fontSize: 13,
    color: "white",
    left: 25
  },
});

function mapStateToProps(state, props) {
  return {
    user: state.rootReducer.user
  };
}

export default connect(
  mapStateToProps,
  null
)(MyReview);
