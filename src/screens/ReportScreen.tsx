import React, { useState, useEffect } from 'react';
import { parse } from 'date-fns';
import { View, Text, FlatList, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../styles/ReportScreen';

type Transaction = {
  date: string;
  description: string;
  amount: number;
  type: string;
  category: string;
  identifier: string;
};

type MonthlyTransactions = {
  [yearMonth: string]: Transaction[];
};

type Category = {
  name: string;
  keywords: string[];
};





const ReportScreen = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyTransactions, setMonthlyTransactions] = useState<MonthlyTransactions>({});
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>({});
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  
  const categorizeTransaction = (description: string, categories: Category[]) => {
    const lowerDescription = description.toLowerCase();
  
    for (const category of categories) {
      if (category.keywords.some((word) => new RegExp(`\\b${word.toLowerCase()}\\b`).test(lowerDescription))) {
        console.log(`Transação categorizada como: ${category.name} para descrição: ${description}`);
        return category.name;
      }
    }
  
    console.log(`Transação categorizada como: Outros para descrição: ${description}`);
    return 'Outros';
  };
  useEffect(() => {
    loadMonthlyTransactions();
  }, []);

  const loadMonthlyTransactions = async () => {
    const storedData = await AsyncStorage.getItem('monthlyTransactions');
    const transactionsData = storedData ? JSON.parse(storedData) : {};
    setMonthlyTransactions(transactionsData);
  };

  const handleDeleteMonth = async () => {
    if (selectedMonth) {
      const storedData = await AsyncStorage.getItem('monthlyTransactions');
      const monthlyTransactions: MonthlyTransactions = storedData ? JSON.parse(storedData) : {};

      // Remove o mês selecionado dos dados de transações
      const monthTransactions = monthlyTransactions[selectedMonth] || [];
      delete monthlyTransactions[selectedMonth];
      await AsyncStorage.setItem('monthlyTransactions', JSON.stringify(monthlyTransactions));

      // Atualiza a lista de identificadores processados removendo os do mês excluído
      const storedIdentifiers = await AsyncStorage.getItem('processedIdentifiers');
      const processedIdentifiers = storedIdentifiers ? JSON.parse(storedIdentifiers) : [];

      // Filtra os identificadores removendo aqueles que pertencem às transações do mês excluído
      const updatedIdentifiers = processedIdentifiers.filter(
        (id: string) => !monthTransactions.some(transaction => transaction.identifier === id)
      );

      // Salva a lista atualizada de identificadores no AsyncStorage
      await AsyncStorage.setItem('processedIdentifiers', JSON.stringify(updatedIdentifiers));

      // Atualiza o estado para refletir a remoção
      loadMonthlyTransactions();
      setSelectedMonth(null);
      setTransactions([]);
      setTotalIncome(0);
      setTotalExpense(0);
      setCategoryTotals({});
    } else {
      Alert.alert("Erro", "Nenhum mês selecionado para exclusão.");
    }
  };
  
  const handleSelectCSV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'text/csv' });
      if (result.canceled || !result.assets?.[0]?.uri) return;
  
      const fileUri = result.assets[0].uri;
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
  
      const storedIdentifiers = await AsyncStorage.getItem('processedIdentifiers');
      const processedIdentifiers = storedIdentifiers ? JSON.parse(storedIdentifiers) : [];
  
      // Recupera as categorias armazenadas para categorização
      const storedCategories = await AsyncStorage.getItem('categories');
      const categories: Category[] = storedCategories ? JSON.parse(storedCategories) : [];
  
      console.log("Categorias carregadas:", categories); // Log para verificar as categorias carregadas
  
      Papa.parse(fileContent, {
        header: true,
        complete: async (results) => {
          const data: Transaction[] = await Promise.all(
            results.data.map(async (item: any) => {
              const amount = parseFloat(item.Valor || '0');
              const type = amount >= 0 ? 'Entrada' : 'Saída';
  
              // Chama categorizeTransaction com a descrição e as categorias para cada transação
              const category = categorizeTransaction(item.Descrição || '', categories);
  
              console.log(`Categoria atribuída: ${category} para descrição: ${item.Descrição}`); // Log para verificar a categoria atribuída
  
              const dateString = item.Data || '';
              const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
              const isValidDate = !isNaN(parsedDate.getTime());
  
              return {
                date: isValidDate ? parsedDate.toISOString().split('T')[0] : '',
                description: item.Descrição || '',
                amount: Math.abs(amount),
                type,
                category,  // Atribui a categoria retornada
                identifier: item.Identificador || '',
              };
            })
          );
  
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
  
            loadMonthlyTransactions();
          } else {
            Alert.alert("Erro", "Nenhuma transação válida encontrada no arquivo CSV.");
          }
        },
        error: (error: Error) => {
          Alert.alert("Erro", "Não foi possível processar o arquivo CSV.");
          console.error('Erro ao processar CSV:', error);
        },
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível selecionar o arquivo.");
      console.error('Erro ao selecionar o arquivo:', error);
    }
  };
  
  


  const saveTransactionsByMonth = async (yearMonth: string, newTransactions: Transaction[]) => {
    const storedData = await AsyncStorage.getItem('monthlyTransactions');
    const monthlyTransactions: MonthlyTransactions = storedData ? JSON.parse(storedData) : {};

    monthlyTransactions[yearMonth] = [...(monthlyTransactions[yearMonth] || []), ...newTransactions];

    await AsyncStorage.setItem('monthlyTransactions', JSON.stringify(monthlyTransactions));
  };

  useEffect(() => {
    if (selectedMonth) {
      const transactions = monthlyTransactions[selectedMonth] || [];
      setTransactions(transactions);
      calculateTotals(transactions);
    }
  }, [selectedMonth, monthlyTransactions]);

  const calculateTotals = (transactions: Transaction[]) => {
    let income = 0;
    let expense = 0;
    const categoryTotalsTemp: Record<string, number> = {};
  
    transactions.forEach((transaction) => {
      if (transaction.type === 'Entrada') {
        income += transaction.amount;
      } else {
        expense += transaction.amount;
  
        if (!categoryTotalsTemp[transaction.category]) {
          categoryTotalsTemp[transaction.category] = 0;
        }
        categoryTotalsTemp[transaction.category] += transaction.amount;
        console.log(`Categoria: ${transaction.category}, Total atualizado: ${categoryTotalsTemp[transaction.category]}`); // Log para verificar o total por categoria
      }
    });
  
    setTotalIncome(income);
    setTotalExpense(expense);
    setCategoryTotals(categoryTotalsTemp);
  };
  

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionDate}>{item.date}</Text>
      <Text style={styles.transactionDescription}>{item.description}</Text>
      <Text
        style={[
          styles.transactionAmount,
          item.type === 'Saída' ? styles.transactionAmountNegative : styles.transactionAmountPositive,
        ]}
      >
        {item.type === 'Saída' ? `-R$ ${item.amount.toFixed(2)}` : `R$ ${item.amount.toFixed(2)}`}
      </Text>
      <Text style={styles.transactionCategory}>Categoria: {item.category}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Relatório de Gastos</Text>

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

      <Text style={styles.totalIncome}>Total de Entradas: R$ {totalIncome.toFixed(2)}</Text>
      <Text style={styles.totalExpense}>Total de Saídas: -R$ {totalExpense.toFixed(2)}</Text>

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

      <TouchableOpacity
        style={styles.showMoreButton}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.showMoreText}>{isExpanded ? "Recolher Extrato" : "Ver Extrato Completo"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteMonth}>
        <Text style={styles.deleteButtonText}>Excluir Extrato do Mês</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.floatingButton} onPress={handleSelectCSV}>
        <MaterialIcons name="file-upload" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default ReportScreen;
