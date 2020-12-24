import React, { useContext } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import TextInformation from '../components/TextInformation';
import Spinner from '../components/Spinner';
import { NavigationEvents, withNavigation } from 'react-navigation';
import { Context as ConsumerGroupContext } from '../context/ConsumerGroupContext';
import GLOBALS from '../Globals';
import TextLink from '../components/TextLink';
import HeaderTitle from '../components/HeaderTitle';

const ConsumerGroupInfoScreen = ({ navigation }) => {
  const { state, fetchConsumerGroup } = useContext(ConsumerGroupContext);
  const userRole = navigation.getParam('userRole');

  return state.loading ? (
    <Spinner />
  ) : (
    <ScrollView style={styles.container} maximumZoomScale={1.25}>
      <NavigationEvents onWillFocus={fetchConsumerGroup} />
      {userRole === GLOBALS.USER.ROLE.ORGANIZER ? (
        <TextLink
          text="Editar"
          onPress={() =>
            navigation.navigate('EditConsumerGroup', {
              group: state.consumerGroup,
            })
          }
          style={styles.editButton}
        />
      ) : null}
      {state.consumerGroup && state.consumerGroup.address ? (
        <TextInformation title="Endereço" text={state.consumerGroup.address} />
      ) : null}
      {state.consumerGroup && state.consumerGroup.time ? (
        <TextInformation title="Horário" text={state.consumerGroup.time} />
      ) : null}
      {state.consumerGroup && state.consumerGroup.deliveryFrequencyText ? (
        <TextInformation
          title="Entregas"
          text={state.consumerGroup.deliveryFrequencyText}
        />
      ) : null}
      {state.consumerGroup && state.consumerGroup.notice ? (
        <TextInformation
          title="Observações"
          text={state.consumerGroup.notice}
        />
      ) : null}
    </ScrollView>
  );
};

export const consumerGroupInfoNavigationOptions = () => {
  return {
    headerTitle: () => (
      <HeaderTitle title="Cestas Cooperflora" subtitle="Barão Geraldo" />
    ),
    headerBackTitleVisible: false,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#ebebeb',
    marginTop: -8,
  },
  editButton: {
    position: 'absolute',
    alignSelf: 'flex-end',
    top: 15,
    right: 9,
    zIndex: 999,
  },
});

export default withNavigation(ConsumerGroupInfoScreen);
