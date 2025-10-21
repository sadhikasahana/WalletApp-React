import React, { useState, useEffect, useContext } from 'react';

import { View, Text, TextInput, Button, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';

import { addRecurringExpense, getRecurringExpenses } from '../services/api';

import { AuthContext } from '../context/AuthContext';

const RecurringScreen = () => {

    const { user } = useContext(AuthContext);

    const [category, setCategory] = useState('');

    const [amount, setAmount] = useState('');

    const [description, setDescription] = useState('');

    const [frequency, setFrequency] = useState('monthly');

    const [nextDue, setNextDue] = useState('');

    const [recurrings, setRecurrings] = useState<any[]>([]);

    const [loading, setLoading] = useState(false);

    const fetchRecurrings = async () => {

        setLoading(true);

        try {

            const data = await getRecurringExpenses(user!);

            setRecurrings(data);

        } catch {

            Alert.alert('Error', 'Failed to fetch recurring expenses');

        }

        setLoading(false);

    };

    useEffect(() => {

        fetchRecurrings();

    }, []);

    const handleAddRecurring = async () => {

        if (!category || !amount || !frequency || !nextDue) {

            Alert.alert('Error', 'All fields are required');

            return;

        }

        setLoading(true);

        try {

            const result = await addRecurringExpense(user!, category, Number(amount), description, frequency, nextDue);

            if (result.recurring) {

                setCategory('');

                setAmount('');

                setDescription('');

                setFrequency('monthly');

                setNextDue('');

                fetchRecurrings();

            } else {

                Alert.alert('Error', result.msg || 'Failed to add recurring expense');

            }

        } catch {

            Alert.alert('Error', 'Failed to add recurring expense');

        }

        setLoading(false);

    };

    return (

        <View style={styles.container}>

            <Text style={styles.title}>Add Recurring Expense</Text>

            <TextInput style={styles.input} placeholder="Category" value={category} onChangeText={setCategory} />

            <TextInput style={styles.input} placeholder="Amount" value={amount} onChangeText={setAmount} keyboardType="numeric" />

            <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />

            <TextInput style={styles.input} placeholder="Frequency (daily/weekly/monthly)" value={frequency} onChangeText={setFrequency} />

            <TextInput style={styles.input} placeholder="Next Due Date (YYYY-MM-DD)" value={nextDue} onChangeText={setNextDue} />

            <Button title="Add Recurring" onPress={handleAddRecurring} />

            <Text style={styles.title}>Recurring Expenses</Text>

            {loading ? (

                <ActivityIndicator size="large" />

            ) : (

                <FlatList

                    data={recurrings}

                    keyExtractor={item => item._id}

                    renderItem={({ item }) => (

                        <View style={styles.recurringItem}>

                            <Text>{item.category}: ₹{item.amount} ({item.frequency})</Text>

                            <Text>{item.description}</Text>

                            <Text>Next Due: {new Date(item.nextDue).toLocaleDateString()}</Text>

                        </View>

                    )}

                />

            )}

        </View>

    );

};

const styles = StyleSheet.create({

    container: { flex: 1, padding: 20 },

    title: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },

    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 10, padding: 10 },

    recurringItem: { borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 8 },

});

export default RecurringScreen;