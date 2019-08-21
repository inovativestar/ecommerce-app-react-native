import React, { PureComponent } from "react";

import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet
} from "react-native";

import CONFIG from "../../configs";
//import { Actions } from "react-native-router-flux";

export default class CardExpense extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { coin_val: 1 };
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.cardContainer}
        activeOpacity={0.9}
      >
        <View
          style={{
            flex: 1,
            height: 30,
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <View
            style={{
              flex: 0.6,
              paddingLeft: 10,
              borderRightColor: "#EEE",
              borderRightWidth: 1,
              alignItems: "center"
            }}
          >
            <Text style={{ fontSize: 13, color: CONFIG.SECONDARY_COLOR }}>
              {this.props.info.time}
            </Text>
          </View>
          <View style={{ flex: 0.4, paddingRight: 10 }}>
            <Text style={{ alignSelf: "center", fontSize: 13, color: "red" }}>
              MRY {this.props.info.moneycount}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "white",
    zIndex: 0.5,
    position: "relative",
    marginBottom: 2
  }
});
