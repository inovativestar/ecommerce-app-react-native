import React, { PureComponent } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ListView,
  StyleSheet,
  RefreshControl
} from "react-native";

import {
  Container,
  Tabs,
  Tab,
  Text
} from "native-base";

import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import CONFIG from "../../configs";
import Toast from "../elements/Toast/lib/Toast";
import CardRecordAll from "./CardRecordAll";
import CardUserWon from "./CardUserWon";
import CardUserReview from "../elements/CardUserReview";
import axios from "axios";
import { onMoveTab } from "../../redux/actions/action";
import FastImage from 'react-native-fast-image';

/*
const backIco = require("../../assets/ic_arrow_back_24dp5.png");
const errorIco = require("../../assets/ic_error_24dp5.png");

const nothing_icon = require("../../assets/bg_reward_empty.png");
const top_bg = require("../../assets/user_top.png");
*/
//const btn_icon = require("../../assets/bg_yellow_btn_default.png");
var windowSize = Dimensions.get("window");

class UserParticipation extends PureComponent {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      verify_code: "",
      isRefreshing: true,
      dataSource: ds.cloneWithRows([]),
      allrecord: ["0"],
      userId: 0,
      won_num: 0,
      reviews: [],
      dataSource_1: ds.cloneWithRows([])
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

  componentWillMount() {
    if (this.props.params.user.id == null || this.props.params.user.id == "") {
      var userid = 0;
    } else {
      var userid = this.props.params.user.id;
    }

    const URL = CONFIG.ENDPOINT_OUR + "/api/getmyparticipation/" + userid;
    console.log("userparticipation.js", "componentWillMount", URL);
    
    axios
      .get(URL)
      .then(res => {
        if (res.data.success == "success") {
          var won_num = 0;
          res.data.recordlist.map((info, index) => {
            if (info.pitem.q_end_time != null) {
              won_num++;
            }
          });

          this.setState({
            isRefreshing: false,
            dataSource: this.state.dataSource.cloneWithRows(
              res.data.recordlist
            ),
            allrecord: res.data.recordlist,
            won_num: won_num,
            reviews: res.data.reviewlist,
            dataSource_1: this.state.dataSource_1.cloneWithRows(
              res.data.reviewlist
            )
          });
        } else {
          this.show_toast("Network Error");
        }
      })
      .catch(error => {
        console.log(error);
        this.show_toast("Network Error");
      });
  }

  detailReview = (info) => {
    Actions.ReviewDetail({ params: { obj: info } });
  }

  _onPressTryNow = () => {
    Actions.Main();
  }

  _onPressBackIcon = () => {
    Actions.pop();
  }

  _renderAllList = () => {
    if (this.state.allrecord.length > 0) {
      return (
        <ListView
          enableEmptySections
          style={{ flex: 1, paddingTop: 3, backgroundColor: "#ddd" }}
          contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}
          dataSource={this.state.dataSource}
          renderRow={rowData => {
            return (
              <CardRecordAll
                key={rowData.id}
                userId={this.props.params.user.id}
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
            source={require("../../assets/bg_reward_empty.png")}
            style={{ width: 120, height: 110 }}
          />
          <Text
            style={{
              color: CONFIG.SECONDARY_COLOR,
              marginTop: 15,
              fontSize: 15,
              fontWeight: "900"
            }}
          >
            WHOPS
          </Text>
          <Text style={{ color: CONFIG.SECONDARY_COLOR }}>
            You haven't participated yet.
          </Text>

          <TouchableOpacity
            style={{ position: "relative", marginTop: 20 }}
            onPress={this._onPressTryNow}
          >
            <View style={styles.tryBtnBack} >
                <Text style={styles.tryBtnTxt}>TRY NOW</Text>
            </View>
            {/*
            <FastImage
              source={btn_icon}
              style={{
                width: 100,
                height: 30,
                borderRadius: 5
              }}
            />
            <Text
              style={{
                position: "absolute",
                bottom: 5,
                fontSize: 15,
                color: "white",
                left: 17
              }}
            >
              TRY NOW
            </Text> */}
          </TouchableOpacity>
        </View>
      );
    }
  }

  _renderWinList = () => {
    if (this.state.won_num > 0) {
      return (
        <ListView
          enableEmptySections
          style={{ flex: 1, paddingTop: 3, backgroundColor: "#ddd" }}
          contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}
          dataSource={this.state.dataSource}
          renderRow={rowData => {
            return (
              <CardUserWon
                key={rowData.id}
                userId={this.props.params.user.id}
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
            source={require("../../assets/bg_reward_empty.png")}
            style={{ width: 120, height: 110 }}
          />
          <Text
            style={{
              color: CONFIG.SECONDARY_COLOR,
              marginTop: 15,
              fontSize: 15,
              fontWeight: "900"
            }}
          >
            WHOPS
          </Text>
          <Text style={{ color: CONFIG.SECONDARY_COLOR }}>
            You haven't participated yet.
          </Text>

          <TouchableOpacity
            style={{ position: "relative", marginTop: 20 }}
            onPress={this._onPressTryNow}
          >
            <FastImage
              source={btn_icon}
              style={{
                width: 100,
                height: 30,
                borderRadius: 5
              }}
            />
            <Text
              style={{
                position: "absolute",
                bottom: 5,
                fontSize: 15,
                color: "white",
                left: 17
              }}
            >
              TRY NOW
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  _renderReviewList = () => {
    if (this.state.reviews.length > 0) {
      return (
        <ListView
          enableEmptySections
          style={{ flex: 1, paddingTop: 3, backgroundColor: "#ddd" }}
          contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}
          dataSource={this.state.dataSource_1}
          renderRow={rowData => {
            return (
              <CardUserReview
                key={rowData.id}
                userId={this.props.params.user.id}
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
            source={require("../../assets/bg_reward_empty.png")}
            style={{ width: 120, height: 110 }}
          />
          <Text
            style={{
              color: CONFIG.SECONDARY_COLOR,
              marginTop: 15,
              fontSize: 15,
              fontWeight: "900"
            }}
          >
            WHOPS
          </Text>
          <Text style={{ color: CONFIG.SECONDARY_COLOR }}>
            You haven't participated yet.
          </Text>

          <TouchableOpacity
            style={{ position: "relative", marginTop: 20 }}
            onPress={this._onPressTryNow}
          >
            <View style={styles.tryBtnBack} >
                <Text style={styles.tryBtnTxt}>TRY NOW</Text>
            </View>

          {/*
            <FastImage
              source={btn_icon}
              style={{
                width: 100,
                height: 30,
                borderRadius: 5
              }}
            />
            <Text
              style={{
                position: "absolute",
                bottom: 5,
                fontSize: 15,
                color: "white",
                left: 17
              }}
            >
              TRY NOW
            </Text>
            */}
          </TouchableOpacity>
        </View>
      );
    }
  }

  render() {
    return (
      <Container style={{ backgroundColor: "#EFEFEF" }}>
        <View hasTabs style={{ justifyContent: "center" }}>
          <FastImage
            source={require("../../assets/user_top.png")}
            style={{
              top: 0,
              left: 0,
              width: windowSize.width,
              height: 120
            }}
          />
          <View
            style={{
              width: windowSize.width,
              height: 120,
              flexDirection: "column",
              alignItems: "center",
              paddingHorizontal: 10,
              justifyContent: "center",
              position: "relative"
            }}
          >
            <View style={{ alignItems: "center" }}>
              <FastImage
                source={{
                  uri: `${CONFIG.ENDPOINT_OUR}${this.props.params.user.avatar}`
                }}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 70,
                  borderColor: "white",
                  borderWidth: 1,
                  borderRadius: 70
                }}
              />
            </View>
            <TouchableOpacity style={{ marginTop: 5 }}>
              <Text style={{ color: "white", fontWeight: "600" }}>
                {this.props.params.user.mobile_number}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{ position: "absolute", top: 10, left: 15, zIndex: 50 }}
            onPress={this._onPressBackIcon}
          >
            <FastImage
              source={require("../../assets/ic_arrow_back_24dp5.png")}
              style={{ width: 25, height: 25 }}
            />
          </TouchableOpacity>
        </View>

        <Tabs tabBarUnderlineStyle={{ backgroundColor: "#999", height: 2 }}>
          <Tab
            heading="All"
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
              {this._renderAllList()}
            </ScrollView>
          </Tab>
          <Tab
            heading="Winning Record"
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
              {this._renderWinList()}
            </ScrollView>
          </Tab>
          <Tab
            heading="Reviews"
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
              {this._renderReviewList()}
            </ScrollView>
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#dddddd"
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
  tryBtnBack: {
    width: 100,
    height: 30,
    borderRadius: 5,
    backgroundColor: CONFIG.BUTTON_COLOR,
  },
  tryBtnTxt: {
    position: "absolute",
    bottom: 5,
    fontSize: 15,
    color: "white",
    left: 17
  },
});

function mapStateToProps(state, props) {
  return {
    user: state.rootReducer.user
  };
}

export default connect(
  mapStateToProps,
  { onMoveTab }
)(UserParticipation);
