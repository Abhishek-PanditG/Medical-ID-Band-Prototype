import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, ScrollView, Alert } from 'react-native';
import axios from 'axios';

const BACKEND_URL = 'https://my_backend.onrender.com'; // replace with your Render URL

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
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20, textAlign: 'center' }}>
        Register Medical Info
      </Text>

      <TextInput
        placeholder="Full Name"
        style={{ borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 }}
        value={form.name}
        onChangeText={(v) => setForm({ ...form, name: v })}
      />
      <TextInput
        placeholder="Blood Group"
        style={{ borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 }}
        value={form.bloodGroup}
        onChangeText={(v) => setForm({ ...form, bloodGroup: v })}
      />
      <TextInput
        placeholder="Allergies"
        style={{ borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 }}
        value={form.allergies}
        onChangeText={(v) => setForm({ ...form, allergies: v })}
      />
      <TextInput
        placeholder="Emergency Contact"
        style={{ borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 }}
        value={form.emergencyContact}
        keyboardType="phone-pad"
        onChangeText={(v) => setForm({ ...form, emergencyContact: v })}
      />

      <Button title={loading ? 'Submitting...' : 'Generate QR'} onPress={handleSubmit} disabled={loading} />

      {qrUrl && (
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>QR Code Generated:</Text>
          <Image
            source={{ uri: qrUrl }}
            style={{ width: 200, height: 200 }}
            resizeMode="contain"
          />
        </View>
      )}
    </ScrollView>
  );
}
