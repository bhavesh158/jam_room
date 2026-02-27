import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSocket } from '../context/SocketContext';

const ConnectScreen = ({ navigation }) => {
  const [serverAddress, setServerAddress] = useState('');
  const [connecting, setConnecting] = useState(false);
  const { connect, connected } = useSocket();

  const handleConnect = async () => {
    if (!serverAddress.trim()) {
      Alert.alert('Error', 'Please enter a server address');
      return;
    }

    setConnecting(true);
    try {
      await connect(serverAddress.trim());
      navigation.replace('Poll');
    } catch (error) {
      Alert.alert('Connection Failed', 'Could not connect to server. Please check the address and try again.');
      setConnecting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>JamRoom</Text>
          <Text style={styles.subtitle}>Local Real-Time Voting</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Server Address</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 192.168.1.45:3000"
            placeholderTextColor="#9CA3AF"
            value={serverAddress}
            onChangeText={setServerAddress}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />

          <TouchableOpacity
            style={[styles.button, connecting && styles.buttonDisabled]}
            onPress={handleConnect}
            disabled={connecting}
          >
            {connecting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.buttonText}>Connect</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.hint}>
            Make sure your device is connected to the same Wi-Fi network as the server.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f5f8',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8c25f4',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'rgba(140, 37, 244, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#8c25f4',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#8c25f4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hint: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
});

export default ConnectScreen;
