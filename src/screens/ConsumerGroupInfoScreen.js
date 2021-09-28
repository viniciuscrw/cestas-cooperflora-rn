import React, { useContext } from 'react';
import { View,Text,ScrollView, StyleSheet, Dimensions,Image } from 'react-native';
import TextInformation from '../components/TextInformation';
import Spinner from '../components/Spinner';
import { NavigationEvents, withNavigation } from 'react-navigation';
import { Context as ConsumerGroupContext } from '../context/ConsumerGroupContext';
import GLOBALS from '../Globals';
// import TextLink from '../components/TextLink';
import { Entypo } from '@expo/vector-icons'; 
import HeaderTitle from '../components/HeaderTitle';
import { AntDesign } from '@expo/vector-icons';
import BackArrow from '../components/BackArrow';
import { Ionicons } from '@expo/vector-icons';
const ConsumerGroupInfoScreen = ({ navigation }) => {
  const { state, fetchConsumerGroup } = useContext(ConsumerGroupContext);
  const userRole = navigation.getParam('userRole');

  return state.loading ? (
    <Spinner />
  ) :(
    <ScrollView style={styles.container} maximumZoomScale={1.25}>
    <Text/>  
    <View style={styles.card}>
        <Text></Text>
        <Text style={styles.text}>Informações Gerais:</Text>
        <NavigationEvents onWillFocus={fetchConsumerGroup} />
        {userRole === GLOBALS.USER.ROLE.ORGANIZER ? (
          <AntDesign 
            name="form" 
            size={27} 
            color="#FA6210" 
            onPress={() =>
              navigation.navigate('EditConsumerGroup', {
                group: state.consumerGroup,
              })
            }
            style={styles.editButton} 
          />
        ) : null}
        <Text/>
        <View style={styles.card2}>
        {/* <View><Text/></View>   */}
        <View 
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            
          }}>
          <Image
            source={require('../../assets/images/icons/local.jpg')}
            style={{
              width: 22,
              height: 33,
              marginRight: 35,
              marginTop: 22
            }}
          /> 

            {state.consumerGroup && state.consumerGroup.address ? (
              <TextInformation 
                title="Local" 
                text={state.consumerGroup.address} 
              />    
            ) : null}
        </View>
        <View><Text/></View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Image
            source={require('../../assets/images/icons/greenbasket.png')}
            style={{
              width: 25,
              height: 24,
              marginRight: 33
            }}
          /> 
            {state.consumerGroup && state.consumerGroup.deliveryFrequencyText ? (
              <TextInformation
                title="Entregas"
                text={state.consumerGroup.deliveryFrequencyText}
              />
            ) : null}
        </View>
        <View><Text/></View>  
        <View
          style={{
            flexDirection: 'row',
          
          }}
        >
          <Image
            source={require('../../assets/images/icons/watch.jpg')}
            style={{
              width: 25,
              height: 25,
              marginRight: 33
            }}
          /> 
            {state.consumerGroup && state.consumerGroup.time ? (
            <TextInformation title="Horário" text={state.consumerGroup.time} />
            ) : null}
        </View>
        <View><Text/></View>  
        {state.consumerGroup && state.consumerGroup.notice ? (
          <TextInformation
            title="Observações"
            text={state.consumerGroup.notice}
          />
        ) : null}
        {/* <View><Text/></View>   */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/basketproducts2.png')}
            style={styles.image}
          />
        </View>
      </View>   
    </View>  
    </ScrollView>
  );
};

export const consumerGroupInfoNavigationOptions = () => {
  return {
    headerTitle: () => (
      <HeaderTitle title="Cestas Cooperflora" subtitle="Barão Geraldo" />
    ),
    headerBackImage: () => (<BackArrow />),
    headerBackTitleVisible: false,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 15,
    backgroundColor: '#ebebeb',
    marginTop: -2,
    // marginLeft: 10
  },
  image: {
    width: '100%',
    height: '100%'
  },
  imageContainer:{
    width: 310,
    height: 180,
    elevation: 49,
    zIndex: 2,
    right: -120,
    marginTop: -35
  },
  editImage:{
    alignSelf: 'flex-end',
    right: 9
  },
  editButton:{
    alignSelf: 'flex-end',
    right: 44,
    marginTop: -26 
  },
  text: {
    fontSize: 13,
    color: 'black',
    alignSelf: 'flex-start',
    right: -22,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#F0F5F9',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 5
  },
  card2: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderLeftColor: '#F0F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    // height: 305,
    width: 360,
    backgroundColor: 'white',
    padding:7,
    flex:2
  }
});

export default withNavigation(ConsumerGroupInfoScreen);
