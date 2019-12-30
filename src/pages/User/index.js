import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  RepoButton,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

const propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }).isRequired,
};

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  state = {
    stars: [],
    loading: true,
    currentPage: 1,
    endReached: false,
    refreshing: false,
  };

  async componentDidMount() {
    this.loadStarreds();
  }

  handleNavigate = repository => {
    const { navigation } = this.props;

    navigation.navigate('Repository', { repository });
  };

  async loadStarreds() {
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    const { stars, currentPage, endReached } = this.state;

    if (endReached) return;

    this.setState({ loading: true });

    const response = await api.get(
      `/users/${user.login}/starred?page=${currentPage}`
    );

    if (response.data.length === 0) {
      this.setState({ endReached: true });
    }
    this.setState({
      stars: [...stars, ...response.data],
      loading: false,
      currentPage: currentPage + 1,
    });
  }

  async refreshList() {
    this.setState({
      stars: [],
      loading: true,
      currentPage: 1,
      endReached: false,
    });

    this.loadStarreds();
  }

  render() {
    const { navigation } = this.props;
    const { stars, loading, refreshing } = this.state;

    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? <ActivityIndicator color="#0a0" size="large" /> : <></>}

        <Stars
          data={stars}
          keyExtractor={star => String(star.id)}
          onEndReachedThreshold={0.2}
          onEndReached={() => this.loadStarreds()}
          onRefresh={() => this.refreshList()}
          refreshing={refreshing}
          renderItem={({ item }) => (
            <RepoButton onPress={() => this.handleNavigate(item)}>
              <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
              <Info>
                <Title>{item.name}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
            </RepoButton>
          )}
        />
      </Container>
    );
  }
}

User.propTypes = propTypes;
