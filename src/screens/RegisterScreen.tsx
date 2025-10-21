import React, { useState } from 'react';
import { register } from '../services/api';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const RegisterScreen = ({ navigation }: any) => {
  const [mobile, setMobile] = useState('');

  const [email, setEmail] = useState('');

  const handleRegister = async () => {
    if (!mobile || !email) {
      Alert.alert('Error', 'Please enter both mobile number and email.');
      return;
    }

    // call backend API
    const result = await register(mobile, email, '000000'); // Temporarily pass dummy MPIN, will be set in MPINSetup
    if (result.msg === 'Registered successfully') {
      navigation.navigate('MPINSetup', { mobile, email });
    } else {
      Alert.alert('Registration Failed', result.msg || 'Unknown error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        keyboardType="phone-pad"
        value={mobile}
        onChangeText={setMobile}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Button title="Register" onPress={handleRegister} />

      <Button title="Back to Login" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    padding: 10,
  },
});

export default RegisterScreen;
