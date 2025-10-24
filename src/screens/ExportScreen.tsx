import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet, Alert, Linking } from 'react-native';
import { getExpenseCsvUrl } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ExportScreen = () => {
    const { user } = useContext(AuthContext);

    const handleExport = () => {
        const url = getExpenseCsvUrl(user!);
        Linking.openURL(url!).catch(err =>
            Alert.alert('Error', 'Failed to open URL: ' + err.message)
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Export Expenses</Text>
            <Button title="Export as CSV" onPress={handleExport} />
            <Text style={styles.info}>The CSV will open in your browser or download manager.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    info: {
        marginTop: 20,
        color: '#555',
        textAlign: 'center',
    },
});

export default ExportScreen;