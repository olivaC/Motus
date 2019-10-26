import React, { Component } from 'react';
import { StyleSheet, Dimensions, } from 'react-native';
import Pdf from 'react-native-pdf';

export default class PdfScreen extends Component {
    static navigationOptions = {
        title: 'PDF'
    };

    render() {
        console.log(this.props.navigation.state.params.item);
        const source = {uri:this.props.navigation.state.params.item.pdf_file,cache:true}; // Set the source of the pdf

        return <Pdf
            source={source}
            style={styles.pdf}
        />;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width
    }
});