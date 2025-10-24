import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { setSpendingGoal, getSpendingGoal, fetchPlaidTransactions } from "../services/api";
import * as Keychain from 'react-native-keychain';

const GoalScreen = () => {
    const { user } = useContext(AuthContext);
    const [goal, setGoal] = useState("");
    const [current, setCurrent] = useState<string>("0");
    const [loading, setLoading] = useState(true); // Set to true to show indicator on initial fetch
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const month = new Date().toISOString().slice(0, 7); // YYYY-MM format

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) {
                setLoading(false);
                Alert.alert("Error", "User not authenticated.");
                return;
            }

            try {
                // Get access token from Keychain
                const credentials = await Keychain.getGenericPassword({ service: 'plaid_access_token' });
                if (credentials) {
                    setAccessToken(credentials.password);
                } else {
                    Alert.alert("Error", "No access token found. Please link a bank account.");
                    setLoading(false);
                    return;
                }

                // Fetch the spending goal
                const goalData = await getSpendingGoal(user, month);
                if (goalData && goalData.amount) {
                    setGoal(goalData.amount.toString());
                }

                // Fetch the transactions and calculate total spending
                const startDate = `${month}-01`;
                // Calculate last day of the current month
                const lastDay = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
                const endDate = `${month}-${String(lastDay).padStart(2, '0')}`;

                const txData = await fetchPlaidTransactions(credentials.password, startDate, endDate);
                const total = (txData.transactions || []).reduce((sum: number, tx: any) => sum + tx.amount, 0);
                setCurrent(total.toFixed(2));
            } catch (error: any) {
                console.error("Error fetching data:", error);
                Alert.alert('Error', `Error fetching goal or spending: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user, month]);

    const handleSetGoal = async () => {
        if (!user) {
            Alert.alert("Error", "User not authenticated.");
            return;
        }
        if (!goal || isNaN(Number(goal))) {
            Alert.alert("Invalid Input", "Please enter a valid number for the goal.");
            return;
        }
        setLoading(true);
        try {
            const res = await setSpendingGoal(user, month, Number(goal));
            if (res.goal) {
                Alert.alert("Success", "Spending goal set successfully.");
            } else {
                Alert.alert("Error", "Failed to set spending goal.");
            }
        } catch (error: any) {
            Alert.alert("Error", "An error occurred while setting the goal.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const goalNumber = Number(goal);
    const currentNumber = Number(current);
    const percentage = goalNumber > 0 ? ((currentNumber / goalNumber) * 100).toFixed(2) : "0.00";

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Spending Goal for {month}</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Enter your goal amount"
                value={goal}
                onChangeText={setGoal}
            />
            <Button title={"Set Goal"} onPress={handleSetGoal} disabled={loading} />
            <Text style={styles.progress}>
                Spent: ₹{current} / Goal: ₹{goal || 0}
            </Text>
            <Text style={styles.progress}>
                {goalNumber > 0 ? `${percentage}% used` : ""}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
    },
    progress: {
        marginTop: 18,
        fontSize: 18,
        textAlign: 'center',
    },
});

export default GoalScreen;
