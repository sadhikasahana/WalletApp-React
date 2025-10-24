import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert, ActivityIndicator, TextInput } from 'react-native';
import { fetchPlaidTransactions } from '../services/api';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import * as Keychain from 'react-native-keychain';

type TransactionsScreenRouteProp = RouteProp<RootStackParamList, 'Transactions'>;

const TransactionsScreen = ({ route }: { route: TransactionsScreenRouteProp }) => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [accessToken, setAccessToken] = useState<string | undefined>(route.params?.accessToken);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newCategory, setNewCategory] = useState<string>('');

    useEffect(() => {
        // If accessToken was not passed via navigation, try to get it from Keychain
        if (!accessToken) {
            const retrieveAccessToken = async () => {
                try {
                    const credentials = await Keychain.getGenericPassword();
                    if (credentials) {
                        setAccessToken(credentials.password);
                    } else {
                        Alert.alert('Error', 'No access token found in Keychain.');
                    }
                } catch (error) {
                    Alert.alert('Error', 'Failed to retrieve access token');
                    console.error('Keychain error:', error);
                }
            };
            retrieveAccessToken();
        }
    }, [accessToken]); // Add accessToken to dependency array to avoid unnecessary runs

    const handleFetchTransactions = async () => {
        if (!accessToken) {
            Alert.alert('Error', 'Access token is not available.');
            return;
        }

        setLoading(true);
        try {
            const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
            const endDate = new Date().toISOString().slice(0, 0); // Corrected to fetch today's date
            const data = await fetchPlaidTransactions(accessToken, startDate, endDate);
            setTransactions(data.transactions);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch transactions');
            console.error('Error fetching transactions:', error);
        }
        setLoading(false);
    };

    const handleEditCategory = (id: string, currentCategory: string) => {
        setEditingId(id);
        setNewCategory(currentCategory);
    };

    const handleSaveCategory = (id: string) => {
        setTransactions(transactions.map(txn =>
            txn.transaction_id === id ? { ...txn, category: [newCategory] } : txn
        ));
        setEditingId(null);
        setNewCategory('');
    };

    if (loading || !accessToken) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Fetching transactions...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Button title="Fetch Transactions" onPress={handleFetchTransactions} />
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.transaction_id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text>{item.date} - {item.name}</Text>
                        <Text>${item.amount}</Text>
                        {editingId === item.transaction_id ? (
                            <>
                                <TextInput
                                    style={styles.input}
                                    value={newCategory}
                                    onChangeText={setNewCategory}
                                    placeholder="Edit category"
                                />
                                <Button title="Save" onPress={() => handleSaveCategory(item.transaction_id)} />
                            </>
                        ) : (
                            <>
                                <Text>Category: {item.category ? item.category.join(', ') : 'N/A'}</Text>
                                <Button
                                    title="Edit Category"
                                    onPress={() => handleEditCategory(item.transaction_id, item.category?.[0] || '')}
                                />
                            </>
                        )}
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    loadingText: { marginTop: 10, fontSize: 16 },
    item: { borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 8 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 5, marginBottom: 10 },
});

export default TransactionsScreen;
