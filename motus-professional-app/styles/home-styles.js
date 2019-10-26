'use strict';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#212121',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        color: '#ffffff',
        paddingTop: 50,
        margin: 20,
    },
    header: {
        backgroundColor: '#212121',
        color: 'white',
        textAlign: 'center',
        fontSize: 15,
    },
    headerBorder:{
        alignItems:'center',
        padding:10,
        backgroundColor:'#212121',
    },
    bodyBorder:{
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row',
        backgroundColor:'white',
        padding: 10,
    },
    bodyBorderBlack:{
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row',
        backgroundColor:'#3c3c3c',
        padding: 10,
    },
    content:{
        alignItems: 'center',
        textAlign: 'center',
        padding: 10,
    },
    button: {
        borderRadius: 8,
        borderColor:'#282828',
        margin: 5,
        padding: 5,
        backgroundColor: 'white',
        borderWidth: 1.5,
        fontSize: 10,
    },
    textView: {
        width: '100%',
        fontSize: 15,
        padding: 13,
        color: '#000',
        textAlign: 'center',
    },
    row:{
        flexDirection:'row',
        padding: 5,
        alignItems: 'center',
    },
    resources:{
        padding: 10,
        backgroundColor: 'white',
    },
    name:{
        padding: 5,
        textAlign: 'center',
        fontSize: 12
    },
    profile:{
        alignItems: 'center',
        textAlign: 'center',
        padding: 10,
        backgroundColor: 'white'
    },
    buttonWhite: {
        borderRadius: 8,
        borderColor:'white',
        margin: 5,
        padding: 5,
        backgroundColor: 'transparent',
        borderWidth: 1.5,
    },
    resourcesContent:{
        height: 80,
        width: 250,
        flexDirection: 'row', 
        flex: 1,
        alignSelf:'center',
        margin: 10,
        backgroundColor: '#F5F5F5',
    },
    rButton:{
        backgroundColor: '#96ABCE',
        padding: 5,
        color: 'white',
        borderRadius: 5,
        fontSize: 8,
        borderWidth: 1,
        borderColor: 'transparent',
        alignSelf: 'center'
    },
    rButtonText:{
        color: 'white',
        fontSize: 8,
    },
    imageView: {
        height: "100%",
        width: "45%",
        justifyContent: 'flex-start',
    },
    textContent:{
        height: "100%",
        width: "50%",
    },
    title:{
        fontSize: 9,
        padding: 10,
        alignSelf: 'center',
        textAlign: 'left',
    },
    regText:{
        fontSize: 9,
    },
    whiteText:{
        fontSize: 9,
        color:'white'
    },
    textUpper:{
        fontSize: 10,
        textTransform: 'uppercase',
        fontWeight: 'normal'
    },
    textNormal:{
        fontSize: 10,
        textTransform: 'uppercase',
    },
    squareImage:{
        width: 90,
        height: 110,
        alignSelf: 'center'
    },
    greyText:{
        color: '#4c4c4c',
        textTransform: 'uppercase',
        fontSize: 9,
        padding: 2,
    },
    client:{
        width: 80,
        height: 110,
        alignSelf: 'center'
    },
    week:{
        padding: 5,
        backgroundColor: '#9AABCB',
        opacity: 0.8,
        margin: 5,
        alignItems:'center',
        width: 40,
        height: 40,
        shadowOffset: { width: 2, height: 2, },
        shadowColor: '#c2c2c2',

        borderWidth: 0.5,
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
    },
    week_num:{
        fontSize: 12,
        // color:'white'
    }


});