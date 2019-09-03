import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';

export default class Details extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('repository').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func
    }).isRequired,
  }

  render() {
    const { navigation } = this.props;
    const repository = navigation.getParam('repository');

    return (
        <WebView
          source={{ uri: repository.html_url }}
          style={{ flex: 1 }}
        />
    );
  }
}
