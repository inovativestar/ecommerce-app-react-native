import React, { PureComponent } from "react";
import { connect } from "react-redux";
import {
  BackHandler
} from "react-native";
import { Root } from "native-base";

import {
  Router,
  Overlay,
  Modal,
  Stack,
  Scene,
  Actions
} from "react-native-router-flux";

import Boot from "./screen/boot/boot.js";
import { onLoadingAction, onInitialAction } from "./redux/actions/action";

import Home from "./screen/home/home";
import Login from "./screen/auth/login";
import SignUp from "./screen/auth/signup";
import Confirm from "./screen/auth/confirm";
import Terms from "./screen/webview/terms";
import Privecy from "./screen/webview/privecy";
import Help from "./screen/webview/help";

import Description from "./screen/webview/description";

import Upcoming from "./screen/upcoming/upcoming";

import ReviewDetail from "./screen/review/reviewDetail";
import Review from "./screen/review/review";

import Forgotpassword from "./screen/auth/forgotpassword";
import Resetpassword from "./screen/auth/resetpassword";

import Productdetail from "./screen/home/shop/productdetail";
import AllReview from "./screen/review/allreview";
import Latest from "./screen/latest/latest";
import WonProduct from "./screen/latest/wonproduct";

import PreviousWinner from "./screen/previouswinner/previouswinner";
import winningRecord from "./screen/home/me/winningRecord";
import MyReview from "./screen/home/me/myReview";
import MyParticipation from "./screen/home/me/myparticipation";
import FeedbackWrite from "./screen/home/me/feedbackWrite";
import MyProfile from "./screen/home/me/myprofile";
import ExpenseRecord from "./screen/home/me/expenserecord";
import RechargeRecord from "./screen/home/me/rechargerecord";
import Recharge from "./screen/home/me/Recharge";
import NotificationRecord from "./screen/home/me/notificationrecord";
import PaySuccess from "./screen/home/me/paysuccess";

import Search from "./screen/search/search";
import SearchResult from "./screen/search/searchresult";

import UserParticipation from "./screen/users/userparticipation";

export var globalNav = {};
class Route extends PureComponent {
  constructor(props) {
    super(props);
    console.log("Route");
    this.props.onLoadingAction();
  }

  onBackAndroid = () => {
    if (Actions.currentScene === "shop") {
      BackHandler.exitApp();
      this.props.onInitialAction();
    }
  }

  render() {
    if (this.props.loading) {
      return (
        <Root>
          <Boot />
        </Root>
      );
    } else {
      return (
        <Root>
          <Router
            hideNavBar={true}
            backAndroidHandler={this.onBackAndroid}
          >
            <Overlay key="overlay">
              <Modal hideNavBar key="root" panHandlers={null}>
                <Stack hideNavBar key="Main" initial>
                  <Scene
                    key="shop"
                    swipeEnabled={true}
                    animationEnabled={true}
                    hideNavBar
                    component={Home}
                    initial
                  />
                </Stack>

                <Scene hideNavBar key="Login" component={Login} />
                <Scene hideNavBar key="SignUp" component={SignUp} />
                <Scene key="Confirm" component={Confirm} />
                <Scene key="Forgotpassword" component={Forgotpassword} />
                <Scene key="Resetpassword" component={Resetpassword} />

                <Scene key="Terms" component={Terms} />
                <Scene key="Privecy" component={Privecy} />
                <Scene key="Help" component={Help} />

                <Scene key="Upcoming" component={Upcoming} />
                <Scene key="Productdetail" component={Productdetail} />
                <Scene key="Description" component={Description} />

                <Scene key="ReviewDetail" component={ReviewDetail} />
                <Scene key="Review" component={Review} />

                <Scene key="AllReview" component={AllReview} />
                <Scene key="Latest" component={Latest} />
                <Scene key="WonProduct" component={WonProduct} />

                <Scene key="PreviousWinner" component={PreviousWinner} />
                <Scene key="winningRecord" component={winningRecord} />

                <Scene key="MyParticipation" component={MyParticipation} />
                <Scene key="MyReview" component={MyReview} />

                <Scene key="UserParticipation" component={UserParticipation} />

                <Scene key="FeedbackWrite" component={FeedbackWrite} />

                <Scene key="MyProfile" component={MyProfile} />

                <Scene key="ExpenseRecord" component={ExpenseRecord} />
                <Scene key="RechargeRecord" component={RechargeRecord} />

                <Scene key="Recharge" component={Recharge} />

                <Scene key="Search" component={Search} />
                <Scene key="SearchResult" component={SearchResult} />

                <Scene
                  key="NotificationRecord"
                  component={NotificationRecord}
                />

                <Scene key="PaySuccess" component={PaySuccess} />
              </Modal>
            </Overlay>
          </Router>
        </Root>
      );
    }
  }
}

function mapStateToProps(state, props) {
  return {
    loading: state.rootReducer.loading
  };
}

//Connect everything
export default connect(
  mapStateToProps,
  { onLoadingAction, onInitialAction }
)(Route);
