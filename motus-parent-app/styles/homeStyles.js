'use strict';
import { StyleSheet, Dimensions } from 'react-native';
let w = Dimensions.get('window').height

export default StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        flex: 1,
    },
    header: {
        fontSize: 11,
        paddingVertical: 10,
        fontWeight: 'bold',
        marginTop: 10,
    },
    headerWhite: {
        fontSize: 11,
        paddingVertical: 10,
        color: 'white',
        fontWeight: 'bold',
        marginTop: 10,
    },
    section:{
        flex: 1,
        height: w/4.8,
        flexDirection: 'row',
    },
    content:{
        backgroundColor: '#6f6f6f',
        flex: 1,
        padding: 10,
    },
    contentWhite:{
        backgroundColor: 'white',
        flex: 1,
        padding: 10,
        marginLeft: 5,
    },
    button: {
        borderRadius: 8,
        borderColor:'#6f6f6f',
        padding: 5,
        backgroundColor: 'transparent',
        borderWidth: 1,
        alignItems: 'center',
        alignSelf:'baseline',
    },
    buttonWhite: {
        borderRadius: 8,
        borderColor:'white',
        padding: 5,
        backgroundColor: 'transparent',
        borderWidth: 1,
        alignItems: 'center',
        alignSelf:'baseline',
    },
    whiteText: {
        color: '#dadada',
        fontSize: 11,
        paddingBottom: 10,
    },
    text: {
        color: '#6f6f6f',
        fontSize: 11,
        paddingBottom: 10,
    },
    greyText: {
        color: '#6f6f6f',
        alignSelf: 'center',
        fontSize: 9,
        paddingHorizontal: 2,
        fontWeight: 'bold',
    },
    buttonText:{
        color: 'white',
        alignSelf: 'center',
        fontSize: 9,
        paddingHorizontal: 2,
        fontWeight: 'bold',
    },
    imageView: {
        width: '35%',
        height: '100%',
        
    },
});