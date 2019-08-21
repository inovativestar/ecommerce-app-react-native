import React, { PureComponent } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  RefreshControl,
  Animated
} from "react-native";

import { Thumbnail, Text } from "native-base";
import { connect } from "react-redux";
import axios from "axios";
import { Actions } from "react-native-router-flux";
import CONFIG from "../../configs";
import Toast from "../elements/Toast/lib/Toast";
import Modal from "react-native-modal";
import ImageSlider from "../elements/ImageSlider";
import FastImage from 'react-native-fast-image';

/*
const backIco = require("../../assets/bg_back_arrow.png");
const sharingIco = require("../../assets/bg_detail_share.png");
const errorIco = require("../../assets/ic_error_24dp5.png");
const shippingIco = require("../../assets/bg_shipping1.png");
const detailIcon = require("../../assets/bg_personal_center_arrow1.png");
const ticketIcon = require("../../assets/ic_self_ticket.png");
const detailviewIcon = require("../../assets/bg_draw_detail_icon.png");
const closeIcon = require("../../assets/ic_svg_close3.png");
const winnerBackground = require("../../assets/bg_other_winner.png");
const coinIcon = require("../../assets/bg_coin_backage.png");
const bubble_ico = require("../../assets/ic_bubble_spent1.png");
const winner_ico = require("../../assets/ic_bubble_winner.png");
*/
var windowSize = Dimensions.get("window");
var _interval = 0;
var colors = ["#fe7f19", "#3499de", "#80c269"];

class WonProduct extends PureComponent {
  constructor(props) {
    super(props);

    var winTicket = 0;
    this.props.params.obj.record.map((info, index) => {
      if (info.uid == this.props.params.obj.q_user.id) {
        winTicket = winTicket + parseInt(info.gonumber);
      }
    });

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

      isRefreshing: false,
      product_obj: this.props.params.obj,
      record_obj: new Array(),
      h_opacity: 0,
      isVisible_modal: false,
      tickets: "",
      winTicket: winTicket,
      winner_txt: "Wow ! 0123***7894 recharged 5 tickets",
      isVisible_modal_buy: false,
      price: 1,
      imageObj: imageObj
    };

    this.springValue = new Animated.Value(0.3);
    this.opacityValue = new Animated.Value(0.1);
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
    console.log("wonproduct.js", "componentDidMount", URL);
    
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
            record_obj: response.data.record
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
          logo_ico: require("../../assets/ic_bubble_winner.png"),
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
          logo_ico: require("../../assets/ic_bubble_spent1.png"),
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
    this.setState({ isVisible_modal: !this.state.isVisible_modal })
  }

  renderModalContent = () => {
    var ticket_temp = this.state.tickets.split(",");
      var ticket_str = (
        <View
            style={{ width: windowSize.width - 70 , marginTop: 15, flexDirection: "row", flexWrap: 'wrap' }}
            lineHeight={10}
        >
            {ticket_temp.map((val, index) => {
                return (
                    <View key={['b', index].join()} style={{ flexDirection: "row" }}>
                    <Thumbnail
                        square
                        source={require("../../assets/ic_self_ticket.png")}
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
            source={require("../../assets/ic_svg_close3.png")}
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

  onGoNextPeriod = (obj) => {
    const URL = CONFIG.ENDPOINT_OUR + "/api/getnewperiod/" + obj.sid;
    console.log("wonproduct.js", "onGoNextPeriod", URL);
    
    axios
      .get(URL)
      .then(res => {
        if (res.data.success == "success") {
          Actions.Productdetail({ params: { obj: res.data.nextperiod } });
        } else if (res.data.success == "failed") {
          this.show_toast("Please Re-click the play button...");
        } else {
          this.show_toast("Network Error");
        }
      })
      .catch(error => {
        console.log(error);
        this.show_toast("Network Error");
      });
  }

  _onPressLogin = () => {
    Actions.Login();
  }

  _onBackButtonPress = () => {
    this.setState({ isVisible_modal: !this.state.isVisible_modal });
  }

  _onBackdropPress = () => {
    this.setState({ isVisible_modal: !this.state.isVisible_modal });
  }

  _onPressWinnerProfile = () => {
    Actions.UserParticipation({
      params: { user: this.props.params.obj.q_user }
    });
  }

  _onPressReview = () => {
    Actions.Review({ params: { obj: this.state.product_obj } });
  }

  _onPressPreviousWinner = () => {
    Actions.PreviousWinner({
      params: { obj: this.state.product_obj }
    });
  }

  _onPressDetail = () => {
    Actions.Description({
      params: { pid: this.state.product_obj.id }
    });
  }

  _onPressBackIcon = () => {
    Actions.pop();
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
              ticket in this product .
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
                    <View key={['e', index].join()}>
                      <Thumbnail
                        key={['f', info.id].join()}
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
                      key={['i', info.id].join()}
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

  render() {
    return (
      <View style={styles.container}>
        <Modal
          isVisible={this.state.isVisible_modal}
          onBackButtonPress={this._onBackButtonPress}
          onBackdropPress={this._onBackdropPress}
        >
          {this.renderModalContent()}
        </Modal>
        <ScrollView
          style={styles.container}
          onScroll={this._onScroll.bind(this)}
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
          <ImageSlider
            loop={true}
            height={windowSize.height / 2 + 80}
            style={{ height: windowSize.height / 2 + 80 }}
            images={this.state.imageObj}
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

            <FastImage
              source={require("../../assets/bg_other_winner.png")}
              style={{
                width: windowSize.width - 20,
                height: 140,
                borderRadius: 5,
                marginTop: 7
              }}
            />
            <View
              style={{
                position: "absolute",
                width: windowSize.width - 20,
                height: 140,
                bottom: 20,
                left: 10
              }}
            >
              <View
                style={{
                  width: windowSize.width - 20,
                  height: 140,
                  flexDirection: "row"
                }}
              >
                <View
                  style={{
                    flex: 0.35,
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 15
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 14, lineHeight: 25 }}
                  >
                    WINNER
                  </Text>
                  <TouchableOpacity
                    onPress={this._onPressWinnerProfile}
                  >
                    <FastImage
                      source={{
                        uri: `${CONFIG.ENDPOINT_OUR}${
                          this.props.params.obj.q_user.avatar
                        }`
                      }}
                      style={{
                        width: 45,
                        height: 45,
                        borderRadius: 45
                      }}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{ color: "white", fontSize: 14, lineHeight: 25 }}
                  >
                    {this.props.params.obj.q_user.mobile_number}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 0.65,
                    justifyContent: "flex-end",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 15
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 14, lineHeight: 25 }}
                  >
                    WINNER NUMBER
                  </Text>
                  <Text
                    style={{ color: "white", fontSize: 25, fontWeight: "bold" }}
                  >
                    {this.props.params.obj.q_user_code}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center"
                    }}
                  >
                    <Text
                      style={{ color: "white", fontSize: 14, lineHeight: 25 }}
                    >
                      SPENT:{" "}
                    </Text>
                    <FastImage
                      source={require("../../assets/bg_coin_backage.png")}
                      style={{ width: 25, height: 20 }}
                    />

                    <Text
                      style={{ color: "white", fontSize: 12, lineHeight: 25 }}
                    >
                      {" "}
                      {this.state.winTicket} Ticket{" "}
                    </Text>
                  </View>
                </View>
              </View>
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
              source={require("../../assets/bg_shipping1.png")}
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
                source={require("../../assets/bg_personal_center_arrow1.png")}
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
            onPress={this._onPressPreviousWinner}
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
                source={require("../../assets/bg_personal_center_arrow1.png")}
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
              key={['d', info.id].join()}
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

                <Thumbnail square source={require("../../assets/ic_self_ticket.png")} style={styles.ticket} />
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
          <View style={{ width: windowSize.width, marginTop: 45 }} />

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
              source={require("../../assets/bg_draw_detail_icon.png")}
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
            source={require("../../assets/bg_back_arrow.png")}
            style={{ width: 17, height: 15, resizeMode: "stretch" }}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sharing_btn}>
          <Thumbnail
            square
            source={require("../../assets/bg_detail_share.png")}
            style={{ width: 15, height: 15, resizeMode: "stretch" }}
          />
        </TouchableOpacity>

        <View style={styles.buynowCotainer}>
          <TouchableOpacity
            style={{
              backgroundColor: CONFIG.PRIMARY_COLOR,
              borderRadius: 20,
              width: windowSize.width - 10,
              alignItems: "center",
              height: 35,
              justifyContent: "center"
            }}
            onPress={this.onGoNextPeriod.bind(this, this.props.params.obj)}
          >
            <Text style={{ fontSize: 13, color: "#FFF", padding: 5 }}>
              PLAY IN NEW PERIOD
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
            {
                opacity: this.opacityValue.interpolate({
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
    paddingBottom: 20,
    position: "relative"
  },
  progressTitle: {
    fontSize: 12,
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
  }
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
  null
)(WonProduct);
