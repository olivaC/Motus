'use strict';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        flex: 1,
    },
    header: {
        fontSize: 18,
        color: '#424242',
        padding: 15,
        alignSelf: 'center',
    },
    title:{
        fontSize: 11,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingHorizontal: 5,
    },
    teaser:{
        fontSize:8,
        backgroundColor: 'white',
        margin: 5,
        textAlign: 'left',
        // lineHeight: 20,
    },
    content:{
        height: 200,
        width: 320,
        justifyContent: 'center', 
        alignItems: 'center',
        flex: 1,
        alignSelf:'baseline',
        margin: 5,
        // backgroundColor: 'blue',
        borderColor: '#b7b7b7',
        borderWidth: 0.5
    },
    textContent:{
        height: "50%",
        width: "100%",
        alignItems: 'center',
        padding: 10,
    },
    imageView: {
        height: "50%",
        width: "100%",
        alignSelf: 'center',
    },
    absoluteView: {
        flex: 1,
        position: 'absolute',
        flexDirection: "row",
        alignItems: "stretch"
    },
});