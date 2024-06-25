import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert, useColorScheme } from 'react-native';
import { login } from '@apis';
import { useSession } from '@app';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [username, setEmail] = useState('isabellad');
  const [password, setPassword] = useState('isabelladpass');
  const [error, setError] = useState('');

  const { signIn, session } = useSession();

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };
  const handleLogin = async () => 
  {
    if (!username)
    {
      setError('Please enter a valid username.');
      return;
    }
    else if (password.length < 6)
    {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError('');
    try
    {
      const { token, refreshToken } = await login(username, password);
      signIn(token, refreshToken);
      // Alert.alert('Login Successful', `Welcome, ${username}!`);
    } catch (error: any) {
      Alert.alert(error.response?.data?.error || 'Login failed');
      console.error(error.response?.data?.error || 'Login failed');
    }


  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkTitle]}>Login</Text>
      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput]}
        placeholder="Email"
        placeholderTextColor={isDarkMode ? "#888" : "#aaa"}
        value={username}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput]}
        placeholder="Password"
        placeholderTextColor={isDarkMode ? "#888" : "#aaa"}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Login" onPress={handleLogin} color={isDarkMode ? "#555" : "#007AFF"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#f0f0f0',
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#333',
  },
  darkTitle: {
    color: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    color: '#333',
  },
  darkInput: {
    borderColor: '#555',
    backgroundColor: '#444',
    color: '#fff',
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
});

