import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

// Defina o tipo das rotas, onde 'Home' é o nome da rota para a qual você deseja navegar
type RootStackParamList = {
  Home: undefined; // Adicione mais rotas se necessário
  Settings: undefined;
};

const SettingsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Settings'>>();
  const [cacheCleared, setCacheCleared] = useState(false);

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log("AsyncStorage limpo com sucesso!");
      Alert.alert("Sucesso", "Cache limpo com sucesso!");

      // Atualiza o estado para indicar que o cache foi limpo
      setCacheCleared(true);

      // Navega para a tela 'Home' após limpar o cache
      navigation.navigate('Home');
    } catch (error) {
      console.error("Erro ao limpar o AsyncStorage:", error);
      Alert.alert("Erro", "Não foi possível limpar o cache.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Configurações</Text>
      <Button title="Limpar Cache" onPress={clearAsyncStorage} />
    </View>
  );
};

export default SettingsScreen;
