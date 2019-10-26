'use strict';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    header: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#00aeef',
        borderRadius: 15,
        padding: 10,
        width: "30%",
        alignSelf: 'center',
    },
    buttonText:{
        color: 'white',
        alignSelf: 'center',
        fontSize: 15,
    },
    container: {
        backgroundColor: '#ffffff',
        flex: 1,
    },
    imageView: {
        width: 200,
        height: 200,
        margin: 7,
        borderRadius: 100,
        alignSelf: 'center',
    },
    indicator: {
        flex: 1,
        justifyContent: 'center',
        height: 80
    },
    row:{
        flex: 1,
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center',
    },
    greyButton:{
        backgroundColor: '#c2c2c2',
        margin: 5,
        borderRadius: 15,
        padding: 10,
        width: "30%",
        alignSelf: 'center',
    }
});