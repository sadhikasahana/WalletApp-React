import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MPINSetupScreen from './src/screens/MPINSetupScreen';
import HomeScreen from './src/screens/HomeScreen';
import ExpenseScreen from './src/screens/ExpenseScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import RecurringScreen from './src/screens/RecurringScreen';
import ReminderScreen from './src/screens/ReminderScreen';
import { configureNotifications } from './src/utils/notification';
import { useEffect } from 'react';

const Stack = createNativeStackNavigator();
function AppNavigator() {
  const { user } = React.useContext(AuthContext);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="MPINSetup" component={MPINSetupScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Expense" component={ExpenseScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Recurring" component={RecurringScreen} />
          <Stack.Screen name="Reminder" component={ReminderScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {

  useEffect(() => {
    configureNotifications();
  });

  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
