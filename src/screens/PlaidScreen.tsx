import React, { useState, useEffect, useContext } from 'react';
import { View, Button, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { create, open, LinkSuccess, LinkExit } from 'react-native-plaid-link-sdk';
import { BASE_URL } from "../services/api";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import * as Keychain from 'react-native-keychain';

type PlaidScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Plaid'>;

const PlaidScreen = () => {
    const { user } = useContext(AuthContext);
    const [linkToken, setLinkToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<PlaidScreenNavigationProp>();

    useEffect(() => {
        const fetchLinkToken = async () => {
            if (!user) {
                Alert.alert('Error', 'User is not authenticated.');
                return;
            }
            setLoading(true);
            try {
                const res = await fetch(`${BASE_URL}/plaid/create_link_token`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user }),
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch link token');
                }
                const data = await res.json();
                setLinkToken(data.link_token);
                // Preload the link session once the token is received.
                // Call `create()` as soon as the link token is available.
                create({ token: data.link_token });
            } catch (error: any) {
                Alert.alert('Error', `Failed to fetch link token: ${error.message}`);
            }
            setLoading(false);
        };

        if (user) {
            fetchLinkToken();
        }
    }, [user]);

    const handleSuccess = async (success: LinkSuccess) => {
        try {
            const res = await fetch(`${BASE_URL}/plaid/exchange_public_token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ public_token: success.publicToken }),
            });
            if (!res.ok) {
                throw new Error('Failed to exchange public token');
            }
            const data = await res.json();
            await Keychain.setGenericPassword('plaid', data.access_token);
            navigation.navigate('Transactions', { accessToken: data.access_token });
            Alert.alert('Success', 'Bank account linked successfully');
            console.log('Exchange public token successful:', data);
        } catch (error: any) {
            Alert.alert('Error', `Failed to link bank account: ${error.message}`);
        }
    };

    const handleExit = (exit: LinkExit) => {
        console.log('Plaid Link exited', exit);
        if (exit.error) {
            Alert.alert('Plaid Exit Error', exit.error.displayMessage || 'An unexpected error occurred.');
        }
    };

    const handlePlaidOpen = () => {
        if (!linkToken) {
            Alert.alert('Loading', 'Link token is not yet available. Please wait.');
            return;
        }
        // Call `open()` inside the button's onPress handler.
        open({
            onSuccess: handleSuccess,
            onExit: handleExit,
        });
    };

    if (loading || !linkToken) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="Link Bank Account" onPress={handlePlaidOpen} />
        </View>
    );
};

export default PlaidScreen;
