import React from 'react';
import { Text, View, StyleSheet, ScrollView, StatusBar, Image, TouchableOpacity} from 'react-native';
import logo from '../../assets/images/logo.png';
import basketproducts from '../../assets/images/basketproducts.png';


const  AboutScreen =() => {
    return(
        <View style={styles.viewStyle} > 

       		 <Text style={styles.textTituloPrincipal}>Sobre nós</Text>		
		<ScrollView style={styles.scrollView}>
		<View style={styles.container} >
			<Image style={styles.logoStyle} source={logo} />	
		</View>	
            <Text style={styles.textTitulos}>Cooperflora</Text>
            <Text style={styles.textSobre}>A Cooperflora é uma cooperativa de produtores rurais sediada no assentamento Milton Santos fundada em 2015. A cooperativa tem trabalhado para construir um mercado de consumo consciente da sua produção fornecendo, em bases semanais, a venda de cestas agroecológicas de seus produtos para grupos de consumo. Os produtores da Cooperflora são certificados pela OCS - Organização de Controle Social.</Text>
			<Text style={styles.textlink}>Link: https://www.facebook.com/Cooperflora1/</Text>
			<Text style={styles.textTitulos}>IFSP Campinas</Text>
            <Text style={styles.textSobre}>O Instituto Federal de Educação, Ciência e Tecnologia de São Paulo – IFSP – é uma autarquia federal de ensino fundada em 1909, como Escola de Aprendizes Artífices. O IFSP é vinculado ao Ministério da Educação (MEC), é reconhecido por sua excelência no ensino público e atuação prioritária na oferta de educação tecnológica.</Text>
			<Text style={styles.textlink}>Link: https://portal.cmp.ifsp.edu.br/</Text>
			<Text style={styles.textTitulos}>Equipe desenvolvedora</Text>
            <Text style={styles.textSobre}>
				------------------------------------------------------------------------------{'\n'}
				------------------------------------------------------------------------------{'\n'}
				------------------------------------------------------------------------------{'\n'}
				------------------------------------------------------------------------------{'\n'}
				------------------------------------------------------------------------------{'\n'}
				</Text>
			<Image style={styles.imageStyle} source={basketproducts} />
			</ScrollView>
			
	    </View>	
    );
};
const styles = StyleSheet.create({

	container: {
		justifyContent: 'center',
		alignItems: 'center',
	
	  },
	logoStyle:{
        borderColor:'#F0F5F9',
        borderWidth: 1,
		borderRadius: 80,
		
    },
    imageStyle:{
	  width: 200,
	  height:250,
	  resizeMode: 'contain'
    },
	scrollView: {
		flex: 1,
    	paddingTop: StatusBar.currentHeight,
		backgroundColor: '#F0F5F9',
		//backgroundColor: 'purple',
		borderRadius: 35
	  },
    viewStyle:{
        height: '100%',
		fontFamily: "roboto",
		backgroundColor: 'white'	
    },
	textTituloPrincipal:{
		fontSize: 32,
		color: "#2D6535",
		bottom: 10,
		left: 50,
		marginBottom:30,
		marginTop:10,
		fontWeight: 'bold'
		
	},
    textTitulos:{
		fontSize: 18,
		marginTop:20,
		marginLeft:26,
		fontWeight: 'bold'
		
    },
    textSobre:{
    	fontSize: 15,
		marginEnd: 15,
		marginLeft: 26,
		textAlign: 'justify'
		
	
    },
	textlink:{
        fontSize: 13,
		left: 26,
		color: 'blue',
    },
   
});

export default AboutScreen;