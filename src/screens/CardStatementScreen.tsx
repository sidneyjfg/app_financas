import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TouchableOpacity, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../styles/CardStatementScreenStyles';

type CardTransaction = {
  date: string;
  description: string;
  amount: number;
  category: string;
  identifier: string;
};

type MonthlyTransactions = {
  [yearMonth: string]: CardTransaction[];
};

type Category = {
  name: string;
  keywords: string[];
};

const CardStatementScreen = () => {
  const [transactions, setTransactions] = useState<CardTransaction[]>([]);
  const [monthlyTransactions, setMonthlyTransactions] = useState<MonthlyTransactions>({});
  const [totalSpent, setTotalSpent] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  useEffect(() => {
    loadMonthlyTransactions();
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      loadSelectedMonthTransactions(selectedMonth);
    }
  }, [selectedMonth]);

  const loadMonthlyTransactions = async () => {
    const storedData = await AsyncStorage.getItem('monthlyCardTransactions');
    const parsedData = storedData ? JSON.parse(storedData) : {};
    setMonthlyTransactions(parsedData);

    if (selectedMonth && parsedData[selectedMonth]) {
      loadSelectedMonthTransactions(selectedMonth);
    }
  };

  const loadSelectedMonthTransactions = async (month: string) => {
    const transactions = monthlyTransactions[month] || [];
    setTransactions(transactions);
    calculateTotal(transactions);
  };

  const saveMonthlyTransactions = async (transactions: MonthlyTransactions) => {
    await AsyncStorage.setItem('monthlyCardTransactions', JSON.stringify(transactions));
    setMonthlyTransactions(transactions);
  };

  const categorizeTransaction = (description: string, categories: Category[]) => {
    const lowerDescription = description.toLowerCase();

    for (const category of categories) {
      if (category.keywords.some((word) => new RegExp(`\\b${word.toLowerCase()}\\b`).test(lowerDescription))) {
        return category.name;
      }
    }

    return 'Outros';
  };

  const handleSelectCSV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'text/csv' });
      if (result.canceled || !result.assets?.[0]?.uri) return;
  
      const fileUri = result.assets[0].uri;
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
  
      const storedIdentifiers = await AsyncStorage.getItem('processedIdentifiers');
      const processedIdentifiers = storedIdentifiers ? JSON.parse(storedIdentifiers) : [];
  
      const storedCategories = await AsyncStorage.getItem('categories');
      const categories: Category[] = storedCategories ? JSON.parse(storedCategories) : [];
  
      Papa.parse(fileContent, {
        header: true,
        complete: async (results) => {
          const data = results.data.map((item: any, index: number) => {
            const date = item.date || '';
            const title = item.title || '';
            const amount = parseFloat(item.amount || '0');
            const category = categorizeTransaction(title, categories);
  
            return {
              date,
              description: title,
              amount,
              category,
              identifier: `${date}-${title}-${amount}-${index}`,
            };
          });
  
          const validTransactions = data.filter((transaction) => transaction.date !== '');
  
          if (validTransactions.length > 0) {
            const firstIdentifier = validTransactions[0].identifier;
  
            if (firstIdentifier && processedIdentifiers.includes(firstIdentifier)) {
              Alert.alert("Aviso", "Este arquivo já foi importado anteriormente.");
              return;
            }
  
            const firstTransactionDate = new Date(validTransactions[0].date);
            const yearMonth = `${firstTransactionDate.getFullYear()}-${String(
              firstTransactionDate.getUTCMonth() + 1
            ).padStart(2, '0')}`;
  
            await saveTransactionsByMonth(yearMonth, validTransactions);
  
            if (firstIdentifier) {
              processedIdentifiers.push(firstIdentifier);
              await AsyncStorage.setItem('processedIdentifiers', JSON.stringify(processedIdentifiers));
            }
  
            // Atualiza o estado para carregar os dados do novo mês imediatamente
            await loadMonthlyTransactions(); // Recarrega todas as transações
            setSelectedMonth(yearMonth); // Define o novo mês selecionado
          } else {
            Alert.alert("Erro", "Nenhuma transação válida encontrada no arquivo CSV.");
          }
        },
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível processar o arquivo.");
    }
  };
  

  const saveTransactionsByMonth = async (yearMonth: string, newTransactions: CardTransaction[]) => {
    const storedData = await AsyncStorage.getItem('monthlyCardTransactions');
    const monthlyTransactions: MonthlyTransactions = storedData ? JSON.parse(storedData) : {};
  
    monthlyTransactions[yearMonth] = [...(monthlyTransactions[yearMonth] || []), ...newTransactions];
  
    await AsyncStorage.setItem('monthlyCardTransactions', JSON.stringify(monthlyTransactions));
  
    // Atualiza o estado imediatamente
    setMonthlyTransactions(monthlyTransactions);
  };
  

  const calculateTotal = (transactions: CardTransaction[]) => {
    const total = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    setTotalSpent(total);
  };

  const deleteSelectedMonth = async () => {
    if (selectedMonth) {
      const updatedTransactions = { ...monthlyTransactions };
      delete updatedTransactions[selectedMonth];

      saveMonthlyTransactions(updatedTransactions);
      setSelectedMonth(null);
      setTransactions([]);
      setTotalSpent(0);

      Alert.alert('Sucesso', 'As transações do mês foram removidas.');
    } else {
      Alert.alert('Erro', 'Nenhum mês selecionado para exclusão.');
    }
  };

  const renderTransaction = ({ item }: { item: CardTransaction }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionDate}>{item.date}</Text>
      <Text style={styles.transactionDescription}>{item.description}</Text>
      <Text style={styles.transactionAmount}>R$ {item.amount.toFixed(2)}</Text>
      <Text style={styles.transactionCategory}>Categoria: {item.category}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Extrato do Cartão de Crédito</Text>

      <Picker
        selectedValue={selectedMonth}
        onValueChange={(itemValue: string | null) => setSelectedMonth(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione o mês" value={null} />
        {Object.keys(monthlyTransactions).map((yearMonth) => (
          <Picker.Item key={yearMonth} label={yearMonth} value={yearMonth} />
        ))}
      </Picker>
      <Text style={styles.totalSpent}>Total Gasto: R$ {totalSpent.toFixed(2)}</Text>

      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.identifier}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity style={styles.deleteButton} onPress={deleteSelectedMonth}>
        <Text style={styles.deleteButtonText}>Excluir Extrato do Mês</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.floatingButton} onPress={handleSelectCSV}>
        <MaterialIcons name="file-upload" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default CardStatementScreen;
