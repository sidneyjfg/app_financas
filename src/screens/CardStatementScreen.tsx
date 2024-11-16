import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../styles/CardStatementScreenStyles';

type Transaction = {
  date: string;
  title: string;
  amount: number;
  category: string;
};

type MonthlyTransactions = {
  [yearMonth: string]: Transaction[];
};

type Category = {
  name: string;
  keywords: string[];
};

const CardStatementScreen = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyTransactions, setMonthlyTransactions] = useState<MonthlyTransactions>({});
  const [totalSpent, setTotalSpent] = useState(0);
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>({});
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const excludeKeywords = ['pagamento recebido', 'fatura', 'cartão']; // Palavras-chave para excluir

  useEffect(() => {
    loadMonthlyTransactions();
  }, []);

  useEffect(() => {
    // Exibe transações e calcula totais apenas quando um mês válido é selecionado
    if (selectedMonth) {
      const transactionsForSelectedMonth = monthlyTransactions[selectedMonth] || [];
      const filteredTransactions = filterTransactions(transactionsForSelectedMonth); // Aplica o filtro ao carregar
      setTransactions(filteredTransactions);
      calculateTotals(filteredTransactions);
    } else {
      // Limpa as transações e totais quando "Selecione o mês" é escolhido
      setTransactions([]);
      setTotalSpent(0);
      setCategoryTotals({});
    }
  }, [selectedMonth, monthlyTransactions]);

  const filterTransactions = (transactions: Transaction[]) => {
    if (!transactions || transactions.length === 0) return [];

    return transactions.filter((transaction) => {
      const lowerTitle = transaction.title ? transaction.title.toLowerCase() : '';
      return !excludeKeywords.some((keyword) => lowerTitle.includes(keyword));
    });
  };

  const categorizeTransaction = (title: string, categories: Category[]) => {
    const lowerTitle = title.toLowerCase();
    for (const category of categories) {
      if (category.keywords.some((word) => new RegExp(`\\b${word.toLowerCase()}\\b`).test(lowerTitle))) {
        return category.name;
      }
    }
    return 'Outros';
  };

  const recategorizeTransactions = async () => {
    const storedCategories = await AsyncStorage.getItem('categories');
    const categories: Category[] = storedCategories ? JSON.parse(storedCategories) : [];

    if (selectedMonth && transactions.length > 0) {
      const recategorizedTransactions = transactions.map((transaction) => ({
        ...transaction,
        category: categorizeTransaction(transaction.title, categories),
      }));

      setTransactions(recategorizedTransactions);
      calculateTotals(recategorizedTransactions);

      const updatedMonthlyTransactions = { ...monthlyTransactions, [selectedMonth]: recategorizedTransactions };
      setMonthlyTransactions(updatedMonthlyTransactions);
      await AsyncStorage.setItem('monthlyTransactions', JSON.stringify(updatedMonthlyTransactions));

      Alert.alert('Sucesso', 'Categorias atualizadas com sucesso.');
    } else {
      Alert.alert('Erro', 'Nenhuma transação encontrada para atualizar.');
    }
  };

  const loadMonthlyTransactions = async () => {
    const storedData = await AsyncStorage.getItem('monthlyTransactions');
    const transactionsData: MonthlyTransactions = storedData ? JSON.parse(storedData) : {};
    setMonthlyTransactions(transactionsData);
  };

  const handleDeleteMonth = async () => {
    if (selectedMonth) {
      const storedData = await AsyncStorage.getItem('monthlyTransactions');
      const monthlyTransactions: MonthlyTransactions = storedData ? JSON.parse(storedData) : {};
      delete monthlyTransactions[selectedMonth];
      await AsyncStorage.setItem('monthlyTransactions', JSON.stringify(monthlyTransactions));
      setMonthlyTransactions(monthlyTransactions);
      setTransactions([]);
      setSelectedMonth(null);
      setTotalSpent(0);
      setCategoryTotals({});
      Alert.alert('Sucesso', 'As transações do mês foram removidas.');
    } else {
      Alert.alert('Erro', 'Nenhum mês selecionado para exclusão.');
    }
  };

  const handleSelectCSV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'text/csv' });
      if (result.canceled || !result.assets?.[0]?.uri) return;

      const fileUri = result.assets[0].uri;
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const storedCategories = await AsyncStorage.getItem('categories');
      const categories: Category[] = storedCategories ? JSON.parse(storedCategories) : [];

      Papa.parse(fileContent, {
        header: true,
        complete: async (results) => {
          const data: Transaction[] = results.data.map((item: any) => {
            const amount = parseFloat(item.amount || '0');
            const category = categorizeTransaction(item.title || '', categories);
            const dateString = item.date || '';
            const parsedDate = new Date(dateString);
            const isValidDate = !isNaN(parsedDate.getTime());

            return {
              date: isValidDate ? parsedDate.toISOString().split('T')[0] : '',
              title: item.title || '',
              amount: -Math.abs(amount),
              category,
            };
          });

          const validTransactions = data.filter((transaction) => transaction.date !== '');

          if (validTransactions.length > 0) {
            const firstTransactionDate = new Date(validTransactions[0].date);
            const yearMonth = `${firstTransactionDate.getFullYear()}-${String(
              firstTransactionDate.getMonth() + 1
            ).padStart(2, '0')}`;

            const storedData = await AsyncStorage.getItem('monthlyTransactions');
            const monthlyTransactions: MonthlyTransactions = storedData ? JSON.parse(storedData) : {};

            if (monthlyTransactions[yearMonth]) {
              Alert.alert(
                'Mês já carregado',
                `O mês ${yearMonth} já possui transações carregadas. Deseja sobrescrever os dados existentes?`,
                [
                  {
                    text: 'Cancelar',
                    style: 'cancel',
                  },
                  {
                    text: 'Sobrescrever',
                    onPress: async () => {
                      await saveTransactionsByMonth(yearMonth, validTransactions, true);
                      Alert.alert('Sucesso', 'As transações foram sobrescritas com sucesso.');
                      setSelectedMonth(null); // Limpa a seleção do mês após o carregamento
                    },
                  },
                ]
              );
            } else {
              await saveTransactionsByMonth(yearMonth, validTransactions, false);
              setSelectedMonth(null); // Limpa a seleção do mês após o carregamento
            }
          } else {
            Alert.alert('Erro', 'Nenhuma transação válida encontrada no arquivo CSV.');
          }
        },
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível processar o arquivo.');
    }
  };

  const saveTransactionsByMonth = async (
    yearMonth: string,
    newTransactions: Transaction[],
    overwrite: boolean = false
  ) => {
    const storedData = await AsyncStorage.getItem('monthlyTransactions');
    const monthlyTransactions: MonthlyTransactions = storedData ? JSON.parse(storedData) : {};

    monthlyTransactions[yearMonth] = overwrite ? newTransactions : [...(monthlyTransactions[yearMonth] || []), ...newTransactions];

    await AsyncStorage.setItem('monthlyTransactions', JSON.stringify(monthlyTransactions));
    setMonthlyTransactions(monthlyTransactions);
  };

  const calculateTotals = (transactions: Transaction[]) => {
    const totalsByCategory: Record<string, number> = {};
    let totalSpent = 0;

    transactions.forEach((transaction) => {
      if (transaction.amount < 0) {
        totalSpent += transaction.amount;

        if (!totalsByCategory[transaction.category]) {
          totalsByCategory[transaction.category] = 0;
        }
        totalsByCategory[transaction.category] += transaction.amount;
      }
    });

    setTotalSpent(totalSpent);
    setCategoryTotals(totalsByCategory);
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionDate}>{item.date}</Text>
      <Text style={styles.transactionTitle}>{item.title}</Text>
      <Text style={styles.transactionAmount}>R$ {item.amount.toFixed(2)}</Text>
      <Text style={styles.transactionCategory}>Categoria: {item.category}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Extrato Cartão de Crédito</Text>

      <Picker
        selectedValue={selectedMonth}
        onValueChange={(itemValue) => setSelectedMonth(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione o mês" value={null} />
        {Object.keys(monthlyTransactions)
          .sort((a, b) => new Date(a).getTime() - new Date(b).getTime()) // Ordena os meses em ordem cronológica
          .map((yearMonth) => (
            <Picker.Item key={yearMonth} label={yearMonth} value={yearMonth} />
          ))}
      </Picker>


      <Text style={styles.totalExpense}>Total Gasto: R$ {totalSpent.toFixed(2)}</Text>

      <View style={styles.categoryContainer}>
        {Object.entries(categoryTotals).map(([category, total]) => (
          <View key={category} style={styles.categoryRow}>
            <Text style={styles.categoryText}>{category}</Text>
            <Text style={styles.categoryAmount}>R$ {total.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {isExpanded && (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteMonth}>
        <Text style={styles.deleteButtonText}>Excluir Extrato do Mês</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.updateButton} onPress={recategorizeTransactions}>
        <Text style={styles.updateButtonText}>Atualizar Categorias</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.floatingButton} onPress={handleSelectCSV}>
        <MaterialIcons name="file-upload" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default CardStatementScreen;
