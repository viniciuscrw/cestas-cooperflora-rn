import React from 'react';
import { Text, View, StyleSheet, ScrollView, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import logo from '../../assets/images/logocooperflora.png';
import basketproducts from '../../assets/images/basketproducts.png';
import HeaderTitle from '../components/HeaderTitle';
import BackArrow from '../components/BackArrow';
import { stardardScreenStyle as screen } from './screenstyles/ScreenStyles';
import { TextContent, TextLabel } from '../components/StandardStyles';
import Colors from '../constants/Colors';

const AboutScreen = () => {
  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.imageContainer}>
            <Image style={styles.logoStyle} source={logo} />
          </View>
          <TextLabel>PROJETO</TextLabel>
          <View style={styles.textContainer}>
            <TextContent style={{ textAlign: 'justify' }}>
              Este aplicativo foi desenvolvido através de um projeto de extensão
              do Instituto Federal de São Paulo campus Campinas.
            </TextContent>
          </View>
          <TextLabel>COOPERFLORA</TextLabel>
          <View style={styles.textContainer}>
            <TextContent style={{ textAlign: 'justify' }}>
              A Cooperflora é uma cooperativa de produtores rurais sediada no
              assentamento Milton Santos fundada em 2015. A cooperativa tem
              trabalhado para construir um mercado de consumo consciente da sua
              produção fornecendo, em bases semanais, a venda de cestas
              agroecológicas de seus produtos para grupos de consumo. Os
              produtores da Cooperflora são certificados pela OCS - Organização
              de Controle Social.
            </TextContent>
          </View>
          <View style={styles.linkContainer}>
            <AntDesign name="link" size={24} color="black" />
            <Text style={styles.textlink}>
              https://www.facebook.com/Cooperflora1/
            </Text>
          </View>
          <TextLabel style={styles.textTitulos}>IFSP CAMPINAS</TextLabel>
          <View style={styles.textContainer}>
            <TextContent style={{ textAlign: 'justify' }}>
              O Instituto Federal de Educação, Ciência e Tecnologia de São Paulo
              – IFSP – é uma autarquia federal de ensino fundada em 1909, como
              de Aprendizes Artífices. O IFSP é vinculado ao Ministério da
              Educação (MEC), é reconhecido por sua excelência no ensino público
              e atuação prioritária na oferta de educação tecnológica.
            </TextContent>
          </View>
          <View style={styles.linkContainer}>
            <AntDesign name="link" size={24} color="black" />
            <Text style={styles.textlink}>https://portal.cmp.ifsp.edu.br/</Text>
          </View>
          <TextLabel>EQUIPE DE DESENVOLVIMENTO</TextLabel>
          <View style={styles.textContainer}>
            <TextLabel style={{ paddingTop: 10 }}>Coordenação</TextLabel>
            <TextContent>André Luís Bordignon</TextContent>
            <TextLabel style={{ paddingTop: 10 }}>Desenvolvimento</TextLabel>
            <TextContent>André Luís Bordignon</TextContent>
            <TextContent>Vinícius Costa Regaço</TextContent>
            <TextLabel style={{ paddingTop: 10 }}>Design</TextLabel>
            <TextContent>Mateus Santos Magalhães</TextContent>
            <TextLabel style={{ paddingTop: 10 }}>Bolsistas</TextLabel>
            <TextContent>Luana Matallo Ruggiero</TextContent>
            <TextContent>Rafal Almeida</TextContent>
            <TextContent>Yasmin Souza Lima</TextContent>
          </View>
          <Image style={styles.imageStyle} source={basketproducts} />
        </ScrollView>
      </View>
    </View>
  );
};

export const aboutScreenOptions = () => {
  return {
    headerTitle: () => (
      <View style={styles.header}>
        <HeaderTitle title="Sobre Nós" />
      </View>
    ),
    headerBackImage: () => <BackArrow />,
    headerStyle: {
      backgroundColor: 'transparent',
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
  };
};

const styles = StyleSheet.create({
  screen,
  container: {
    flex: 1,
    margin: 20,
  },
  logoStyle: {
    borderColor: '#F0F5F9',
    borderWidth: 1,
    borderRadius: 80,
  },
  imageContainer: {
    alignSelf: 'center',
    padding: 10,
  },
  imageStyle: {
    width: 200,
    height: 250,
    resizeMode: 'contain',
  },
  textContainer: {
    padding: 10,
    textAlign: 'justify',
  },
  linkContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  textSobre: {
    fontSize: 15,
    marginEnd: 15,
    marginLeft: 26,
    textAlign: 'justify',
  },
  textlink: {
    fontSize: 16,
    paddingLeft: 10,
    color: Colors.headerTitleColor,
  },
  header: {
    alignItems: 'flex-start',
  },
});

export default AboutScreen;
