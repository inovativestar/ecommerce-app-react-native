import React, { PureComponent } from "react";
import {
  View,
  StatusBar,
  ScrollView,
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
import CardExpense from "../../elements/CardExpense";
import { onMoveTab } from "../../../redux/actions/action";
import FastImage from 'react-native-fast-image';

//const backIco = require("../../../assets/bg_back_arrow.png");
//const errorIco = require("../../../assets/ic_error_24dp5.png");
//const nothing_icon = require("../../../assets/bg_transaction_empty.png");

var windowSize = Dimensions.get("window");

class RechargeRecord extends PureComponent {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      verify_code: "",
      isRefreshing: true,
      dataSource: ds.cloneWithRows([]),
      record: ["0"]
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

    var API_URL = CONFIG.ENDPOINT_OUR + "/api/rechargerecord";
    console.log("rechargerecord.js", "componentWillMount", API_URL);
    
    fetch(API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.user.api_token
      },
      body: JSON.stringify({
        uid: this.props.user.id
      })
    })
    .then(response => response.json())
    .then(res => {
        if (res.success == "success") {
          this.setState({
            isRefreshing: false,
            dataSource: this.state.dataSource.cloneWithRows(res.rechargelist),
            record: res.rechargelist
          });
        } else {
          this.show_toast("Data loading error.");
        }
    })
    .catch(error => {
        this.show_toast("Network error.");
        console.error(error);
    });
  }

  detailReview = (info) => {
    Actions.ReviewDetail({ params: { obj: info } });
  }

  _onPressBackIcon = () => {
    Actions.pop();
  }

  _renderRechargeObj = () => {
    if (this.state.record.length > 0) {
      return (
        <ListView
          enableEmptySections
          style={{ flex: 1, paddingTop: 3, backgroundColor: "#ddd" }}
          contentContainerStyle={{ flexDirection: "column", flexWrap: "wrap" }}
          dataSource={this.state.dataSource}
          renderRow={rowData => {
            return <CardExpense key={rowData.id} info={rowData} />;
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
            source={require("../../../assets/bg_transaction_empty.png")}
            style={{ width: 120, height: 110 }}
          />

          <Text style={{ color: CONFIG.SECONDARY_COLOR, marginTop: 20 }}>
            No Recharge Record
          </Text>
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
              Recharge History
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
            {this._renderRechargeObj()}
          </ScrollView>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#Efefef"
  }
});

function mapStateToProps(state, props) {
  return {
    user: state.rootReducer.user
  };
}

export default connect(
  mapStateToProps,
  { onMoveTab }
)(RechargeRecord);
