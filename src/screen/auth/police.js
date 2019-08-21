import React, { PureComponent } from "react";
import { View, StatusBar } from "react-native";
import {
  Container,
  Content,
  Header,
  Body,
  Left,
  Right,
  Title,
  Button,
  Input,
  Text
} from "native-base";

import Ionicon from "react-native-vector-icons/Ionicons";
import { Actions } from "react-native-router-flux";
import firebase from "react-native-firebase";
import CONFIG from "../../configs";

class Police extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { content: "" };
  }

  componentDidMount() {
    const dataQuery = firebase.database().ref("useway");

    var that = this;
    dataQuery.once("value", snapshot => {
      let items = snapshot.val();
      for (let item in items) {
        that.setState({ content: items[item].sharetxt });
      }
    });
  }

  _onPressBackIcon = () => {
    Actions.pop();
  }

  render() {
    return (
      <Container>
        <StatusBar barStyle="light-content" />
        <Header>
          <Left>
            <Button transparent onPress={this._onPressBackIcon}>
              <Ionicon name="ios-arrow-back" size={30} color="#fff" />
            </Button>
          </Left>
          <Body>
            <Title>이용 약관</Title>
          </Body>
          <Right />
        </Header>
        <Content style={{ padding: 20, paddingTop: 30 }}>
          <Text>{this.state.content}</Text>
        </Content>
      </Container>
    );
  }
}
export default Police;
