import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, ScrollView } from 'react-native';
import axios from 'axios';

export default function App() {
  const [form, setForm] = useState({
    name: '',
    bloodGroup: '',
    allergies: '',
    emergencyContact: ''
  });
  const [qrUrl, setQrUrl] = useState(null);

  const handleSubmit = async () => {
    try {
      const res = await axios.post('https://medical-id-band-prototype.onrender.com/register', form);
      setQrUrl(res.data.qrCodeUrl);
    } catch (err) {
      console.error(err);
      alert('Error submitting data');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>Register Medical Info</Text>

      <TextInput
        placeholder="Full Name"
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
        onChangeText={(v) => setForm({ ...form, name: v })}
      />
      <TextInput
        placeholder="Blood Group"
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
        onChangeText={(v) => setForm({ ...form, bloodGroup: v })}
      />
      <TextInput
        placeholder="Allergies"
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
        onChangeText={(v) => setForm({ ...form, allergies: v })}
      />
      <TextInput
        placeholder="Emergency Contact"
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
        onChangeText={(v) => setForm({ ...form, emergencyContact: v })}
      />

      <Button title="Generate QR" onPress={handleSubmit} />

      {qrUrl && (
        <View style={{ marginTop: 20 }}>
          <Text>QR Code Generated:</Text>
          <Image source={{ uri: qrUrl }} style={{ width: 200, height: 200, marginTop: 10 }} />
        </View>
      )}
    </ScrollView>
  );
}
