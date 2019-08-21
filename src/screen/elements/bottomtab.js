import React, { PureComponent } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text
} from "react-native";
import {
  Footer,
  FooterTab,
  Thumbnail
} from "native-base";

import { Actions } from "react-native-router-flux";
//const ShopIconSel = require("../../assets/bg_first_page_shadow1.png");
//const WinerIcon = require("../../assets/ic_win_select.png");
//const showIcon = require("../../assets/ic_show1.png");
//const MeIcon = require("../../assets/ic_my.png");

class BottomTab extends PureComponent {
  constructor(props) {
    super(props);
  }

  onClickedTab = (index) => {
    if (index === 0) {
      Actions.tab_1_1();
    }
    if (index === 1) {
      Actions.tab_1_2();
    }
    if (index === 2) {
      Actions.Show();
    }
    if (index === 3) {
      Actions.Me();
    }
  }

  render() {
    return (
      <Footer style={{ backgroundColor: "#fbfbfb", height: 45 }}>
        <FooterTab style={{ backgroundColor: "#fbfbfb" }}>
          <TouchableOpacity
            style={styles.footBtn}
            onPress={this.onClickedTab.bind(this, 0)}
          >
            <Thumbnail
              square
              source={require("../../assets/bg_coin_backage.png")}
              style={{ width: 21, height: 21 }}
            />
            <Text style={styles.tab_font}>Shop</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footBtn}
            onPress={this.onClickedTab.bind(this, 1)}
          >
            <Thumbnail
              square
              source={require("../../assets/ic_win_select.png")}
              style={{ width: 28, height: 28 }}
            />
            <Text style={styles.tab_font}>Winner</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footBtn}
            onPress={this.onClickedTab.bind(this, 2)}
          >
            <Thumbnail
              square
              source={require("../../assets/ic_show1.png")}
              style={{ width: 21, height: 21 }}
            />
            <Text style={styles.tab_font}>Show</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footBtn}
            onPress={this.onClickedTab.bind(this, 3)}
          >
            <Thumbnail
              square
              source={require("../../assets/ic_my.png")}
              style={{ width: 21, height: 21 }}
            />
            <Text style={styles.tab_font}>Me</Text>
          </TouchableOpacity>
        </FooterTab>
      </Footer>
    );
  }
}

const styles = StyleSheet.create({
  tab_font: {
    fontSize: 10,
    color: "#fd5715"
  },
  footBtn: {
    flex: 0.25,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default BottomTab;
