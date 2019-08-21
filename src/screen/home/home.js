import React, { PureComponent } from "react";
import { connect } from "react-redux";
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Animated
} from "react-native";

import { Thumbnail } from "native-base";
import { onLoadingAction } from "../../redux/actions/action";
import { TabView, SceneMap } from "react-native-tab-view";
import Shop from "./shop/shop";
import Winner from "./winner/winner";
import Show from "../review/show";
import Me from "./me/me";
/*
const ShopIconSel = require("../../assets/bg_first_page_shadow1.png");
const ShopIcon = require("../../assets/bg_first_page_no_shadow1.png");
const WinerIcon = require("../../assets/ic_win.png");
const WinerIconSel = require("../../assets/ic_win_select.png");
const showIcon = require("../../assets/ic_show1.png");
const showIconSel = require("../../assets/ic_show_select1.png");
const MeIcon = require("../../assets/ic_my.png");
const MeIconSel = require("../../assets/ic_my_select.png");
*/

export var globalNav = {};

const initialLayout = {
  width: Dimensions.get("window").width,
  height: 100
};

class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      index: this.props.tabIndex,
      routes: [
        { key: "first", title: "Shop" },
        { key: "second", title: "Winner" },
        { key: "third", title: "Show" },
        { key: "forth", title: "Me" }
      ]
    };
  }

  _onPressTab = (index) => {
    this.setState({ index });
  }

  __renderTabBar = props => {
    const inputRange = props.navigationState.routes.map((x, i) => i);

    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          var w = 23;
          var h = 23;
          if (i == 1) {
            var ico = this.state.index == 1 ? require("../../assets/ic_win_select.png") : require("../../assets/ic_win.png");
          } else if (i == 2) {
            var ico = this.state.index == 2 ? require("../../assets/ic_show_select1.png") : require("../../assets/ic_show1.png");
          } else if (i == 3) {
            var ico = this.state.index == 3 ? require("../../assets/ic_my_select.png") : require("../../assets/ic_my.png");
          } else {
            var ico = this.state.index == 0 ? require("../../assets/bg_first_page_shadow1.png") : require("../../assets/bg_first_page_no_shadow1.png");
          }
          const color = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map(inputIndex =>
              inputIndex === i ? "#fd5715" : "#aaa"
            )
          });

          return (
            <TouchableOpacity
              key={i}
              style={styles.tabItem}
              onPress={this._onPressTab.bind(this, i)}
            >
              <Thumbnail square source={ico} style={{ width: w, height: h }} />
              <Animated.Text style={{ color: color, fontSize: 10 }}>
                {route.title}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  __onIndexChange = index => this.setState({ index });

  __renderScene = SceneMap({
    first: Shop,
    second: Winner,
    third: Show,
    forth: Me
  });

  render() {
    return (
      
      <TabView
        navigationState={this.state}
        tabBarPosition="bottom"
        renderScene={this.__renderScene}
        renderTabBar={this.__renderTabBar}
        onIndexChange={this.__onIndexChange}
        initialLayout={this.initialLayout}
      />
    );
  }

  renderScene(route, navigator) {
    switch (route.id) {
      case "Winner":
        return <Winner navigator={navigator} />;
      case "Shop":
        return <Shop navigator={navigator} />;

      default:
        return <Winner navigator={navigator} />;
    }
  }
}

function mapStateToProps(state, props) {
  return {
    loading: state.rootReducer.loading,
    tabIndex: state.rootReducer.tabIndex
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "white",
    height: 47
  },
  label: {
    color: "#fff",
    fontWeight: "400"
  },
  tabItem: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    padding: 10
  }
});

//Connect everything
export default connect(
  mapStateToProps,
  { onLoadingAction }
)(Home);
