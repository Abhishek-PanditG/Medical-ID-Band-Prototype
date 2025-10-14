import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform, // For platform-specific shadows
} from 'react-native';
import axios from 'axios';
import { BACKEND_URL } from '@env';


const Colors = {
  background: '#1F2937', 
  surface: '#FFFFFF', 
  accent: '#3B82F6', 
  text: '#FFFFFF', 
  textDark: '#1F2937', 
  placeholder: '#9CA3AF', 
  border: '#374151', 
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '800', 
    color: Colors.accent,
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.placeholder,
    marginBottom: 40,
    textAlign: 'center',
    fontWeight: '500',
  },
  input: {
    backgroundColor: Colors.border, 
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 14, 
    marginBottom: 20,
    fontSize: 16,
    color: Colors.text, 
    borderWidth: 1,
    borderColor: Colors.border,
  },
  button: {
    backgroundColor: Colors.accent,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    
    ...Platform.select({
        ios: {
            shadowColor: Colors.accent,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.5,
            shadowRadius: 10,
        },
        android: {
            elevation: 10,
        },
    }),
  },
  buttonDisabled: {
    backgroundColor: Colors.placeholder,
    opacity: 0.7,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: Colors.surface,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  qrContainer: {
    marginTop: 50,
    alignItems: 'center',
    padding: 25,
    backgroundColor: Colors.surface, 
    borderRadius: 12,
    
    ...Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.1,
            shadowRadius: 20,
        },
        android: {
            elevation: 8,
        },
    }),
  },
  qrText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    color: Colors.textDark, 
  },
  qrImage: {
    width: 220,
    height: 220,
    backgroundColor: Colors.surface,
  },
});

export default function App() {
  const [form, setForm] = useState({
    name: '',
    bloodGroup: '',
    allergies: '',
    emergencyContact: ''
  });
  const [qrUrl, setQrUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const { name, bloodGroup, emergencyContact } = form;

    if (!name || !bloodGroup || !emergencyContact) {
      Alert.alert('Validation Error', 'Please fill all required fields.');
      return;
    }

    try {
      setLoading(true);
      
      const res = await axios.post(`${BACKEND_URL}/register`, form, {
        headers: { 'Content-Type': 'application/json' },
      });


      setQrUrl(res.data.qrCodeUrl);
      Alert.alert('Success', 'QR Code generated successfully!');
    } catch (err) {
      console.error('Axios error:', err.response ? err.response.data : err.message);
      Alert.alert('Error', 'Failed to submit form. Check logs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>
          Medical ID Generator
        </Text>
        <Text style={styles.subtitle}>
            Securely register your vital emergency information.
        </Text>

        <TextInput
          placeholder="Full Name (Required)"
          placeholderTextColor={Colors.placeholder}
          style={styles.input}
          value={form.name}
          onChangeText={(v) => setForm({ ...form, name: v })}
        />
        <TextInput
          placeholder="Blood Group (Required)"
          placeholderTextColor={Colors.placeholder}
          style={styles.input}
          value={form.bloodGroup}
          onChangeText={(v) => setForm({ ...form, bloodGroup: v })}
          autoCapitalize="characters"
        />
        <TextInput
          placeholder="Allergies (Optional)"
          placeholderTextColor={Colors.placeholder}
          style={styles.input}
          value={form.allergies}
          onChangeText={(v) => setForm({ ...form, allergies: v })}
        />
        <TextInput
          placeholder="Emergency Contact (Required)"
          placeholderTextColor={Colors.placeholder}
          style={styles.input}
          value={form.emergencyContact}
          keyboardType="phone-pad"
          onChangeText={(v) => setForm({ ...form, emergencyContact: v })}
        />

        {/* Custom Button with Loading State */}
        <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleSubmit} 
            disabled={loading}
            activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator color={Colors.surface} />
          ) : (
            <Text style={styles.buttonText}>Generate QR Code</Text>
          )}
        </TouchableOpacity>

        {/* QR Code Display Card */}
        {qrUrl && (
          <View style={styles.qrContainer}>
            <Text style={styles.qrText}>
              Your Emergency QR Code
            </Text>
            <Image
              source={{ uri: qrUrl }}
              style={styles.qrImage}
              resizeMode="contain"
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}