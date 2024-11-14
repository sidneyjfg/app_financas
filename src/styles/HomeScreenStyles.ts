import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    padding: 20,
    flexGrow: 1,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ddd',
    textAlign: 'center',
  },
  balanceCard: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  balanceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  actionCard: {
    flex: 1,                      // Ocupa igualmente o espaço disponível
    maxWidth: '98%',                 // Define uma largura máxima para não esticar demais
    backgroundColor: '#fff',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',      // Centraliza o conteúdo verticalmente
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 4,
    marginHorizontal: 5,           // Espaçamento entre os cartões
  },
  icon: {
    marginBottom: 8,
    textAlign:'center'
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  reportCard: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
});

export default styles;
