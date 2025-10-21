import React, { useState } from 'react';

import { View, Text, Button, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';

import { fetchBankSms, parseExpenseFromSms } from '../utils/smsParser';

import { addExpense } from '../services/api';

import { useContext } from 'react';

import { AuthContext } from '../context/AuthContext';

const ImportSmsScreen = () => {

    const { user } = useContext(AuthContext);

    const [smsList, setSmsList] = useState<any[]>([]);

    const [loading, setLoading] = useState(false);

    const handleFetchSms = async () => {

        setLoading(true);

        try {

            const messages = await fetchBankSms();

            setSmsList(messages);

        } catch (err) {

            Alert.alert('Error', 'Failed to fetch SMS');

        }

        setLoading(false);

    };

    const handleImportExpense = async (sms: any) => {

        const { amount, category } = parseExpenseFromSms(sms.body);

        if (!amount) {

            Alert.alert('Error', 'Could not detect amount in SMS');

            return;

        }

        setLoading(true);

        try {

            const result = await addExpense(user!, category, amount, sms.body, sms.date);

            if (result.expense) {

                Alert.alert('Success', 'Expense imported!');

            } else {

                Alert.alert('Error', result.msg || 'Failed to import expense');

            }

        } catch {

            Alert.alert('Error', 'Failed to import expense');

        }

        setLoading(false);

    };

    return (

        <View style={styles.container}>

            <Button title="Fetch Bank SMS" onPress={handleFetchSms} />

            {loading && <ActivityIndicator size="large" />}

            <FlatList

                data={smsList}

                keyExtractor={item => item._id || item.date + item.body}

                renderItem={({ item }) => (

                    <View style={styles.smsItem}>

                        <Text numberOfLines={3}>{item.body}</Text>

                        <Button title="Import as Expense" onPress={() => handleImportExpense(item)} />

                    </View>

                )}

            />

        </View>

    );

};

const styles = StyleSheet.create({

    container: { flex: 1, padding: 20 },

    smsItem: { borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 8, marginBottom: 10 },

});

export default ImportSmsScreen;