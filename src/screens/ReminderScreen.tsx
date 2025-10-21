import React, { useEffect, useState, useContext } from 'react';

import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';

import { getDueRecurringExpenses } from '../services/api';

import { AuthContext } from '../context/AuthContext';

import { sendLocalNotification } from '../utils/notification';

const ReminderScreen = () => {
    const { user } = useContext(AuthContext);
    const [due, setDue] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchDue = async () => {
            setLoading(true);
            try {
                const data = await getDueRecurringExpenses(user!);
                setDue(data);
                if (data.length > 0) {
                    sendLocalNotification('Wallet Reminder', `You have ${data.length} recurring expenses due today.`);
                }
            } catch {
                Alert.alert('Error', 'Failed to fetch reminders');
            }
            setLoading(false);
        };
        fetchDue();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Reminders for Today</Text>
            {loading ? (
                <ActivityIndicator size="large" />
            ) : due.length === 0 ? (
                <Text>No reminders for today.</Text>
            ) : (
                <FlatList
                    data={due}
                    keyExtractor={item => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.reminderItem}>
                            <Text>{item.category}: ₹{item.amount} ({item.frequency})</Text>
                            <Text>{item.description}</Text>
                            <Text>Due: {new Date(item.nextDue).toLocaleDateString()}</Text>
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
    reminderItem: { borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 8 },
});

export default ReminderScreen;