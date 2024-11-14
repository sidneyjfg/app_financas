import React from 'react';
import { View, Text, ScrollView, Button } from 'react-native';
import { Card } from 'react-native-paper';
import Animated, { FadeIn, FadeOut, SlideInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import styles from '../styles/HomeScreenStyles';

// Definindo os tipos de parâmetros para a navegação
type RootStackParamList = {
  Home: undefined;
  Report: undefined;
};

// Definindo o tipo de navegação para HomeScreen
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <LinearGradient colors={['#E3F2FD', '#BBDEFB']} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Cabeçalho com Gradiente */}
        <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.header}>
          <Text style={styles.welcomeText}>Bem-vindo de volta!</Text>
          <Text style={styles.subtitle}>Veja o resumo das suas finanças hoje</Text>
        </LinearGradient>

        {/* Cartão de Saldo */}
        <Animated.View style={styles.balanceCard} entering={SlideInUp} exiting={FadeOut}>
          <Text style={styles.balanceTitle}>Saldo Total</Text>
          <Text style={styles.balanceValue}>R$ 3.245,50</Text>
        </Animated.View>

        {/* Seção de Ações */}
        <View style={styles.actionsContainer}>
          <Animated.View entering={FadeIn}>
            <Card style={styles.actionCard} elevation={3}>
              <MaterialIcons name="add-circle-outline" size={48} color="#4CAF50" style={styles.icon} />
              <Text style={styles.actionText}>Adicionar Receita</Text>
            </Card>
          </Animated.View>
          <Animated.View entering={FadeIn}>
            <Card style={styles.actionCard} elevation={3}>
              <MaterialIcons name="remove-circle-outline" size={48} color="#f44336" style={styles.icon} />
              <Text style={styles.actionText}>Adicionar Despesa</Text>
            </Card>
          </Animated.View>
        </View>

        {/* Botão de Navegação para Relatório */}
        <View style={{ marginVertical: 20 }}>
          <Button
            title="Ver Relatório"
            onPress={() => navigation.navigate('Report')}
          />
        </View>

        {/* Gráficos e Relatórios Rápidos */}
        <Animated.View entering={FadeIn.delay(300)} style={styles.reportCard}>
          <Text style={styles.reportTitle}>Resumo Semanal</Text>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
};

export default HomeScreen;
