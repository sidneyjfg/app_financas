import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
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
  const [selectedScreen, setSelectedScreen] = useState<string | null>(null);

  const screenKeys = {
    Home: 'homeData',
    Transactions: 'monthlyTransactions',
    Categories: 'categories',
  };

  const clearSelectedScreen = async () => {
    if (!selectedScreen) {
      Alert.alert('Erro', 'Por favor, selecione uma tela para limpar.');
      return;
    }

    try {
      await AsyncStorage.removeItem(screenKeys[selectedScreen as keyof typeof screenKeys]);
      Alert.alert('Sucesso', `Os dados da tela "${selectedScreen}" foram limpos com sucesso!`);
    } catch (error) {
      console.error('Erro ao limpar os dados:', error);
      Alert.alert('Erro', `Não foi possível limpar os dados da tela "${selectedScreen}".`);
    }
  };

  const clearAllData = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('Sucesso', 'Todos os dados foram limpos com sucesso!');
    } catch (error) {
      console.error('Erro ao limpar todos os dados:', error);
      Alert.alert('Erro', 'Não foi possível limpar todos os dados.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Configurações</Text>

      <Text style={{ marginBottom: 10 }}>Selecione a tela para limpar os dados:</Text>
      <Picker
        selectedValue={selectedScreen}
        onValueChange={(itemValue: string | null) => setSelectedScreen(itemValue)} // Declaração explícita do tipo
        style={{ width: 200, marginBottom: 20 }}
      >
        <Picker.Item label="Selecione uma tela" value={null} />
        <Picker.Item label="Home" value="Home" />
        <Picker.Item label="Transações" value="Transactions" />
        <Picker.Item label="Categorias" value="Categories" />
      </Picker>

      <Button title="Limpar Tela Selecionada" onPress={clearSelectedScreen} />

      <View style={{ marginVertical: 20 }}>
        <Button title="Limpar Todos os Dados" onPress={clearAllData} />
      </View>

      <Button title="Voltar para Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

export default SettingsScreen;
