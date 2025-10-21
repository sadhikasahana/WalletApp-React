import React, { createContext, useState, useEffect, ReactNode } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {

  user: string | null;

  login: (user: string) => Promise<void>;

  logout: () => Promise<void>;

};

export const AuthContext = createContext<AuthContextType>({

  user: null,

  login: async () => {},

  logout: async () => {},

});

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {

    // Load user from storage on app start

    AsyncStorage.getItem('user').then((storedUser: React.SetStateAction<string | null>) => {

      if (storedUser) setUser(storedUser);

    });

  }, []);

  const login = async (user: string) => {

    setUser(user);

    await AsyncStorage.setItem('user', user);

  };

  const logout = async () => {

    setUser(null);

    await AsyncStorage.removeItem('user');

  };

  return (

    <AuthContext.Provider value={{ user, login, logout }}>

      {children}

    </AuthContext.Provider>

  );

};