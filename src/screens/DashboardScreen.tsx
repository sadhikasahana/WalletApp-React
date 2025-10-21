import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Dimensions, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { getExpenses } from '../services/api';
import { PieChart, BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

// Function to generate a random hex color for the pie chart
const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const DashboardScreen = () => {
    const { user } = useContext(AuthContext);
    const [expenses, setExpenses] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchExpenses = async () => {
            setLoading(true);
            try {
                if (user) {
                    const data = await getExpenses(user);
                    setExpenses(data);
                }
            } catch (error) {
                console.error("Failed to fetch expenses:", error);
                Alert.alert('Error', 'Failed to fetch expenses');
            }
            setLoading(false);
        };
        fetchExpenses();
    }, [user]);

    // Prepare data for charts
    const categoryTotals: { [key: string]: number } = {};
    expenses.forEach(exp => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const chartColors = Object.keys(categoryTotals).reduce((acc, cat) => {
        acc[cat] = getRandomColor();
        return acc;
    }, {} as { [key: string]: string });

    const pieData = Object.keys(categoryTotals).map((cat) => ({
        name: cat,
        amount: categoryTotals[cat],
        color: chartColors[cat],
        legendFontColor: '#333',
        legendFontSize: 14,
    }));

    const barLabels = Object.keys(categoryTotals);
    const barData = Object.values(categoryTotals);
    const barColors = barLabels.map(cat => (opacity = 1) => chartColors[cat]);

    return (
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Expense Analytics</Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <>
                        {pieData.length > 0 ? (
                            <View style={styles.chartContainer}>
                                <Text style={styles.chartTitle}>Expenses by Category (Pie)</Text>
                                <PieChart
                                    data={pieData}
                                    width={screenWidth - 32}
                                    height={220}
                                    chartConfig={{
                                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    }}
                                    accessor="amount"
                                    backgroundColor="transparent"
                                    paddingLeft="15"
                                    absolute
                                />
                            </View>
                        ) : (
                            <Text style={styles.noDataText}>No expense data for the pie chart.</Text>
                        )}

                        {barLabels.length > 0 ? (
                            <View style={styles.chartContainer}>
                                <Text style={styles.chartTitle}>Expenses by Category (Bar)</Text>
                                <BarChart
                                    data={{
                                        labels: barLabels,
                                        datasets: [{ data: barData, colors: barColors }],
                                    }}
                                    width={screenWidth - 32}
                                    height={220}
                                    chartConfig={{
                                        backgroundColor: '#fff',
                                        backgroundGradientFrom: '#fff',
                                        backgroundGradientTo: '#fff',
                                        decimalPlaces: 0,
                                        color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    }}
                                    style={{ marginVertical: 16, borderRadius: 8 }}
                                    withCustomBarColorFromData={true}
                                    flatColor={true}
                                    // FIX: Add the required yAxisLabel and yAxisSuffix props
                                    yAxisLabel=""
                                    yAxisSuffix=""
                                />
                            </View>
                        ) : (
                            <Text style={styles.noDataText}>No expense data for the bar chart.</Text>
                        )}
                    </>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    chartContainer: {
        marginBottom: 24,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    noDataText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#888',
    }
});

export default DashboardScreen;
