import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, YellowBox, ScrollView } from 'react-native';
import styles from '../styles/homeStyles';
YellowBox.ignoreWarnings(['Warning:']);


export default class Home extends Component {
    static navigationOptions = {
        title: 'Home',
        headerLeft: null,
    };

    render() {
        return (
            
            <ScrollView style={styles.container}>
                <View style={styles.section}>
                <Image style={styles.imageView} source={require('../img/home1.jpg')} />
                    <View style={styles.content}>
                        <Text style={styles.headerWhite}>{"Statistics".toUpperCase()}</Text>
                        <Text style={styles.whiteText}>View the overall trend in your little one's week throughout their emotional growth</Text>
                        <TouchableOpacity
                        style={styles.buttonWhite}
                        onPress={() => this.props.navigation.navigate('StatisticsScreen')}>
                        <Text style={styles.buttonText}>{"Expand".toUpperCase()}</Text>
                    </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.contentWhite}>
                        <Text style={styles.header}>{"Favorites".toUpperCase()}</Text>
                        <Text style={styles.text}>View your child's favorite lessons</Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => this.props.navigation.navigate('FavoritesScreen')}>
                            <Text style={styles.greyText}>{"Expand".toUpperCase()}</Text>
                        </TouchableOpacity>
                    </View>
                    <Image style={styles.imageView} source={require('../img/home3.jpg')} />
                </View>

                <View style={styles.section}>
                <Image style={styles.imageView} source={require('../img/home2.jpg')} />
                    <View style={styles.content}>
                        <Text style={styles.headerWhite}>{"Parental Emotional Intelligence".toUpperCase()}</Text>
                        <Text style={styles.whiteText}>Learn ways to aid your child emotional development</Text>
                        <TouchableOpacity
                        style={styles.buttonWhite}
                        onPress={() => this.props.navigation.navigate('ResourcesScreen')}>
                        <Text style={styles.buttonText}>{"Expand".toUpperCase()}</Text>
                    </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.contentWhite}>
                        <Text style={styles.header}>{"Make an Appointment".toUpperCase()}</Text>
                        <Text style={styles.text}>Set up appointments, share your thoughts and ask questions specific to your family sessions</Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => this.props.navigation.navigate('ContactScreen')}>
                            <Text style={styles.greyText}>{"Expand".toUpperCase()}</Text>
                        </TouchableOpacity>
                    </View>
                    <Image style={styles.imageView} source={require('../img/home4.jpg')} />
                </View>
               
            </ScrollView>
        )
    }
}
