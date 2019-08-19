import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';
import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Author,
  Title,
  Info,
  MoreButton,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  state = {
    stars: [],
    loading: false,
    refreshing: false,
    page: 1,
    user: {},
  }

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func
    }).isRequired,
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    const { page } = this.state;

    this.setState({ loading: true, user });

    const response = await api.get(`users/${user.login}/starred`, {
      params: {
        page,
        per_page: 20,
      },
    });

    this.setState({
      stars: response.data,
      loading: false,
    });
  }

  loadMore = async page => {
    const { user, stars } = this.state;

    this.setState({ loading: true, user });

    const response = await api.get(`users/${user.login}/starred`, {
      params: {
        page,
        per_page: 20,
      },
    });

    this.setState({
      stars: [...stars, ...response.data],
      loading: false,
      page,
    });
  };

  refreshList = async () => {
    const { user } = this.state;

    this.setState({ refreshing: true });

    const response = await api.get(`users/${user.login}/starred`, {
      params: {
        page: 1,
        per_page: 20,
      },
    });

    this.setState({
      stars: response.data,
      refreshing: false,
      page: 1,
    });
  };

  handleNavigate = repository => {
    const { navigation } = this.props;

    navigation.navigate('Details', { repository });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, page, refreshing } = this.state;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        <Stars
        data={stars}
        onRefresh={this.refreshList} // Função dispara quando o usuário arrasta a lista pra baixo
        refreshing={refreshing}
        keyExtractor={star => String(star.id)}
        onEndReachedThreshold={0.2} // Carrega mais itens quando chegar em 20% do fim
        onEndReached={() => (stars.size >= 15 && this.loadMore(page + 1)) }
        renderItem={({ item }) => (
          <Starred>
            <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
            <Info>
              <Title> { item.name } </Title>
              <Author> { item.owner.login } </Author>
            </Info>
            <MoreButton onPress={() => this.handleNavigate(item)}>
              <Icon name="search" size={20} color="#FFF" />
              </MoreButton>
          </Starred>
        )} />

        { loading ? <ActivityIndicator color="#7159c1" size={30}  /> : <></>}

      </Container>
    );
  }
}
