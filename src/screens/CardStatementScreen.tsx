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

const CardStatementScreen = () => {
    const [transactions, setTransactions] = useState<CardTransaction[]>([]);
    const [monthlyTransactions, setMonthlyTransactions] = useState<{ [month: string]: CardTransaction[] }>({});
    const [totalSpent, setTotalSpent] = useState(0);
    const [categories, setCategories] = useState<{ name: string; keywords: string[] }[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

    useEffect(() => {
        loadCardTransactions();
        loadCategories();
    }, []);

    useEffect(() => {
        if (selectedMonth && monthlyTransactions[selectedMonth]) {
            recategorizeTransactions(monthlyTransactions[selectedMonth]);
        }
    }, [selectedMonth, categories]);

    const loadCardTransactions = async () => {
        const storedData = await AsyncStorage.getItem('monthlyCardTransactions');
        const parsedData = storedData ? JSON.parse(storedData) : {};
        setMonthlyTransactions(parsedData);

        if (selectedMonth && parsedData[selectedMonth]) {
            setTransactions(parsedData[selectedMonth]);
            calculateTotal(parsedData[selectedMonth]);
        }
    };

    const loadCategories = async () => {
        const storedCategories = await AsyncStorage.getItem('categories');
        const categories = storedCategories ? JSON.parse(storedCategories) : [];
        setCategories(categories);
    };

    const saveCardTransactions = async (newMonthlyTransactions: { [month: string]: CardTransaction[] }) => {
        await AsyncStorage.setItem('monthlyCardTransactions', JSON.stringify(newMonthlyTransactions));
        setMonthlyTransactions(newMonthlyTransactions);
    };

    const categorizeTransaction = (description: string) => {
        for (const category of categories) {
            if (category.keywords.some((word: string) => description.toLowerCase().includes(word.toLowerCase()))) {
                return category.name;
            }
        }
        return 'Outros';
    };

    const recategorizeTransactions = (transactionsToCategorize: CardTransaction[]) => {
        const updatedTransactions = transactionsToCategorize.map(transaction => ({
            ...transaction,
            category: categorizeTransaction(transaction.description),
        }));
        setTransactions(updatedTransactions);
        calculateTotal(updatedTransactions);

        if (selectedMonth) {
            const updatedMonthlyTransactions = { ...monthlyTransactions, [selectedMonth]: updatedTransactions };
            saveCardTransactions(updatedMonthlyTransactions);
        }
    };

    const handleSelectCSV = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: 'text/csv' });
            if (result.canceled || !result.assets?.[0]?.uri) return;

            const fileUri = result.assets[0].uri;
            const fileContent = await FileSystem.readAsStringAsync(fileUri);

            Papa.parse(fileContent, {
                header: true,
                complete: (results) => {
                    const data = results.data.map((item: any, index: number) => {
                        const amount = -Math.abs(parseFloat(item.amount || '0'));
                        const category = categorizeTransaction(item.title || '');
                        const date = item.date || '';
                        const description = item.title || '';
                        const month = date.slice(0, 7); // Obtém ano-mês, ex: "2024-11"

                        return {
                            date,
                            description,
                            amount,
                            category,
                            identifier: `${date}-${description}-${amount}-${index}`,
                        };
                    });

                    const monthlyData = data.reduce((acc: { [month: string]: CardTransaction[] }, transaction) => {
                        const month = transaction.date.slice(0, 7);
                        if (!acc[month]) acc[month] = [];
                        acc[month].push(transaction);
                        return acc;
                    }, {});

                    const updatedMonthlyTransactions = { ...monthlyTransactions, ...monthlyData };
                    saveCardTransactions(updatedMonthlyTransactions);

                    if (selectedMonth && updatedMonthlyTransactions[selectedMonth]) {
                        setTransactions(updatedMonthlyTransactions[selectedMonth]);
                        calculateTotal(updatedMonthlyTransactions[selectedMonth]);
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

    const calculateTotal = (transactions: CardTransaction[]) => {
        const total = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
        setTotalSpent(total);
    };

    const deleteSelectedMonth = async () => {
        if (selectedMonth) {
            const updatedMonthlyTransactions = { ...monthlyTransactions };
            delete updatedMonthlyTransactions[selectedMonth];
            await saveCardTransactions(updatedMonthlyTransactions);
            setSelectedMonth(null);
            setTransactions([]);
            setTotalSpent(0);
            Alert.alert("Sucesso", "As transações do mês foram removidas.");
        } else {
            Alert.alert("Erro", "Nenhum mês selecionado para exclusão.");
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
            <Text style={styles.totalSpent}>Total Gasto: R$ {totalSpent.toFixed(2)}</Text>

            {/* Picker para Selecionar o Mês */}
            <Picker
                selectedValue={selectedMonth}
                onValueChange={(month: string | null) => {
                    setSelectedMonth(month);
                    if (month && monthlyTransactions[month]) {
                        setTransactions(monthlyTransactions[month]);
                        calculateTotal(monthlyTransactions[month]);
                    }
                }}
                style={styles.picker}
            >
                <Picker.Item label="Selecione o mês" value={null} />
                {Object.keys(monthlyTransactions).map((month) => (
                    <Picker.Item key={month} label={month} value={month} />
                ))}
            </Picker>


            <FlatList
                data={transactions}
                renderItem={renderTransaction}
                keyExtractor={(item) => item.identifier}
                contentContainerStyle={styles.listContainer}
            />

            <TouchableOpacity style={styles.floatingButton} onPress={handleSelectCSV}>
                <MaterialIcons name="file-upload" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={deleteSelectedMonth}>
                <Text style={styles.deleteButtonText}>Excluir Extrato do Mês</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CardStatementScreen;
