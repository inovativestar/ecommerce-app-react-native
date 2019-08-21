import React, { PureComponent } from "react";
import {
  View,
  StatusBar,
  ScrollView,
  Platform,
  TouchableOpacity,
  Dimensions,
  ListView,
  StyleSheet,
  RefreshControl,
  TextInput,
  ToastAndroid,
  Alert
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
import Modal from "react-native-modal";
import RNProgressHud from "react-native-progress-display";
import { onLoadingAction, onGetUserData } from "../../redux/actions/action";
import CardProduct from "../elements/CardProduct";
import FastImage from 'react-native-fast-image';

/*
const backIco = require("../../assets/bg_back_arrow.png");
const errorIco = require("../../assets/ic_error_24dp5.png");
const tickt_one = require("../../assets/ic_pay_ticket_first.png");
const tickt_second = require("../../assets/ic_pay_ticket_second.png");
const tickt_third = require("../../assets/ic_pay_ticket_third.png");
const tickt_forth = require("../../assets/ic_pay_ticket_fourth.png");
const coin_icon = require("../../assets/bg_coin_backage.png");
*/
//const btn_icon = require("../../assets/bg_yellow_btn_default.png");

var windowSize = Dimensions.get("window");

class Upcoming extends PureComponent {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      // styles
      ticket1: styles.ticks_sel,
      ticket2: styles.ticks,
      ticket3: styles.ticks,
      ticket4: styles.ticks,
      ticket_txt1: styles.ticks_txt_sel,
      ticket_txt2: styles.ticks_txt,
      ticket_txt3: styles.ticks_txt,
      ticket_txt4: styles.ticks_txt,

      verify_code: "",
      isRefreshing: true,
      dataSource: ds.cloneWithRows(this.props.upcoming),
      isVisible_modal_buy: false,
      buy_product: "",
      price: 1,
      tickets: 1
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
    const URL = CONFIG.ENDPOINT_OUR + "/api/upcoming";
    console.log("upcoming.js", "componentWillMount", URL);

    if (this.props.user != null) {
        this.props.onGetUserData(
            this.props.user.mobile_number,
            this.props.user.api_token
         );
    }
    
    axios
      .get(URL)
      .then(res => {
        if (res.data.success == "success") {
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(res.data.upcoming),
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

  buyNowProduct = (obj) => {
    if (this.props.user == null) {
          Actions.Login();
          return;
        }

    //this.setState({ isVisible_modal_buy: true, buy_product: obj });
    //this.setState({ price: 1 * obj.yunjiage, tickets: 1 });

    this.setState({
      isVisible_modal_buy: true,
      buy_product: obj,
      price: 1 * obj.yunjiage, tickets: 1,
      ticket1: styles.ticks_sel,
      ticket2: styles.ticks,
      ticket3: styles.ticks,
      ticket4: styles.ticks,
      ticket_txt1: styles.ticks_txt_sel,
      ticket_txt2: styles.ticks_txt,
      ticket_txt3: styles.ticks_txt,
      ticket_txt4: styles.ticks_txt
    });
  }

  onChangeTicket = (tid) => {
    if (tid == 1) {
      this.setState({
        ticket1: styles.ticks_sel,
        ticket2: styles.ticks,
        ticket3: styles.ticks,
        ticket4: styles.ticks,
        ticket_txt1: styles.ticks_txt_sel,
        ticket_txt2: styles.ticks_txt,
        ticket_txt3: styles.ticks_txt,
        ticket_txt4: styles.ticks_txt
      });

      this.setState({ price: 1 * this.state.buy_product.yunjiage, tickets: 1 });
    } else if (tid == 2) {
      this.setState({
        ticket1: styles.ticks,
        ticket2: styles.ticks_sel,
        ticket3: styles.ticks,
        ticket4: styles.ticks,
        ticket_txt1: styles.ticks_txt,
        ticket_txt2: styles.ticks_txt_sel,
        ticket_txt3: styles.ticks_txt,
        ticket_txt4: styles.ticks_txt
      });
      if (5 > this.state.buy_product.shenyurenshu) {
        this.setState({
          price:
            parseInt(this.state.buy_product.shenyurenshu) *
            this.state.buy_product.yunjiage,
          tickets: this.state.buy_product.shenyurenshu
        });
        return;
      }
      this.setState({ price: 5 * this.state.buy_product.yunjiage, tickets: 5 });
    } else if (tid == 3) {
      this.setState({
        ticket1: styles.ticks,
        ticket2: styles.ticks,
        ticket3: styles.ticks_sel,
        ticket4: styles.ticks,
        ticket_txt1: styles.ticks_txt,
        ticket_txt2: styles.ticks_txt,
        ticket_txt3: styles.ticks_txt_sel,
        ticket_txt4: styles.ticks_txt
      });
      if (10 > this.state.buy_product.shenyurenshu) {
        this.setState({
          price:
            parseInt(this.state.buy_product.shenyurenshu) *
            this.state.buy_product.yunjiage,
          tickets: this.state.buy_product.shenyurenshu
        });
        return;
      }
      this.setState({
        price: 10 * this.state.buy_product.yunjiage,
        tickets: 10
      });
    } else if (tid == 4) {
      this.setState({
        ticket1: styles.ticks,
        ticket2: styles.ticks,
        ticket3: styles.ticks,
        ticket4: styles.ticks_sel,
        ticket_txt1: styles.ticks_txt,
        ticket_txt2: styles.ticks_txt,
        ticket_txt3: styles.ticks_txt,
        ticket_txt4: styles.ticks_txt_sel
      });
      if (50 > this.state.buy_product.shenyurenshu) {
        this.setState({
          price:
            parseInt(this.state.buy_product.shenyurenshu) *
            this.state.buy_product.yunjiage,
          tickets: this.state.buy_product.shenyurenshu
        });
        return;
      }
      this.setState({
        price: 50 * this.state.buy_product.yunjiage,
        tickets: 50
      });
    }
  }

  handleInputChange = (text) => {
    this.setState({
      ticket1: styles.ticks,
      ticket2: styles.ticks,
      ticket3: styles.ticks,
      ticket4: styles.ticks,
      ticket_txt1: styles.ticks_txt,
      ticket_txt2: styles.ticks_txt,
      ticket_txt3: styles.ticks_txt,
      ticket_txt4: styles.ticks_txt
    });

    if (/^\d+$/.test(text)) {
      if (text == 0 || text == "") {
        this.setState({
          tickets: 1,
          price: 1 * this.state.buy_product.yunjiage
        });
      } else {
        if (parseInt(text) > this.state.buy_product.shenyurenshu) {
          this.setState({
            tickets: parseInt(this.state.buy_product.shenyurenshu),
            price:
              parseInt(this.state.buy_product.shenyurenshu) *
              this.state.buy_product.yunjiage
          });
          return;
        }
        this.setState({
          price: parseInt(text) * this.state.buy_product.yunjiage,
          tickets: text
        });
      }
    }
  }

  onSub = () => {
    if (this.state.tickets != 1)
      this.setState({
        tickets: parseInt(this.state.tickets) - 1,
        price: parseInt(this.state.price) - 1 * this.state.buy_product.yunjiage
      });
  }

  onAdd = () => {
    if (
      parseInt(this.state.tickets) + 1 >
      this.state.buy_product.shenyurenshu
    ) {
      this.setState({
        tickets: parseInt(this.state.buy_product.shenyurenshu),
        price:
          parseInt(this.state.buy_product.shenyurenshu) *
          this.state.buy_product.yunjiage
      });
      return;
    }
    this.setState({
      tickets: parseInt(this.state.tickets) + 1,
      price: parseInt(this.state.price) + 1 * this.state.buy_product.yunjiage
    });
  }

  _goPaySubmit = () => {
    RNProgressHud.showWithStatus("Processing ...");
    var that = this;
    var API_URL = CONFIG.ENDPOINT_OUR + "/api/pay";
    console.log("upcoming.js", "_goPaySubmit", API_URL);
    
    fetch(API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.user.api_token
      },
      body: JSON.stringify({
        uid: this.props.user.id,
        pid: this.state.buy_product.id,
        amount: this.state.tickets,
        type: "cloud"
      })
    })
    .then(response => response.json())
    .then(res => {
        RNProgressHud.dismiss();
        if (res.success == "success") {
          this.props.onLoadingAction();
          this.setState({
            isVisible_modal_buy: !this.state.isVisible_modal_buy
          });
          Actions.PaySuccess({
            params: { uid: this.props.user.id, pid: this.state.buy_product.id }
          });
          /*
          this.props.onGetUserData(
            this.props.user.mobile_number,
            this.props.user.api_token
          ); */
        } else {
          var msg = res.msg;
          if (res.message == "Unauthenticated.") {
            var msg = "Your session was expired, please again login.";
          }
          if (Platform.OS === "ios") {
            Alert.alert("Message", msg, {
              cancelable: true
            });
          } else {
            ToastAndroid.show("Message : " + msg, ToastAndroid.LONG);
          }
          this.setState({
            isVisible_modal_buy: !this.state.isVisible_modal_buy
          });
        }
    })
    .catch(error => {
        RNProgressHud.dismiss();
        this.show_toast("Network error.");
        console.error(error);
    });
  }

  _onPressBackIcon = () => {
    Actions.pop();
  }

  _onBackButtonPress = () => {
    this.setState({ isVisible_modal_buy: !this.state.isVisible_modal_buy });
  }

  _onBackdropPress = () => {
    this.setState({ isVisible_modal_buy: !this.state.isVisible_modal_buy });
  }

  _onPressCancel = () => {
    this.setState({ isVisible_modal_buy: !this.state.isVisible_modal_buy });
  }

  render() {
    return (
      <Container style={{ backgroundColor: "#ddd" }}>
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
              UPCOMING
            </Title>
          </Body>
        </Header>

        <View style={{ flex: 1 }}>
          <Modal
            style={{ justifyContent: "flex-end", margin: 0 }}
            onBackButtonPress={this._onBackButtonPress}
            isVisible={this.state.isVisible_modal_buy}
            onBackdropPress={this._onBackdropPress}            
          >
            <View
              style={[
                styles.modalContent,
                { height: windowSize.height / 2 + 50 }
              ]}
            >
              <View style={styles.buyModal_header}>
                <View style={{ paddingLeft: 10, paddingVertical: 5 }}>
                  <FastImage
                    source={{
                      uri: `${CONFIG.ENDPOINT_OUR}${
                        this.state.buy_product.thumb
                      }`
                    }}
                    style={{ width: 50, height: 50 }}
                  />
                </View>
                <View
                  style={{
                    width: windowSize.width - 80,
                    alignContent: "center",
                    paddingLeft: 15
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 15,
                      color: "#000",
                      lineHeight: 20,
                      paddingTop: 10
                    }}
                  >
                    {this.state.buy_product.title}
                  </Text>
                  <Text
                    style={{
                      color: CONFIG.SECONDARY_COLOR,
                      fontSize: 13,
                      lineHeight: 20,
                      paddingBottom: 10
                    }}
                  >
                    Remaining:{" "}
                    <Text style={{ color: CONFIG.Percent_bar, fontSize: 12 }}>
                      {this.state.buy_product.shenyurenshu}
                    </Text>{" "}
                    tickets{" "}
                  </Text>
                </View>
              </View>

              <View style={{ padding: 20 }}>
                <View
                  style={{
                    flexDirection: "row",
                    height: 70,
                    alignalignItemsContent: "center",
                    justifyContent: "center",
                    paddingHorizontal: 10
                  }}
                >
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      paddingHorizontal: 15,
                      flexDirection: "column"
                    }}
                    onPress={this.onChangeTicket.bind(this, 1)}
                  >
                    <View style={this.state.ticket1}>
                      <FastImage
                        source={require("../../assets/ic_pay_ticket_first.png")}
                        style={{ width: 60, height: 60 }}
                      />
                    </View>
                    <Text style={this.state.ticket_txt1}>1 Ticket</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      paddingHorizontal: 15,
                      flexDirection: "column"
                    }}
                    onPress={this.onChangeTicket.bind(this, 2)}
                  >
                    <View style={this.state.ticket2}>
                      <FastImage
                        source={require("../../assets/ic_pay_ticket_second.png")}
                        style={{ width: 60, height: 60 }}
                      />
                    </View>
                    <Text style={this.state.ticket_txt2}>5 Tickets</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      paddingHorizontal: 15,
                      flexDirection: "column"
                    }}
                    onPress={this.onChangeTicket.bind(this, 3)}
                  >
                    <View style={this.state.ticket3}>
                      <FastImage
                        source={require("../../assets/ic_pay_ticket_third.png")}
                        style={{ width: 60, height: 60 }}
                      />
                    </View>
                    <Text style={this.state.ticket_txt3}>10 Tickets</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      paddingHorizontal: 15,
                      flexDirection: "column"
                    }}
                    onPress={this.onChangeTicket.bind(this, 4)}
                  >
                    <View style={this.state.ticket4}>
                      <FastImage
                        source={require("../../assets/ic_pay_ticket_fourth.png")}
                        style={{ width: 60, height: 60 }}
                      />
                    </View>
                    <Text style={this.state.ticket_txt4}>50 Tickets</Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    marginTop: 25
                  }}
                >
                  <TouchableOpacity
                    onPress={this.onSub}
                    style={{
                      width: 35,
                      height: 35,
                      borderTopLeftRadius: 4,
                      borderBottomLeftRadius: 4,
                      backgroundColor: "#3fbbdc",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Text
                      style={{ color: "#FFF", fontSize: 25, fontWeight: "300" }}
                    >
                      -
                    </Text>
                  </TouchableOpacity>
                  <TextInput
                    onChangeText={this.handleInputChange}
                    value={this.state.tickets.toString()}
                    style={{
                      height: 35,
                      width: 80,
                      fontSize: 20,
                      padding: 5,
                      borderColor: "#3fbbdc",
                      borderWidth: 1,
                      color: "#000",
                      textAlign: "center",
                      justifyContent: "center"
                    }}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    onPress={this.onAdd}
                    style={{
                      borderTopRightRadius: 4,
                      borderBottomRightRadius: 4,
                      width: 35,
                      height: 35,
                      backgroundColor: "#3fbbdc",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Text
                      style={{ color: "#FFF", fontSize: 25, fontWeight: "300" }}
                    >
                      +
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10
                  }}
                >
                  <Text style={{ color: CONFIG.SECONDARY_COLOR, fontSize: 13 }}>
                    Buy tickets to win this prize
                  </Text>
                </View>

                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    position: "relative",
                    marginTop: 30
                  }}
                >
                  <Text
                    style={{
                      position: "absolute",
                      left: 50,
                      color: "#000",
                      fontSize: 14
                    }}
                  >
                    Total :
                  </Text>
                  <View
                    style={{
                      position: "absolute",
                      right: 50,
                      flexDirection: "row"
                    }}
                  >
                    <FastImage
                      source={require("../../assets/bg_coin_backage.png")}
                      style={{
                        width: 32,
                        height: 25,
                        right: 5
                      }}
                    />
                    <Text style={{ fontSize: 17, color: CONFIG.Percent_bar }}>
                      {this.state.price}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  flexDirection: "row"
                }}
              >
                <TouchableOpacity
                  style={{
                    height: 40,
                    width: 150,
                    backgroundColor: "#FFF",
                    borderColor: CONFIG.SECONDARY_COLOR,
                    borderTopWidth: 1,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  onPress={this._onPressCancel}
                >
                  <Text style={{ color: CONFIG.SECONDARY_COLOR, fontSize: 13 }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative"
                  }}
                  onPress={this._goPaySubmit}
                >
                  <View style = {styles.payBtnBack} > 
                  </View>
                  <Text style={styles.payBtnTxt}>Pay</Text>
                  {/*
                  <FastImage
                    source={btn_icon}
                    style={{ height: 40, width: windowSize.width - 150 }}
                  />
                  <Text
                    style={{
                      color: "#FFF",
                      fontSize: 16,
                      position: "absolute",
                      top: 10
                    }}
                  >
                    Pay
                  </Text>
                  */}
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

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
                <CardProduct
                  key={rowData.id}
                  buyNow={this.buyNowProduct}
                  showDetail={this.showDetail}
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
  },

  modalContent: {
    backgroundColor: "white",
    alignItems: "center"
  },
  buyModal_header: {
    height: 63,
    width: windowSize.width,
    flexDirection: "row",
    borderBottomColor: CONFIG.SECONDARY_COLOR,
    borderBottomWidth: 1
  },
  ticks_sel: {
    borderWidth: 1,
    backgroundColor: "#c1f1fd",
    borderColor: CONFIG.Percent_bar,
    marginBottom: 5
  },
  ticks: {
    marginBottom: 5
  },
  ticks_txt_sel: {
    color: CONFIG.Percent_bar,
    fontSize: 13
  },
  ticks_txt: {
    color: "#000",
    fontSize: 13
  },
  payBtnBack: {
    height:40,
    width:windowSize.width - 150,
    backgroundColor: CONFIG.BUTTON_COLOR
  },
  payBtnTxt: {
    color: "#FFF",
    fontSize: 16,
    position: "absolute",
    top: 10
  },
});

function mapStateToProps(state, props) {
  return {
    upcoming: state.rootReducer.upcoming,
    user: state.rootReducer.user
  };
}

export default connect(
  mapStateToProps,
  { onLoadingAction, onGetUserData }
)(Upcoming);
