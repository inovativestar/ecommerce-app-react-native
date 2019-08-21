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
  Title,
  Button,
  Text
} from "native-base";

import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import CONFIG from "../../../configs";
import Toast from "../../elements/Toast/lib/Toast";
import CardMyWon from "./CardMyWon";
import axios from "axios";
import { onMoveTab } from "../../../redux/actions/action";
import FastImage from 'react-native-fast-image';

//const backIco = require("../../../assets/bg_back_arrow.png");
//const errorIco = require("../../../assets/ic_error_24dp5.png");
//const btn_icon = require("../../../assets/bg_yellow_btn_default.png");
//const nothing_icon = require("../../../assets/bg_reward_empty.png");

var windowSize = Dimensions.get("window");

class winningRecord extends PureComponent {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      verify_code: "",
      isRefreshing: true,
      dataSource: ds.cloneWithRows([]),
      reviews: ["0"],
      userId: this.props.user == null ? 0 : this.props.user.id
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
          source={require("../../../assets/ic_error_24dp5.png")}
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

  componentWillReceiveProps(nextProps) {
    if (this.state.userId != 0 && nextProps.user == null) {
      this.setState({ userId: nextProps.user == null ? 0 : nextProps.user.id });
    }
  }

  componentWillMount() {
    if (this.props.user == null || this.props.user == "") {
      var userid = 0;
    } else {
      var userid = this.props.user.id;
    }

    const URL = CONFIG.ENDPOINT_OUR + "/api/getmywinningrecord/" + this.state.userId;
    console.log("winningRecord.js", "componentWillMount", URL);
    
    axios
      .get(URL)
      .then(res => {
        if (res.data.success == "success") {
          this.setState({
            isRefreshing: false,
            dataSource: this.state.dataSource.cloneWithRows(
              res.data.winningrecord
            ),
            reviews: res.data.winningrecord
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

  _renderWinningObj = () => {
    if (this.state.reviews.length > 0) {
      return (
        <ListView
          enableEmptySections
          style={{ flex: 1, paddingTop: 3, backgroundColor: "#ddd" }}
          contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}
          dataSource={this.state.dataSource}
          renderRow={rowData => {
            return (
              <CardMyWon
                key={rowData.id}
                userId={this.state.userId}
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
            height: windowSize.height - 70,
            justifyContent: "center",
            backgroundColor: "#EEE",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <FastImage
            source={require("../../../assets/bg_reward_empty.png")}
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
                <Text style={styles.tryBtnTXT}>TRY NOW</Text>
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
      <Container style={{ backgroundColor: "#EEE" }}>
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
            <Button transparent onPress={this._onPressBackIcon}>
              <FastImage
                source={require("../../../assets/bg_back_arrow.png")}
                style={{ width: 15, height: 12 }}
              />
            </Button>
          </Left>
          <Body>
            <Title
              style={{
                marginLeft: 26,
                color: CONFIG.PRIMARY_COLOR,
                fontSize: 15
              }}
            >
              Winning Record
            </Title>
          </Body>
        </Header>

        <View style={{ flex: 1 }}>
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
            {this._renderWinningObj()}
          </ScrollView>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#Efefef"
  },
  tryBtnBack: {
    width: 100,
    height: 30,
    borderRadius: 5,
    backgroundColor: CONFIG.BUTTON_COLOR,
  },
  tryBtnTXT:{
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
)(winningRecord);
