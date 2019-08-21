import React, { PureComponent } from "react";
import {
  View,
  StatusBar,
  ScrollView,
  Platform,
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
import CONFIG from "../../configs";
import Toast from "../elements/Toast/lib/Toast";
import axios from "axios";
import CardWinner from "../elements/CardWinner";
import FastImage from 'react-native-fast-image';

/*
const backIco = require("../../assets/bg_back_arrow.png");
const errorIco = require("../../assets/ic_error_24dp5.png");
*/

var windowSize = Dimensions.get("window");

class Latest extends PureComponent {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      verify_code: "",
      isRefreshing: true,
      dataSource: ds.cloneWithRows([]),
      isVisible_modal_buy: false,
      buy_product: ""
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
    const URL = CONFIG.ENDPOINT_OUR + "/api/getrecentwinners";
    console.log("latest.js", "componentDidMount", URL);
    
    axios
      .get(URL)
      .then(res => {
        if (res.data.success == "success") {
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(res.data.wonlist),
            isRefreshing: false
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

  showWonProduct = (obj) => {
    Actions.WonProduct({ params: { obj: obj } });
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
            <Button transparent onPress={this._onPressBackIcon}>
              <FastImage
                source={require("../../assets/bg_back_arrow.png")}
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
              Recent Winners
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
            <ListView
              enableEmptySections
              style={{ flex: 1, paddingTop: 3, backgroundColor: "#dddddd" }}
              contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}
              dataSource={this.state.dataSource}
              renderRow={rowData => (
                <CardWinner
                  key={rowData.id}
                  showWonProduct={this.showWonProduct}
                  info={rowData}
                />
              )}
            />
          </ScrollView>
        </View>
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
)(Latest);
