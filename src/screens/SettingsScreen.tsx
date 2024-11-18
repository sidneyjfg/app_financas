import React, { useState, useContext } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../contexts/AppContext';

type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
};

const SettingsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Settings'>>();
  const { setDataReset } = useContext(AppContext);
  const [selectedScreen, setSelectedScreen] = useState<string>('none'); // Valor inicial ajustado

  const screenKeys = {
    Home: 'homeData',
    ReportTransactions: 'reportTransactions',
    Transactions: 'cardTransactions',
    Categories: 'categories',
  };

  const clearSelectedScreen = async () => {
    if (!selectedScreen || selectedScreen === 'none') {
      Alert.alert('Erro', 'Por favor, selecione uma tela para limpar.');
      return;
    }
  
    try {
      if (selectedScreen === 'ReportTransactions') {
        // Remova também os identificadores processados
        await AsyncStorage.removeItem('processedIdentifiers');
      }
  
      await AsyncStorage.removeItem(screenKeys[selectedScreen as keyof typeof screenKeys]);
      setDataReset(true); // Notifica que os dados foram redefinidos
      Alert.alert('Sucesso', `Os dados da tela "${selectedScreen}" foram limpos com sucesso!`);
    } catch (error) {
      console.error('Erro ao limpar os dados:', error);
      Alert.alert('Erro', `Não foi possível limpar os dados da tela "${selectedScreen}".`);
    }
  };
  
  

  const clearAllData = async () => {
    try {
      await AsyncStorage.clear();
      setDataReset(true); // Notifica que os dados foram redefinidos
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
        onValueChange={(itemValue) => setSelectedScreen(itemValue || 'none')} // Define um fallback para "none"
        style={{ width: 200, marginBottom: 20 }}
      >
        <Picker.Item label="Selecione uma tela" value="none" />
        <Picker.Item label="Home" value="Home" />
        <Picker.Item label="reportTransactions" value="ReportTransactions" />
        <Picker.Item label="cardTransactions" value="Transactions" />
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
