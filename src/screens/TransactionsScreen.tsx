import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { fetchPlaidTransactions } from '../services/api';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

type TransactionsScreenRouteProp = RouteProp<RootStackParamList, 'Transactions'>;

const TransactionsScreen = ({ route }: { route: TransactionsScreenRouteProp }) => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { accessToken } = route.params;

    const handleFetchTransactions = async () => {
        setLoading(true);
        try {
            const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10); // 30 days ago
            const endDate = new Date().toISOString().slice(0, 10); // today
            const data = await fetchPlaidTransactions(accessToken, startDate, endDate);
            setTransactions(data.transactions);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch transactions');
            console.error('Error fetching transactions:', error);
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Button title="Fetch Transactions" onPress={handleFetchTransactions} />
            {loading && <ActivityIndicator size="large" />}
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.transaction_id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text>{item.date} - {item.name}</Text>
                        <Text>${item.amount} | {item.category?.join(', ')}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    item: { borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 8 },
});

export default TransactionsScreen;