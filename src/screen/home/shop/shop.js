import React, { PureComponent } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  RefreshControl,
  Platform,
  TextInput,
  Alert,
  FlatList,
  ToastAndroid
} from "react-native";

import { TabHeading, Tabs, Tab, Thumbnail } from "native-base";
import Toast from "../../elements/Toast/lib/Toast";
import { connect } from "react-redux";
import RNProgressHud from "react-native-progress-display";
import {
  onLoadingAction,
  onLogOutAction,
  onMoveTab,
  onGetUserData
} from "../../../redux/actions/action";

import { Actions } from "react-native-router-flux";
import Modal from "react-native-modal";

import CONFIG from "../../../configs";
import CardTwo from "../../elements/CardTwo";
import CardMoment from "../../elements/CardMoment";
import NotifyBar from "../../elements/NotifyBar";
import CardProduct from "../../elements/CardProduct";
import ImageSlider from "../../elements/ImageSlider";
import FastImage from 'react-native-fast-image';

/*
const default_user = require("../../../assets/ic_tool_bar_avatar2.png");
const search_icon = require("../../../assets/ic_self_pay_search1.png");
const help_icon = require("../../../assets/ic_tool_bar_how_to_work1.png");
const history_icon = require("../../../assets/ic_tool_bar_history1.png");
const how_play_img = require("../../../assets/how_play_help.png");
const sort_icon_asc = require("../../../assets/ic_sort_asc_deselect.png");
const sort_icon_asc_sel = require("../../../assets/ic_sort_asc_select.png");
const sort_icon_desc = require("../../../assets/ic_sort_desc_deselect.png");
const errorIco = require("../../../assets/ic_error_24dp5.png");
const sort_icon_desc_sel = require("../../../assets/ic_sort_desc_select.png");
const tickt_one = require("../../../assets/ic_pay_ticket_first.png");
const tickt_second = require("../../../assets/ic_pay_ticket_second.png");
const tickt_third = require("../../../assets/ic_pay_ticket_third.png");
const tickt_forth = require("../../../assets/ic_pay_ticket_fourth.png");
const coin_icon = require("../../../assets/bg_coin_backage.png");
*/
//const btn_icon = require("../../../assets/bg_yellow_btn_default.png");

var windowSize = Dimensions.get("window");

const ViewTypes = {
  FULL: 0,
  HALF_LEFT: 1,
  HALF_RIGHT: 2
};

class Shop extends React.Component {
  constructor(props) {
    super(props);
 
    this.handleUpComingViewableItemsChanged = this.handleUpComingViewableItemsChanged.bind(this);
    this.handleVerticalViewableItemChanged = this.handleVerticalViewableItemChanged.bind(this);
    
    this.viewabilityConfig = {
      waitForInteraction: true,
      viewAreaCoveragePercentThreshold: 50,

    }

    this.state = {
      //styles
      navST: styles.head_fix,
      ticket1: styles.ticks_sel,
      ticket2: styles.ticks,
      ticket3: styles.ticks,
      ticket4: styles.ticks,
      ticket_txt1: styles.ticks_txt_sel,
      ticket_txt2: styles.ticks_txt,
      ticket_txt3: styles.ticks_txt,
      ticket_txt4: styles.ticks_txt,

      is_login: false,
      isRefreshing: false,
      tabId: 0,
      sort_ico: require("../../../assets/ic_sort_desc_deselect.png"),

      isVisible_modal_buy: false,
      price: 1,
      buy_product: [],
      tickets: 1,
      upcoming_viewable_item_index:1,
      vertical_viewable_item_index:-5,
      enableScrollViewScroll:true,

      
    };
  }


  handleUpComingViewableItemsChanged(info) {
    if (info.viewableItems.length == 0) {
      this.setState({upcoming_viewable_item_index:1});  
    } else {
      this.setState({upcoming_viewable_item_index:info.viewableItems[0].index});
    }
    console.log("upcoming", info, this.state.upcoming_viewable_item_index);    
  }
  handleVerticalViewableItemChanged(info) {
    console.log("new", info);
    
    if (info.viewableItems.length < 1 || info.viewableItems == undefined)
      this.setState({vertical_viewable_item_index: -5});
    else {
      var indexOfElem = parseInt(info.viewableItems.length / 2, 10);
      var index = info.viewableItems[indexOfElem].index;
      this.setState({vertical_viewable_item_index: index});
    }
    console.log(this.state.vertical_viewable_item_index);
  }
  onPressBar = (obj) => {  }

  _onRefresh = () => {
    this.componentWillMount();
    this.setState({ isRefreshing: false });
  }

  componentWillMount() {
    this.props.onLoadingAction();
    if (this.props.user != null) {
      this.props.onGetUserData(
        this.props.user.mobile_number,
        this.props.user.api_token
      );
    }
  }

  show_toast = (str) => {
      var msg = (
        <View style={{ flexDirection: "row" }}>
          <Image
            source={require("../../../assets/ic_error_24dp5.png")}
            style={{ width: 20, height: 18, resizeMode: "stretch" }}
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

  changeTab = (tab) => {
    this.setState({ tabId: tab.i });
    if (tab.i != 1) {
      if (this.state.sort_ico == require("../../../assets/ic_sort_asc_select.png")) {
        // initial
        this.setState({ sort_ico: require("../../../assets/ic_sort_asc_deselect.png") });
      } else if (this.state.sort_ico == require("../../../assets/ic_sort_desc_select.png")) {
        this.setState({ sort_ico: require("../../../assets/ic_sort_desc_deselect.png") });
      }
    } else {
      if (this.state.sort_ico === require("../../../assets/ic_sort_asc_deselect.png")) {
        // initial
        this.setState({ sort_ico: require("../../../assets/ic_sort_asc_select.png") });
      } else if (this.state.sort_ico === require("../../../assets/ic_sort_desc_deselect.png")) {
        this.setState({ sort_ico: require("../../../assets/ic_sort_desc_select.png") });
      }
    }
  }

  goChangeTab = () => {
    this.setState({ tabId: 1 });
    if (
      this.state.sort_ico === require("../../../assets/ic_sort_asc_deselect.png") ||
      this.state.sort_ico === require("../../../assets/ic_sort_desc_select.png")
    ) {
      // initial
      this.setState({ sort_ico: require("../../../assets/ic_sort_asc_select.png") });
    } else if (
      this.state.sort_ico === require("../../../assets/ic_sort_desc_deselect.png") ||
      this.state.sort_ico === require("../../../assets/ic_sort_asc_select.png")
    ) {
      this.setState({ sort_ico: require("../../../assets/ic_sort_desc_select.png") });
    }
  }

  _onScroll = (event) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y.toFixed();

    if (contentOffsetY > 205) {
      this.setState({ navST: styles.head_fix_1 });
    } else {
      this.setState({ navST: styles.head_fix });
    }
  }

  buyNowProduct = (obj) => {
    if (this.props.user == null) {
      Actions.Login();
      return;
    }
    
    this.setState({
        // styles
        ticket1: styles.ticks_sel,
        ticket2: styles.ticks,
        ticket3: styles.ticks,
        ticket4: styles.ticks,
        ticket_txt1: styles.ticks_txt_sel,
        ticket_txt2: styles.ticks_txt,
        ticket_txt3: styles.ticks_txt,
        ticket_txt4: styles.ticks_txt,

        isVisible_modal_buy: true,
        buy_product: obj,
        tickets: 1,
        price: 1 * obj.yunjiage
    });
  }

  onLoginGo = () => {
    Actions.Login();
  }

  onLogout = () => {
    this.props.onLogOutAction();
    Actions.Main();
  }

  componentWillReceiveProps(nextProps) {

  }

  showDetail = (obj) => {
    Actions.Productdetail({ params: { obj: obj } });
  }

  onChangeTicket = (tid) => {
    var tickets;

    this.state.ticket1 = styles.ticks;
    this.state.ticket1 = styles.ticks;
    this.state.ticket2 = styles.ticks;
    this.state.ticket3 = styles.ticks;
    this.state.ticket4 = styles.ticks;
    this.state.ticket_txt1 = styles.ticks_txt;
    this.state.ticket_txt2 = styles.ticks_txt;
    this.state.ticket_txt3 = styles.ticks_txt;
    this.state.ticket_txt4 = styles.ticks_txt;
    

    if (tid == 1) {
      this.state.ticket1 = styles.ticks_sel;
      this.state.ticket_txt1 = styles.ticks_txt_sel;
      /*
      this.setState({
        ticket1: styles.ticks_sel,
        ticket_txt1: styles.ticks_txt_sel
      });
      */
      tickets = 1;

    } else if (tid == 2) {

      this.state.ticket2 = styles.ticks_sel;
      this.state.ticket_txt2 = styles.ticks_txt_sel;
      /*
      this.setState({
        ticket2: styles.ticks_sel,
        ticket_txt2: styles.ticks_txt_sel
      });
      */
      tickets = 5;

    } else if (tid == 3) {

      this.state.ticket3 = styles.ticks_sel;
      this.state.ticket_txt3 = styles.ticks_txt_sel;
      /*
      this.setState({
        ticket3: styles.ticks_sel,
        ticket_txt3: styles.ticks_txt_sel
      });
      */
      tickets = 10;

    } else if (tid == 4) {

      this.state.ticket4 = styles.ticks_sel;
      this.state.ticket_txt4 = styles.ticks_txt_sel;

      /*
      this.setState({
        ticket4: styles.ticks_sel,
        ticket_txt4: styles.ticks_txt_sel
      });
      */
      tickets = 50;
    }

    if (tickets > this.state.buy_product.shenyurenshu) {
        tickets = parseInt(this.state.buy_product.shenyurenshu);
    }
    this.setState({
        tickets: tickets,
        price: tickets * this.state.buy_product.yunjiage
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

  showReview = (info) => {
    Actions.ReviewDetail({ params: { obj: info } });
  }

  _goMe = () => {
    this.props.onMoveTab(3);
    Actions.Main();
  }

  _goPaySubmit = () => {
    
    RNProgressHud.showWithStatus("Processing ...");
    var that = this;
    var API_URL = CONFIG.ENDPOINT_OUR + "/api/pay";
    console.log("shop.js", "_goPaySubmit", API_URL);
    
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
          /*
          Commented for performance tuning
          this.props.onLoadingAction();
          */
          console.log("Pay success");
          this.setState({
            isVisible_modal_buy: false
          });
          Actions.PaySuccess({
            params: { uid: this.props.user.id, pid: this.state.buy_product.id }
          });          
          /*
          Commented for performance tuning
          this.props.onGetUserData(
            this.props.user.mobile_number,
            this.props.user.api_token
          );
          */
        } else {
          console.log("Pay fail", res);
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
            isVisible_modal_buy: false
          });
        }
      })
      .catch(error => {
        RNProgressHud.dismiss();
        this.setState({
          isVisible_modal_buy: false
        });
        this.show_toast("Network error.");
        console.error(error);
      });
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

  _onPressAllUpcoming = () => {
    Actions.Upcoming();
  }

  _onPressAllReview = () => {
    Actions.AllReview();
  }

  _onPressHelp = () => {
    Actions.Help();
  }

  _onPressSearch = () => {
    Actions.Search();
  }

  _onPressRecentWinner = () => {
    Actions.Latest();
  }

  _renderHeadBtn = () => {
    if (this.props.user == null) {
      return (
        <View style={styles.user_login_container}>
          <TouchableOpacity onPress={this.onLoginGo} style={styles.user_avatar}>
            <Thumbnail
              square
              source={require("../../../assets/ic_tool_bar_avatar2.png")}
              style={{ opacity: 0.8, width: 33, height: 33 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onLoginGo} style={styles.login_txt}>
            <Text style={{ color: "white", fontSize: 11 }}>Log in</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.user_login_container}>
          <TouchableOpacity
            onPress={this._goMe}
            style={styles.user_avatar}
          >
            <Thumbnail
              square
              source={{
                uri: `${CONFIG.ENDPOINT_OUR}${this.props.user.avatar}`
              }}
              style={{
                opacity: 1,
                width: 33,
                height: 33,
                resizeMode: "stretch",
                borderRadius: 33
              }}
            />
          </TouchableOpacity>
        </View>
      );
    }
  }

  _renderCreditContainer = () => {
    if (this.props.user == null) {
      return <View />;
    } else {
      return (
        <View
          style={{
            position: "absolute",
            top: 7,
            right: 10,
            width: 110,
            height: 31,
            borderRadius: 31,
            backgroundColor: "#000",
            opacity: 0.2,
            flexDirection: "row",
            alignItems: "center"
          }}
        >
        </View>
      );
    }
  }

  _renderCredit = () => {
    if (this.props.user == null) {
      return <View />;
    } else {
      return (
        <View
          style={{
            position: "absolute",
            top: 7,
            right: 10,
            width: 110,
            height: 31,
            borderRadius: 31,
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <FastImage
            source={require("../../../assets/bg_coin_backage.png")}
            style={{
              width: 32,
              height: 25,
              marginLeft: 5
            }}
          />
          <Text style={{ fontSize: 12, color: "white" }}>
            {this.props.user.money}
          </Text>
        </View>
      );
    }
  }

  _getImageObj = () => {
    var imageObj = new Array();
    imageObj = this.props.slide.map(info => ({
      uri: `${CONFIG.ENDPOINT_OUR}${info.img}`
    }));
    return imageObj;
  }

  renderUpcomingFlatListItem(item, index) {    
    //console.log("items" ,this.state.upcoming_viewable_items);  
    //console.log("item", index);
    
    //if (!(this.state.upcoming_viewable_items.length == 0 && index < 2) && this.state.upcoming_viewable_items.find(element => element.item === item) == undefined) {
    if (-2 < (index - this.state.upcoming_viewable_item_index) && (index - this.state.upcoming_viewable_item_index) < 2) {
      //console.log("CardTwo-enableAnimated", item.title);
      return (
        <CardTwo                  
          key={item.id}
          info={item}
          disableAnimation = {false}
          buyNow={this.buyNowProduct}
          showDetail={this.showDetail}
        />  
      );
    }
    //console.log("CardTwo-disableAnimated", item.title);
     return (
      <CardTwo                  
        key={item.id}
        info={item}
        disableAnimation = {true}
        buyNow={this.buyNowProduct}
        showDetail={this.showDetail}
      />      
     )
  }
  renderVerticalViewableFlatListItem(item, index) {    
    //console.log("items" ,this.state.upcoming_viewable_items);  
    //console.log("item", item);
    
    
    //if (this.state.new_viewable_items.find(element => element.item === item) == undefined) {
    //  console.log("CardProduct-disableAnimated", item.title);
    console.log("CardProduct: viewableIndex", this.state.vertical_viewable_item_index)
    if (-3 < (index - this.state.vertical_viewable_item_index) && (index - this.state.vertical_viewable_item_index) < 3) {
      console.log("CardProduct-enableAnimated", item.title);
      return (
        <CardProduct   
          disableAnimation = {false}                   
          key={item.id}
          info={item}          
          buyNow={this.buyNowProduct}
          showDetail={this.showDetail}
        />     
      );
    } 
    console.log("CardProduct-disableAnimated", item.title);
     return (
      <CardProduct 
        disableAnimation = {true}                   
        key={item.id}
        info={item}
        buyNow={this.buyNowProduct}
        showDetail={this.showDetail}
      />   
     )
  }
  renderFlatListHeader = () => {
    return (
      <View>
        <ImageSlider
          onPress={this.onPressBar}
          loop={true}
          images={this._getImageObj()}
        />
        <View>
          <View
            style={{
              position: "absolute",
              top: 30,
              width: windowSize.width,
              height: 9,
              backgroundColor: "#e9e9ef",
              zIndex: 100
            }}
          />

          <NotifyBar info={this.props.record} />
          <View style={styles.listHeading}>
            <Text style={styles.listHeadingLeft}>UPCOMMING</Text>
            <TouchableOpacity onPress={this._onPressAllUpcoming}>
              <Text style={styles.listHeadingRight}>ALL></Text>
            </TouchableOpacity>
          </View>
          <FlatList
                style={{ height: 202 }}
                horizontal = {true}
                data = {this.props.upcoming}

                //pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged = {this.handleUpComingViewableItemsChanged}
                viewabilityConfig={this.viewabilityConfig}

                renderItem={({item, index}) => this.renderUpcomingFlatListItem(item, index)}                
              />
          <View style={styles.listHeading}>
            <Text style={styles.listHeadingLeft}>REVEIWS</Text>
            <TouchableOpacity onPress={this._onPressAllReview}>
              <Text style={styles.listHeadingRight}>ALL></Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {this.props.reviews.map(info => (
              <CardMoment
                key={info.id}
                info={info}
                showReview={this.showReview}
              />
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.howToContainer}
            onPress={this._onPressHelp}
            activeOpacity={0.8}
          >
            <FastImage style={styles.howToImg} source={require("../../../assets/how_play_help.png")} />
          </TouchableOpacity>
          <Tabs
            onChangeTab={this.changeTab}
            page={this.state.tabId}
            tabBarUnderlineStyle={{ backgroundColor: "#999", height: 2 }}
          >
            <Tab
              heading="NEW"
              activeTextStyle={styles.actTXT}
              textStyle={styles.tabTxt}
              activeTabStyle={styles.actTab}
              tabStyle={styles.tabStyle}
            > 
            
            </Tab>
            <Tab
              activeTextStyle={styles.actTXT}
              textStyle={styles.tabTxt}
              activeTabStyle={styles.actTab}
              tabStyle={styles.tabStyle}
              heading={
                <TabHeading style={styles.actTab}>
                  <TouchableOpacity
                    onPress={this.goChangeTab}
                    style={{ flexDirection: "row" }}
                  >
                    <Text
                      style={
                        this.state.tabId == 1 ? styles.actTXT : styles.tabTxt
                      }
                    >
                      PRICE{" "}
                    </Text>
                    <Thumbnail
                      square
                      source={this.state.sort_ico}
                      style={{ width: 12, height: 12 }}
                    />
                  </TouchableOpacity>
                </TabHeading>
              }
            >
            </Tab>
          </Tabs>
        </View>
      </View>      
      )
  }
  render() {
    console.log("shop.js - rendered");
    return (
      <View style={styles.container}>
        <Modal
          style={{ justifyContent: "flex-end", margin: 0 }}
          onBackButtonPress={this._onBackButtonPress}
          isVisible={this.state.isVisible_modal_buy}
          onBackdropPress={this._onBackdropPress}          
          animationInTiming = {300}
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
                    uri: `${this.state.buy_product.cloud_url}${
                      this.state.buy_product.upload_path_url
                    }${this.state.buy_product.thumb}`
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
                  alignItems: "center",
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
                onPress={this._goPaySubmit}
              >
              
                <View style = {styles.payBtnBack} />                
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
                </Text>*/}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {this.state.tabId == 0 ? console.log("tab-newlist") : ((this.state.sort_ico === require("../../../assets/ic_sort_asc_deselect.png") || this.state.sort_ico === require("../../../assets/ic_sort_asc_select.png")) ? console.log("tab-asc", this.props.itembypriceasc) : console.log("tab-desc"))}
        <FlatList
            style={{ flex: 1, paddingTop: 3, backgroundColor: "#dddddd"}}
            data = {this.state.tabId == 0 ? this.props.newlist : ((this.state.sort_ico === require("../../../assets/ic_sort_asc_deselect.png") || this.state.sort_ico === require("../../../assets/ic_sort_asc_select.png")) ? this.props.itembypriceasc : this.props.itembypricedesc)}
            numColumns={2}
            
            nestedScrollEnabled = {true}

            onViewableItemsChanged = {this.handleVerticalViewableItemChanged}
            viewabilityConfig={this.viewabilityConfig}
            keyExtractor={(item, index) => index.toString()}
          
            renderItem={({item, index}) => this.renderVerticalViewableFlatListItem(item, index)}
            ListHeaderComponent = {this.renderFlatListHeader}
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
        />
        <View style={this.state.navST} />
        {this._renderHeadBtn()}

        <TouchableOpacity
          onPress={this._onPressSearch}
          style={[
            styles.search_bnt,
            { right: this.props.user != null ? 220 : 105 }
          ]}
        >
          <Thumbnail
            square
            source={require("../../../assets/ic_self_pay_search1.png")}
            style={{ width: 18, height: 18 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this._onPressHelp}
          style={[
            styles.help_bnt,
            { right: this.props.user != null ? 180 : 65 }
          ]}
        >
          <Thumbnail
            square
            source={require("../../../assets/ic_tool_bar_how_to_work1.png")}
            style={{ width: 18, height: 18 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this._onPressRecentWinner}
          style={[
            styles.help_bnt,
            { right: this.props.user != null ? 140 : 25 }
          ]}
        >
          <FastImage
            square
            source={require("../../../assets/ic_tool_bar_history1.png")}
            style={{ width: 20, height: 20 }}
          />
        </TouchableOpacity>
        {this._renderCreditContainer()}
        {this._renderCredit()}
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative"
  },
  head_fix: {
    position: "absolute",
    height: 45,
    top: 0,
    width: windowSize.width,
    opacity: 0.15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000"
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
  user_login_container: {
    position: "absolute",
    flexDirection: "row"
  },
  user_avatar: {
    position: "absolute",
    top: 5,
    left: 10,
    borderColor: "white",
    borderRadius: 25,
    borderWidth: 0
  },
  login_txt: {
    position: "absolute",
    top: 13,
    left: 50
  },
  user_avatar_login: {
    borderRadius: 25,
    width: 33,
    height: 33,
    backgroundColor: "#EE5577",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#FFF",
    borderRadius: 33,
    borderWidth: 1
  },
  search_bnt: {
    position: "absolute",
    top: 13
  },
  help_bnt: {
    position: "absolute",
    top: 12
  },
  listHeading: {
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
    marginTop: 8,
    backgroundColor: "white",
    paddingTop: 10,
    paddingBottom: 10,
    zIndex: 100
  },
  listHeadingLeft: {
    color: "#333",
    fontSize: 12,
    fontFamily: "Zocial"
  },
  listHeadingRight: {
    color: "#aaa",
    ...Platform.select({
      ios: {
        fontSize: 11
      },
      android: {
        fontSize: 12
      }
    })
  },
  howToContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 5
  },
  howToImg: {
    width: windowSize.width - 10,
    height: 110,
    borderRadius: 8
  },
  tabStyle: {
    backgroundColor: "white",    
    borderBottomColor: "white"
  },
  actTab: {
    backgroundColor: "white",
    color: "#f28c00",

  },
  tabTxt: {
    fontSize: 11,
    color: CONFIG.SECONDARY_COLOR,
    fontWeight: "normal"
  },
  actTXT: {
    fontSize: 11,
    color: "#333",
    fontWeight: "normal"
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
  payBtnBack:{
    height: 40,
    width: windowSize.width - 150,
    backgroundColor: CONFIG.BUTTON_COLOR,
  },
  payBtnTxt:{
    color: "#FFF",
    fontSize: 16,
    position: "absolute",
    top: 10
  },
});

function mapStateToProps(state, props) {
  return {
    upcoming: state.rootReducer.upcoming,
    newlist: state.rootReducer.newlist,
    itembypricedesc: state.rootReducer.itembypricedesc,
    itembypriceasc: state.rootReducer.itembypriceasc,
    reviews: state.rootReducer.reviews,
    user: state.rootReducer.user,
    record: state.rootReducer.record,
    slide: state.rootReducer.slide
  };
}

export default connect(
  mapStateToProps,
  { onLoadingAction, onLogOutAction, onMoveTab, onGetUserData }
)(Shop);

