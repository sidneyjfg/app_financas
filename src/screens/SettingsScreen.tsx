import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log("AsyncStorage limpo com sucesso!");
    Alert.alert("Sucesso", "Cache limpo com sucesso!");
  } catch (error) {
    console.error("Erro ao limpar o AsyncStorage:", error);
    Alert.alert("Erro", "Não foi possível limpar o cache.");
  }
};

const SettingsScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Configurações</Text>
      <Button title="Limpar Cache" onPress={clearAsyncStorage} />
    </View>
  );
};

export default SettingsScreen;
