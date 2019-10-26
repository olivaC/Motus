'use strict';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        backgroundColor: '#6f6f6f',
        flex: 1,
    },
    content:{
        flex:1,
        backgroundColor:'white',
        padding: 20,
        margin: 5,
        shadowOffset:{  width: 2,  height: 2,  },
        shadowColor: '#c2c2c2',

        borderWidth: 0.5,
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
    },
    content2:{
        flex:1,
        backgroundColor:'white',
        margin: 10,
    },
    header: {
        fontSize: 18,
        color: 'white',
        marginTop: 30,
        padding: 15,
        alignSelf: 'center',
    },
    button: {
        color: 'white',
        alignSelf:  'flex-end',
        position: 'absolute',
        padding: 5,
        // backgroundColor: '#eaeaea',
        // opacity: 0.8
    },
    buttonText:{
        color: 'white',
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 15,
        letterSpacing: 3,
    },
    imageView: {
        height: "100%",
        width: "100%",
        
    },
});