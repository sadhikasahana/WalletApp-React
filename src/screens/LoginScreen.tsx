import React, { useState, useContext } from 'react';

import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

import { AuthContext } from '../context/AuthContext';

import { login as loginApi } from '../services/api';

const LoginScreen = ({ navigation }: any) => {
  const [mobile, setMobile] = useState('');

  const [mpin, setMpin] = useState('');

  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (mobile && mpin) {
      const result = await loginApi(mobile, mpin);
      if (result.token) {
        await login(mobile);
      } else {
        Alert.alert('Login Failed', result.msg || 'Unknown error');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        keyboardType="phone-pad"
        value={mobile}
        onChangeText={setMobile}
      />

      <TextInput
        style={styles.input}
        placeholder="MPIN"
        secureTextEntry
        value={mpin}
        onChangeText={setMpin}
      />

      <Button title="Login" onPress={handleLogin} />

      <Button
        title="Register"
        onPress={() => navigation.navigate('Register')}
      />
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

export default LoginScreen;
