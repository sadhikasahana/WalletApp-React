import React, { useState, useEffect, useContext } from 'react';

import {
    View,
    Text,
    TextInput,
    Button,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';

import { addExpense, getExpenses } from '../services/api';
import { setCategoryLimit, checkCategoryLimit } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ExpenseScreen = () => {
    const { user } = useContext(AuthContext);

    const [category, setCategory] = useState('');

    const [amount, setAmount] = useState('');

    const [description, setDescription] = useState('');

    const [expenses, setExpenses] = useState<any[]>([]);

    const [loading, setLoading] = useState(false);

    const [limit, setLimit] = useState('');

    const [limitExceeded, setLimitExceeded] = useState(false);

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const data = await getExpenses(user!);
            setExpenses(data);
        } catch {
            Alert.alert('Error', 'Failed to fetch expenses');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleSetLimit = async () => {
        if (!category || !limit) {
            Alert.alert('Error', 'Category and limit are required');

            return;
        }

        setLoading(true);

        try {
            const result = await setCategoryLimit(user!, category, Number(limit));

            if (result.limit) {
                Alert.alert('Success', 'Limit set');

                setLimit('');
            } else {
                Alert.alert('Error', result.msg || 'Failed to set limit');
            }
        } catch {
            Alert.alert('Error', 'Failed to set limit');
        }

        setLoading(false);
    };

    const handleAddExpense = async () => {
        if (!category || !amount) {
            Alert.alert('Error', 'Category and amount are required');
            return;
        }
        setLoading(true);
        try {
            const limitCheck = await checkCategoryLimit(user!, category);

            if (limitCheck.exceeded) {
                Alert.alert('Alert', `Limit exceeded for ${category}!`);

                setLimitExceeded(true);
            } else {
                setLimitExceeded(false);
            }

            const result = await addExpense(
                user!,
                category,
                Number(amount),
                description,
            );

            if (result.expense) {
                setCategory('');
                setAmount('');
                setDescription('');
                fetchExpenses();
            } else {
                Alert.alert('Error', result.msg || 'Failed to add expense');
            }
        } catch {
            Alert.alert('Error', 'Failed to add expense');
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Expense</Text>
            <TextInput
                style={styles.input}
                placeholder="Category"
                value={category}
                onChangeText={setCategory}
            />

            <TextInput
                style={styles.input}
                placeholder="Amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
            />

            <TextInput
                style={styles.input}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
            />

            <Button title="Add Expense" onPress={handleAddExpense} />

            <Text style={styles.title}>Expenses</Text>

            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <FlatList
                    data={expenses}
                    keyExtractor={item => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.expenseItem}>
                            <Text>
                                {item.category}: ₹{item.amount}
                            </Text>

                            <Text>{item.description}</Text>

                            <Text>{new Date(item.date).toLocaleDateString()}</Text>
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

    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        padding: 10,
    },

    expenseItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingVertical: 8,
    },
});

export default ExpenseScreen;
