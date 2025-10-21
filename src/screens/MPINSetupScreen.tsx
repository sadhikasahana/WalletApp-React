import React, { useState } from 'react';

import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const MPINSetupScreen = ({ route, navigation }: any) => {
  const [mpin, setMpin] = useState('');

  const [confirmMpin, setConfirmMpin] = useState('');

  const { mobile, email } = route.params || {};

  const handleSetup = () => {
    if (!mpin || !confirmMpin) {
      Alert.alert('Error', 'Please enter and confirm your MPIN.');

      return;
    }

    if (mpin !== confirmMpin) {
      Alert.alert('Error', 'MPINs do not match.');

      return;
    }

    // TODO: Send MPIN to backend for saving

    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Up MPIN</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter MPIN"
        secureTextEntry
        keyboardType="number-pad"
        value={mpin}
        onChangeText={setMpin}
        maxLength={6}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm MPIN"
        secureTextEntry
        keyboardType="number-pad"
        value={confirmMpin}
        onChangeText={setConfirmMpin}
        maxLength={6}
      />

      <Button title="Save MPIN" onPress={handleSetup} />
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

export default MPINSetupScreen;
