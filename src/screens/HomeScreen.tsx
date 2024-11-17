import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/HomeScreenStyles';

type CategoryStats = {
  category: string;
  total: number;
  percentage: number;
};
type Transaction = {
  date: string; // Data da transação
  title?: string; // Nome ou título da transação (opcional)
  amount: number; // Valor da transação (positivo ou negativo)
  category?: string; // Categoria associada (opcional)
};

const HomeScreen: React.FC = () => {
  const [categoryData, setCategoryData] = useState<CategoryStats[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    loadCategoryStats();
  }, []);

  const loadCategoryStats = async () => {
    try {
      // Carregar transações da tela CardStatementScreen
      const storedTransactions = await AsyncStorage.getItem('cardTransactions');
      const transactions: Record<string, Transaction[]> = storedTransactions
        ? JSON.parse(storedTransactions)
        : {};
  
      // Consolidar dados por categoria
      const totalsByCategory: Record<string, number> = {};
      let totalSpentLocal = 0;
  
      // Iterar pelas transações por mês
      Object.values(transactions).forEach((monthly: Transaction[]) => {
        monthly.forEach((transaction) => {
          if (transaction.amount < 0) {
            totalSpentLocal += transaction.amount; // Soma os gastos totais
            const category = transaction.category || 'Outros'; // Categoria padrão se não definida
            totalsByCategory[category] = (totalsByCategory[category] || 0) + Math.abs(transaction.amount);
          }
        });
      });
  
      // Converter os totais em um array de estatísticas
      const categoryStats = Object.entries(totalsByCategory).map(([category, total]) => ({
        category,
        total,
        percentage: parseFloat(((total / Math.abs(totalSpentLocal)) * 100).toFixed(2)), // Converte para número
      }));
  
      // Atualizar os estados
      setCategoryData(categoryStats); // Atualiza os dados por categoria
      setTotalSpent(totalSpentLocal); // Atualiza o gasto total
    } catch (error) {
      console.error('Erro ao carregar os dados:', error);
    }
  };
  
  

  return (
    <LinearGradient colors={['#E3F2FD', '#BBDEFB']} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Cabeçalho */}
        <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.header}>
          <Text style={styles.welcomeText}>Resumo de Gastos</Text>
          <Text style={styles.subtitle}>Veja para onde seu dinheiro está indo</Text>
        </LinearGradient>

        {/* Resumo Geral */}
        <Animated.View style={styles.balanceCard} entering={SlideInUp}>
          <Text style={styles.balanceTitle}>Gasto Total</Text>
          <Text style={styles.balanceValue}>R$ {Math.abs(totalSpent).toFixed(2)}</Text>
        </Animated.View>

        {/* Categorias Mais Gastas */}
        <View style={styles.categoryContainer}>
          <Text style={styles.sectionTitle}>Categorias Mais Gastas</Text>
          {categoryData.map((item, index) => (
            <Card key={index} style={styles.categoryCard} elevation={3}>
              <View style={styles.categoryRow}>
                <MaterialIcons name="label" size={32} color="#4CAF50" />
                <View style={styles.categoryDetails}>
                  <Text style={styles.categoryName}>{item.category}</Text>
                  <Text style={styles.categoryTotal}>R$ {item.total.toFixed(2)}</Text>
                  <Text style={styles.categoryPercentage}>{item.percentage}% dos gastos</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default HomeScreen;
