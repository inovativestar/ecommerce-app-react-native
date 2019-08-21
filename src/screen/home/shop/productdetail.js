import React, { PureComponent } from "react";
import {
  View,
  ScrollView,
  Platform,
  TouchableOpacity,
  Dimensions,
  ListView,
  StyleSheet,
  RefreshControl,
  Animated,
  TextInput,
  ToastAndroid,
  Alert
} from "react-native";

import { Thumbnail, Text } from "native-base";
import CountDown from 'react-native-countdown-component';
import { connect } from "react-redux";
import axios from "axios";
import * as Progress from "react-native-progress";
import { Actions } from "react-native-router-flux";
import CONFIG from "../../../configs";
import Toast from "../../elements/Toast/lib/Toast";
import Modal from "react-native-modal";
import ImageSlider from "../../elements/ImageSlider";
import RNProgressHud from "react-native-progress-display";
import { onLoadingAction, onGetUserData } from "../../../redux/actions/action";
import FastImage from 'react-native-fast-image';

//const backIco = require("../../../assets/bg_back_arrow.png");
/*
const sharingIco = require("../../../assets/bg_detail_share.png");
const errorIco = require("../../../assets/ic_error_24dp5.png");
const shippingIco = require("../../../assets/bg_shipping1.png");
const detailIcon = require("../../../assets/bg_personal_center_arrow1.png");
const ticketIcon = require("../../../assets/ic_self_ticket.png");
const detailviewIcon = require("../../../assets/bg_draw_detail_icon.png");
const closeIcon = require("../../../assets/ic_svg_close3.png");

const bubble_ico = require("../../../assets/ic_bubble_spent1.png");
const winner_ico = require("../../../assets/ic_bubble_winner.png");

const tickt_one = require("../../../assets/ic_pay_ticket_first.png");
const tickt_second = require("../../../assets/ic_pay_ticket_second.png");
const tickt_third = require("../../../assets/ic_pay_ticket_third.png");
const tickt_forth = require("../../../assets/ic_pay_ticket_fourth.png");
const coin_icon = require("../../../assets/bg_coin_backage.png");
*/
//const btn_icon = require("../../../assets/bg_yellow_btn_default.png");

var windowSize = Dimensions.get("window");
var _interval = 0;
var colors = ["#fe7f19", "#3499de", "#80c269"];

class Productdetail extends PureComponent {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      //styles
      ticket1: styles.ticks_sel,
      ticket2: styles.ticks,
      ticket3: styles.ticks,
      ticket4: styles.ticks,
      ticket_txt1: styles.ticks_txt_sel,
      ticket_txt2: styles.ticks_txt,
      ticket_txt3: styles.ticks_txt,
      ticket_txt4: styles.ticks_txt,

      isRefreshing: false,
      dataSource: ds.cloneWithRows(this.props.upcoming),
      product_obj: this.props.params.obj,
      left: this.props.params.obj.shenyurenshu,
      record_obj: new Array(),
      h_opacity: 0,
      isVisible_modal: false,
      tickets: "",
      winner_txt: "Wow ! 0123***7894 recharged 5 tickets",
      isVisible_modal_buy: false,
      price: 1 * this.props.params.obj.yunjiage,
      tickets_num: 1,
      buy_product: this.props.params.obj,
      timer : null,
      uniqueValue: 1,
      disabled: false,
    };

    this.springValue = new Animated.Value(0.3);
    this.opacityValue = new Animated.Value(0.1);
  }

  _countDownEnd = () => {
    Alert.alert("Message","Product Ended");
    this.setState({ disabled:true });
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

  _onScroll = (event) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y.toFixed();

    if (contentOffsetY > 130) {
      this.setState({ h_opacity: 1 });
    } else {
      this.setState({ h_opacity: 0 });
    }
  }

  componentWillMount() {
    _interval = 0;
    const URL = CONFIG.ENDPOINT_OUR + "/api/productdetail";
    console.log("productdetail.js", "componentWillMount", URL);
    
    var that = this;
    axios
      .post(URL, {
        product_id: this.props.params.obj.id,
        qishu: this.props.params.obj.qishu
      })
      .then(function(response) {
        if (response.data.success == "success") {
          that.setState({
            product_obj: response.data.product,
            record_obj: response.data.record,
            timer:response.data.timeleft
          });
        }
        that.setState({ isRefreshing: false });
      })
      .catch(function(error) {
        console.log(error);
        that.setState({ isRefreshing: false });
      });

    this.getRandomInt();
  }

  getRandomInt = () => {
    var record_index = Math.floor(
      Math.random() * Math.floor(this.props.record.length)
    );

    if (this.props.record.length != 0) {
      if (this.props.record[record_index].huode != 0) {
        this.setState({
          winner_txt:
            "Congrats! " +
            this.props.record[record_index].username +
            "  won on " +
            this.props.record[record_index].shopname,
          logo_ico: require("../../../assets/ic_bubble_winner.png"),
          color: "#f90338"
        });
      } else {
        var ticket_txt =
          this.props.record[record_index].gonumber == 1
            ? " ticket on "
            : " tickets on ";
        var color_index = Math.floor(Math.random() * Math.floor(colors.length));
        this.setState({
          winner_txt:
            "Wow! " +
            this.props.record[record_index].username +
            " spent " +
            this.props.record[record_index].gonumber +
            ticket_txt +
            this.props.record[record_index].shopname,
          logo_ico: require("../../../assets/ic_bubble_spent1.png"),
          color: colors[color_index]
        });
      }
    }
  }

  componentDidMount() {
    this.first_spin();
  }

  spin = () => {
    if (_interval != 1) {
      this._interval = setInterval(() => {
        this.getRandomInt();
        this.springValue.setValue(0);
        this.opacityValue.setValue(0);
        Animated.stagger(1000, [
          Animated.spring(this.springValue, {
            toValue: 1,
            friction: 5
          }),
          Animated.timing(this.opacityValue, {
            toValue: 1,
            duration: 6000
          })
        ]).start();
      }, 8000);
    } else {
      clearInterval(this._interval);
    }
  }

  first_spin = () => {
    this.springValue.setValue(0);
    this.opacityValue.setValue(0);
    Animated.parallel([
      Animated.spring(this.springValue, {
        toValue: 1,
        friction: 5
      }),
      Animated.timing(this.opacityValue, {
        toValue: 1,
        duration: 6000
      })
    ]).start(() => this.spin());
  }

  componentWillUnmount() {
    _interval = 1;
    clearInterval(this._interval);
  }

  _onPressTicketClose = () => {
    this.setState({ isVisible_modal: !this.state.isVisible_modal });
  }

  renderModalContent = () => {
    var ticket_temp = this.state.tickets.split(",");
   var ticket_str = (
    <ScrollView>
           <View
               style={{ width: windowSize.width - 70 , marginTop: 15, flexDirection: "row", flexWrap: 'wrap' }}
               lineHeight={10}
           >
               {ticket_temp.map((val, index) => {
                   return (
                       <View key={['b', index].join()} style={{ flexDirection: "row" }}>
                       <Thumbnail
                           square
                           source={require("../../../assets/ic_self_ticket.png")}
                           style={{ width: 15, height: 15, resizeMode: "stretch" }}
                       />
                           <Text
                               style={{
                               fontSize: 11,
                               color: CONFIG.SECONDARY_COLOR,
                               lineHeight: 20
                               }}
                           >
                               {val}
                           </Text>
                       </View>
                   );
               })}
           </View>
           </ScrollView>
         );

    return (
      <View style={styles.modalContent}>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 13, color: CONFIG.PRIMARY_COLOR }}>
            Ticket Number
          </Text>
        </View>
        <TouchableOpacity
          style={{ position: "absolute", top: 18, right: 15 }}
          onPress={this._onPressTicketClose}
          onPressOut={() => {this._onPressTicketClose}}
        >
          <Thumbnail
            square
            source={require("../../../assets/ic_svg_close3.png")}
            style={{ width: 15, height: 15, resizeMode: "stretch" }}
          />
        </TouchableOpacity>

        {ticket_str}
      </View>
    );
  }

  showModal = (val) => {
    this.setState({ isVisible_modal: true, tickets: val });
  }

  _toggleModal = () => {
    this.setState({ isVisible_modal: !this.state.isVisible_modal });
  }

  onPay = () => {
  if (this.props.user == null) {
        Actions.Login();
        return;
      }
    this.setState({ isVisible_modal_buy: true });
  }

  onChangeTicket = (tid) => {
    var tickets_num;

    this.setState({
        ticket1: styles.ticks,
        ticket2: styles.ticks,
        ticket3: styles.ticks,
        ticket4: styles.ticks,
        ticket_txt1: styles.ticks_txt,
        ticket_txt2: styles.ticks_txt,
        ticket_txt3: styles.ticks_txt,
        ticket_txt4: styles.ticks_txt,
    });

    if (tid == 1) {
      this.setState({
        ticket1: styles.ticks_sel,
        ticket_txt1: styles.ticks_txt_sel
      });
      tickets_num = 1;

    } else if (tid == 2) {
      this.setState({
        ticket2: styles.ticks_sel,
        ticket_txt2: styles.ticks_txt_sel
      });
      tickets_num = 5;

    } else if (tid == 3) {
      this.setState({
        ticket3: styles.ticks_sel,
        ticket_txt3: styles.ticks_txt_sel
      });
      tickets_num = 10;

    } else if (tid == 4) {
      this.setState({
        ticket4: styles.ticks_sel,
        ticket_txt4: styles.ticks_txt_sel
      });
      tickets_num = 50;
    }

    if (tickets_num > this.state.buy_product.shenyurenshu) {
        tickets_num = parseInt(this.state.buy_product.shenyurenshu);
    }
    this.setState({
        tickets_num: tickets_num,
        price: tickets_num * this.state.buy_product.yunjiage
    });
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
        ticket_txt4: styles.ticks_txt,
    });

    if (/^\d+$/.test(text)) {
      if (text == 0 || text == "") {
        this.setState({
          tickets_num: 1,
          price: 1 * this.state.buy_product.yunjiage
        });
      } else {
        if (parseInt(text) > this.state.buy_product.shenyurenshu) {
          this.setState({
            tickets_num: parseInt(this.state.buy_product.shenyurenshu),
            price:
              parseInt(this.state.buy_product.shenyurenshu) *
              this.state.buy_product.yunjiage
          });
          return;
        }
        this.setState({
          price: parseInt(text) * this.state.buy_product.yunjiage,
          tickets_num: text
        });
      }
    }
  }

  onSub = () => {
    if (this.state.tickets_num != 1)
      this.setState({
        tickets_num: parseInt(this.state.tickets_num) - 1,
        price: parseInt(this.state.price) - 1 * this.state.buy_product.yunjiage
      });
  }

  onAdd = () => {
    if (
      parseInt(this.state.tickets_num) + 1 >
      this.state.buy_product.shenyurenshu
    ) {
      this.setState({
        tickets_num: parseInt(this.state.buy_product.shenyurenshu),
        price:
          parseInt(this.state.buy_product.shenyurenshu) *
          this.state.buy_product.yunjiage
      });
      return;
    }
    this.setState({
      tickets_num: parseInt(this.state.tickets_num) + 1,
      price: parseInt(this.state.price) + 1 * this.state.buy_product.yunjiage
    });
  }

  _goPaySubmit = () => {
    RNProgressHud.showWithStatus("Processing ...");
    var that = this;
    var API_URL = CONFIG.ENDPOINT_OUR + "/api/pay";
    console.log("productdetail.js", "_goPaySubmit", API_URL);
    
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
        amount: this.state.tickets_num,
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
          this.props.onGetUserData(
            this.props.user.mobile_number,
            this.props.user.api_token
          );
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

  _onPressLogin = () => {
    Actions.Login();
  }

  _onBackButtonPressModalBuy = () => {
    this.setState({ isVisible_modal_buy: !this.state.isVisible_modal_buy });
  }

  _onBackdropPressModalBuy = () => {
    this.setState({ isVisible_modal_buy: !this.state.isVisible_modal_buy });
  }

  _onBackButtonPressModal = () => {
    this.setState({ isVisible_modal: !this.state.isVisible_modal });
  }

  _onBackdropPressModal = () => {
    this.setState({ isVisible_modal: !this.state.isVisible_modal })
  }

  _onPressCancel = () => {
    this.setState({ isVisible_modal_buy: !this.state.isVisible_modal_buy });
  }

  _onPressPay = () => {
    this._goPaySubmit();
  }

  _onPressReview = () => {
    Actions.Review({
      params: { obj: this.state.product_obj }
    });
  }

  _onPressWinner = () => {
    Actions.PreviousWinner({
        params: { obj:this.state.product_obj }
    })
  }

  _onPressDetail = () => {
    Actions.Description({
      params: { pid: this.state.product_obj.id }
    })
  }

  _onPressBackIcon = () => {
    Actions.pop();
  }

  _getImageObj = () => {
    var imageObj = new Array();
    imageObj = this.props.params.obj.picarr.map(info => ({
      uri: `${this.props.params.obj.cloud_url}${
        this.props.params.obj.upload_path_url
      }${info}`
    }));
    imageObj[imageObj.length] = {
      uri: `${this.props.params.obj.cloud_url}${
        this.props.params.obj.upload_path_url
      }${this.props.params.obj.thumb}`
    };
    return imageObj;
  }

  _renderChekNum = () => {
    if (this.props.user == null)
      return (
        <View
          style={{
            paddingHorizontal: 10,
            flexDirection: "row",
            backgroundColor: "white",
            marginTop: 7,
            paddingVertical: 10
          }}
        >
          <Text
            style={{
              color: CONFIG.COLOR_BUTTON_TITLE,
              fontSize: 12,
              textAlign: "left",
              flex: 0.6
            }}
          >
            Check your number
          </Text>
          <TouchableOpacity
            style={{ flex: 0.4 }}
            onPress={this._onPressLogin}
          >
            <Text style={{ color: "red", fontSize: 12, textAlign: "right" }}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      );
    else {
      var participate_num = 0;
      var ticket_str = "";
      this.state.record_obj.map((info, index) => {
        if (this.props.user.id == info.uid) {
          participate_num += info.gonumber;
          if (index == 0) ticket_str += info.goucode;
          else {
            ticket_str = ticket_str + "," + info.goucode;
          }
        }
      });

      if (participate_num == 0) {
        return (
          <View
            style={{
              paddingHorizontal: 10,
              flexDirection: "row",
              backgroundColor: "white",
              marginTop: 7,
              paddingVertical: 10
            }}
          >
            <Text
              style={{
                color: CONFIG.RED_COLOR,
                fontSize: 12,
                textAlign: "left",
                flex: 0.6
              }}
            >
              You haven't bought this product yet.
            </Text>
          </View>
        );
      } else {
        return (
          <TouchableOpacity
            onPress={this.showModal.bind(this, ticket_str)}
            style={{
              paddingHorizontal: 10,
              flexDirection: "row",
              backgroundColor: "white",
              marginTop: 7,
              paddingVertical: 10,
              flexDirection: "row"
            }}
          >
            <Text
              style={{
                color: CONFIG.COLOR_BUTTON_TITLE,
                fontSize: 12,
                textAlign: "left"
              }}
            >
              You have bought{" "}
              <Text style={{ color: CONFIG.RED_COLOR, fontSize: 12 }}>
                {participate_num}
              </Text>{" "}
              ticket in this product.{" "}
            </Text>
            <Text style={{ color: "blue", fontSize: 11 }}> View My Ticket</Text>
          </TouchableOpacity>
        );
      }
    }
  }

  _renderRecordList = () => {
    if (this.state.record_obj != 0) {
      return (
        <View
          style={{
            paddingRight: 20,
            flexDirection: "row",
            paddingLeft: 10,
            backgroundColor: "white",
            marginTop: 1,
            paddingVertical: 10,
            height: 50
          }}
        >
          <View style={{ flexDirection: "row", position: "relative" }}>
            {this.state.record_obj.map((info, index) => {
              if (index < 7) {
                if (index == 6) {
                  return (
                    <View key={['c', index].join()}>
                      <Text
                        style={{
                          fontSize: 10,
                          color: CONFIG.COLOR_BUTTON_TITLE,
                          marginTop: 5,
                          left: index * 20 + 15,
                          position: "absolute"
                        }}
                      >
                        ...
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          color: CONFIG.COLOR_BUTTON_TITLE,
                          marginTop: 8,
                          left: index * 20 + 35,
                          position: "absolute"
                        }}
                      >
                        {this.state.record_obj.length} participants
                      </Text>
                    </View>
                  );
                }
                if (index == this.state.record_obj.length - 1) {
                  return (
                    <View key={['d', index].join()}>
                      <Thumbnail
                        key={info.id}
                        source={{ uri: `${CONFIG.ENDPOINT_OUR}${info.uphoto}` }}
                        style={[
                          styles.playAvatar,
                          { left: index * 20, zIndex: 70 - 10 * index }
                        ]}
                      />
                      <Text
                        style={{
                          fontSize: 10,
                          color: CONFIG.COLOR_BUTTON_TITLE,
                          marginTop: 5,
                          left: index * 20 + 15,
                          position: "absolute"
                        }}
                      >
                        ...
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          color: CONFIG.COLOR_BUTTON_TITLE,
                          marginTop: 8,
                          left: index * 20 + 35,
                          position: "absolute"
                        }}
                      >
                        {this.state.record_obj.length} participants
                      </Text>
                    </View>
                  );
                }
                if (index < this.state.record_obj.length) {
                  return (
                    <Thumbnail
                      key={info.id}
                      source={{ uri: `${CONFIG.ENDPOINT_OUR}${info.uphoto}` }}
                      style={[
                        styles.playAvatar,
                        { left: index * 20, zIndex: 70 - 10 * index }
                      ]}
                    />
                  );
                }
              }
            })}
          </View>
        </View>
      );
    } else {
      return <View />;
    }
  }

  _getPercent = () => {
    let percent_temp = (this.state.product_obj.canyurenshu / this.state.product_obj.zongrenshu) * 10000;
    var percent = parseInt(parseInt(percent_temp) / 100);

    if ((percent_temp != 0) & (percent == 0)) {
      var percent = parseInt(percent_temp) / 100;
    }
    return percent;
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
          style={{ justifyContent: "flex-end", margin: 0 }}
          onBackButtonPress={this._onBackButtonPressModalBuy}
          isVisible={this.state.isVisible_modal_buy}
          onBackdropPress={this._onBackdropPressModalBuy}          
        >
          <View
            style={[
              styles.modalContent_buy,
              { height: windowSize.height / 2 + 50 }
            ]}
          >
            <View style={styles.buyModal_header}>
              <View style={{ paddingLeft: 10, paddingVertical: 5 }}>
                <FastImage
                  source={{
                    uri: `${this.props.params.obj.cloud_url}${
                      this.props.params.obj.upload_path_url
                    }${this.props.params.obj.thumb}`
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
                  {this.props.params.obj.title}
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
                    {this.props.params.obj.shenyurenshu}
                  </Text>{" "}
                  tickets
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
                      source={require("../../../assets/ic_pay_ticket_first.png")}
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
                      source={require("../../../assets/ic_pay_ticket_second.png")}
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
                      source={require("../../../assets/ic_pay_ticket_third.png")}
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
                      source={require("../../../assets/ic_pay_ticket_fourth.png")}
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
                  value={this.state.tickets_num.toString()}
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
                    source={require("../../../assets/bg_coin_backage.png")}
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
              style={{ position: "absolute", bottom: 0, flexDirection: "row" }}
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
                onPress={this._onPressPay}
              >
                <View style={styles.payBtnBack} />                
                <Text style={styles.payBtnTXT}>Pay</Text>
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
                </Text> */}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          isVisible={this.state.isVisible_modal}
          onBackButtonPress={this._onBackButtonPressModal}
          onBackdropPress={this._onBackdropPressModal}
          animationInTiming = {300}
        >
          {this.renderModalContent()}
        </Modal>
        <ScrollView
          style={styles.container}
          onScroll={this._onScroll}
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

        <View style={{paddingHorizontal:20,flexDirection:'row',paddingVertical:12, marginTop:3,backgroundColor:'#fff', alignItems: 'center', justifyContent: 'center',}}>
          <CountDown
            size={30}
            until={this.state.timer}
            onFinish={this._countDownEnd}
            digitTxtStyle={{color: '#F8694A'}}
            digitStyle={{backgroundColor: '#FFF', borderWidth: 2, borderColor: '#F8694A'}}
            timeLabelStyle={{color: '#F8694A', fontWeight: 'bold'}}
            separatorStyle={{color: '#F8694A'}}
            timeToShow={['H', 'M', 'S']}
            timeLabels={{m: null, s: null}}
            showSeparator
            />
        </View>
          <ImageSlider
            loop={true}
            height={windowSize.height / 2 + 80}
            style={{ height: windowSize.height / 2 + 80 }}
            images={this._getImageObj()}
          />

          <View style={styles.title_container}>
            <Text
              style={{
                color: CONFIG.Forth_COLOR,
                fontSize: 11,
                textAlign: "left"
              }}
              numberOfLines={2}
            >
              {this.props.params.obj.title}
            </Text>
            <Text style={styles.progressTitle}>
              Period No: {this.props.params.obj.qishu}
            </Text>
            <Progress.Bar
              progress={this._getPercent() / 100}
              height={3}
              color={CONFIG.Percent_bar}
              borderColor={"white"}
              unfilledColor={"#CCC"}
              width={windowSize.width - 20}
            />
            <View style={{ flexDirection: "row", marginTop: 4 }}>
              <Text
                style={{
                  flex: 0.33,
                  textAlign: "left",
                  fontSize: 10,
                  color: CONFIG.COLOR_BUTTON_TITLE,
                  fontFamily: "Octicons",
                  fontWeight: "100"
                }}
              >
                Tickets: {this.props.params.obj.zongrenshu}
              </Text>
              <Text
                style={{
                  flex: 0.33,
                  textAlign: "center",
                  fontSize: 10,
                  color: CONFIG.Percent_bar
                }}
              >
                {this._getPercent()}%
              </Text>
              <Text
                style={{
                  flex: 0.33,
                  textAlign: "right",
                  fontSize: 10,
                  color: CONFIG.COLOR_BUTTON_TITLE,
                  fontFamily: "Octicons",
                  fontWeight: "100"
                }}
              >
                Left:{this.state.product_obj.shenyurenshu}
              </Text>
            </View>
          </View>
          <View
            style={{
              paddingHorizontal: 20,
              flexDirection: "row",
              paddingVertical: 12,
              marginTop: 3,
              backgroundColor: "#fff",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <FastImage
              source={require("../../../assets/bg_shipping1.png")}
              style={{ width: 25, height: 20 }}
            />
            <Text
              style={{
                fontSize: 12,
                color: CONFIG.Forth_COLOR,
                paddingLeft: 15
              }}
            >
              Shipping Free
            </Text>
          </View>

          {this._renderChekNum()}

          <TouchableOpacity
            style={{
              paddingHorizontal: 10,
              paddingRight: 20,
              flexDirection: "row",
              backgroundColor: "white",
              marginTop: 1,
              paddingVertical: 10
            }}
            onPress={this._onPressReview}
          >
            <Text
              style={{
                color: CONFIG.COLOR_BUTTON_TITLE,
                fontSize: 12,
                textAlign: "left",
                flex: 0.6
              }}
            >
              Reviews
            </Text>
            <View style={{ flex: 0.4, alignItems: "flex-end" }}>
              <Thumbnail
                square
                source={require("../../../assets/bg_personal_center_arrow1.png")}
                style={{
                  width: 7,
                  height: 10,
                  resizeMode: "stretch",
                  marginTop: 6
                }}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              paddingHorizontal: 10,
              paddingRight: 20,
              flexDirection: "row",
              backgroundColor: "white",
              marginTop: 1,
              paddingVertical: 10
            }}
            onPress={this._onPressWinner}
          >
            <Text
              style={{
                color: CONFIG.COLOR_BUTTON_TITLE,
                fontSize: 12,
                textAlign: "left",
                flex: 0.6
              }}
            >
              Previous Winners
            </Text>
            <TouchableOpacity style={{ flex: 0.4, alignItems: "flex-end" }}>
              <Thumbnail
                square
                source={require("../../../assets/bg_personal_center_arrow1.png")}
                style={{
                  width: 7,
                  height: 10,
                  resizeMode: "stretch",
                  marginTop: 6
                }}
              />
            </TouchableOpacity>
          </TouchableOpacity>
          {this._renderRecordList()}

          {this.state.record_obj.map((info, index) => (
            <TouchableOpacity
              activeOpacity={0.8}
              key={info.id}
              onPress={this.showModal.bind(this, info.goucode)}
              style={{
                paddingHorizontal: 10,
                flexDirection: "row",
                backgroundColor: "white",
                marginTop: 0.5,
                paddingVertical: 10,
                paddingBottom: 40
              }}
            >
              <View style={{ position: "relative" }}>
                <Thumbnail
                  source={{ uri: `${CONFIG.ENDPOINT_OUR}${info.uphoto}` }}
                  style={[styles.playAvatar]}
                />
                <Text
                  style={{
                    position: "absolute",
                    left: 40,
                    top: 0,
                    fontSize: 9,
                    color: CONFIG.PRIMARY_COLOR
                  }}
                >
                  {info.username}
                </Text>
                <Text
                  style={{
                    position: "absolute",
                    left: 40,
                    top: 17,
                    fontSize: 9,
                    color: CONFIG.SECONDARY_COLOR
                  }}
                >
                  {info.time}
                </Text>

                <Thumbnail square source={require("../../../assets/ic_self_ticket.png")} style={styles.ticket} />
                <Text
                  style={{
                    position: "absolute",
                    left: windowSize.width - 40,
                    fontSize: 11,
                    color: CONFIG.SECONDARY_COLOR,
                    top: 5
                  }}
                >
                  × {info.gonumber}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          <View style={{ width: windowSize.width, marginTop: 50 }} />

          <TouchableOpacity
            onPress={this._onPressDetail}
            style={{
              position: "absolute",
              left: windowSize.width - 80,
              top: windowSize.height / 2 + 61,
              flexDirection: "row",
              backgroundColor: "#DDD",
              padding: 2,
              zIndex: 900
            }}
          >
            <Thumbnail
              square
              source={require("../../../assets/bg_draw_detail_icon.png")}
              style={{
                width: 15,
                height: 15,
                resizeMode: "stretch",
                marginTop: 2
              }}
            />
            <Text style={{ fontSize: 12, color: CONFIG.SECONDARY_COLOR }}>
              DETAILS
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={[styles.head_fix, { opacity: this.state.h_opacity }]}>
          <Text
            style={{
              color: CONFIG.PRIMARY_COLOR,
              fontSize: 13,
              paddingHorizontal: 25
            }}
            numberOfLines={2}
          >
            {this.props.params.obj.title}
          </Text>
        </View>

        <TouchableOpacity style={styles.back_btn} onPress={this._onPressBackIcon}>
          <Thumbnail
            square
            source={require("../../../assets/bg_back_arrow.png")}
            style={{ width: 17, height: 15, resizeMode: "stretch" }}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sharing_btn}>
          <Thumbnail
            square
            source={require("../../../assets/bg_detail_share.png")}
            style={{ width: 15, height: 15, resizeMode: "stretch" }}
          />
        </TouchableOpacity>

        <View style={styles.buynowCotainer}>
          <TouchableOpacity
            style={{
              backgroundColor: this.state.disabled ? '#D3D3D3':CONFIG.PRIMARY_COLOR,
              borderRadius: 20,
              width: windowSize.width - 10,
              alignItems: "center",
              height: 35,
              justifyContent: "center"
            }}
            disabled={this.state.disabled}
            onPress={this.onPay}
          >
            <Text style={{ fontSize: 13, color: "#FFF", padding: 5 }}>
              Buy Now
            </Text>
          </TouchableOpacity>
        </View>

        <Animated.View
          style={[
            styles.notify_bar_shadow,
            {
              backgroundColor: this.state.color,
              opacity: this.opacityValue.interpolate({
                inputRange: [0, 0.9, 1],
                outputRange: [0.8, 0.8, 0]
              }),
              transform: [{ scale: this.springValue }]
            }
          ]}
        />
        <Animated.View
          style={[
            styles.notify_bar,
            { opacity: this.opacityValue.interpolate({
                inputRange: [0, 0.9, 1],
                outputRange: [1, 1, 0]
              }),
              transform: [{ scale: this.springValue }]
            }
          ]}
        >
          <FastImage
            source={this.state.logo_ico}
            style={{ width: 35, height: 35 }}
          />
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: windowSize.width - 80
            }}
          >
            <Text
              style={[styles.notiTitle]}
              numberOfLines={2}
              ellipsizeMode={"tail"}
            >
              {this.state.winner_txt}
            </Text>
          </View>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  head_fix: {
    position: "absolute",
    height: 45,
    top: 0,
    width: windowSize.width,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25
  },
  head_fix_1: {
    position: "absolute",
    height: 45,
    top: 0,
    width: windowSize.width,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: CONFIG.PRIMARY_COLOR,
    opacity: 1
  },
  back_btn: {
    position: "absolute",
    top: 15,
    left: 20
  },
  sharing_btn: {
    position: "absolute",
    right: 15,
    top: 15
  },
  title_container: {
    marginTop: 3,
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: "#FFF",
    flexDirection: "column",
    paddingBottom: 20
  },
  progressTitle: {
    fontSize: 10,
    color: CONFIG.SECONDARY_COLOR,
    marginTop: 7,
    marginBottom: 7
  },
  progressContainer: {
    marginTop: 10
  },
  buynowCotainer: {
    backgroundColor: "#FFF",
    borderTopColor: CONFIG.Forth_COLOR,
    borderTopWidth: 0.5,
    height: 50,
    flex: 1,
    width: windowSize.width,
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  playAvatar: {
    width: 30,
    height: 30,
    borderRadius: 30,
    position: "absolute"
  },
  ticket: {
    width: 15,
    height: 15,
    position: "absolute",
    left: windowSize.width - 55,
    top: 5,
    resizeMode: "stretch"
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    paddingTop: 15,
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
    height: windowSize.height / 2 - 20,
    position: "relative"
  },
  notiTitle: {
    fontSize: 13,
    color: "white",
    zIndex: 600,
    width: windowSize.width - 100
  },
  notify_bar: {
    position: "absolute",
    width: windowSize.width - 30,
    height: 50,
    flexDirection: "row",
    zIndex: 500,
    left: 15,
    top: 70,
    paddingHorizontal: 10,
    alignItems: "center"
  },
  notify_bar_shadow: {
    position: "absolute",
    width: windowSize.width - 30,
    height: 50,
    flexDirection: "row",
    zIndex: 300,
    left: 15,
    top: 70,
    borderRadius: 5
  },
  modalContent_buy: {
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
  payBtnBack:{ 
    height: 40, 
    width: windowSize.width - 150,
    backgroundColor: CONFIG.BUTTON_COLOR
  },
  payBtnTXT:{
    color: "#FFF",
    fontSize: 16,
    position: "absolute",
    top: 10
  },
});

function mapStateToProps(state, props) {
  return {
    upcoming: state.rootReducer.upcoming,
    user: state.rootReducer.user,
    record: state.rootReducer.record
  };
}

export default connect(
  mapStateToProps,
  { onLoadingAction, onGetUserData }
)(Productdetail);
