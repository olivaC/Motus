'use strict';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        flex: 1,
    },
    header: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'black',
        padding: 15,
        alignSelf: 'center',
        letterSpacing: 2,
    },
    title:{
        fontSize: 11,
        textTransform: 'uppercase',
        padding: 10,
        alignSelf: 'center',
    },
    teaser:{
        fontSize: 8,
        textTransform: 'uppercase',
        padding: 10,
        alignSelf: 'center',
        textAlign: 'left',
    },
    content:{
        height: 150,
        width: 320,
        justifyContent: 'center', 
        alignItems: 'center', 
        flexDirection: 'row', 
        flex: 1,
        alignSelf:'center',
        margin: 10,
        backgroundColor: '#f9f9f9',
        shadowOffset:{  width: 2,  height: 2,  },
        shadowColor: '#c2c2c2',
        borderWidth: 0.5,
        borderRadius: 2,
        borderColor: '#f9f9f9',
        borderBottomWidth: 0,
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
    },
    textContent:{
        height: "100%",
        width: "50%",
    },
    imageView: {
        height: "100%",
        width: "50%",
    },
    absoluteView: {
        flex: 1,
        position: 'absolute',
    },
    button:{
        backgroundColor: '#96A8CE',
        alignSelf: 'center',
        padding: 5,
        color: 'white',
        borderRadius: 5,
        fontSize: 8,
        borderWidth: 1,
        borderColor: 'transparent'
    },
    buttonText:{
        alignSelf:'baseline',
        color: 'white',
        fontSize: 8,
    },
});