import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa', // cor de fundo clara e suave
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  totalSpent: {
    fontSize: 20,
    fontWeight: '500',
    color: '#FF6B6B', // cor de destaque para total gasto
    textAlign: 'center',
    marginBottom: 15,
  },
  transactionItem: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  transactionDate: {
    fontSize: 14,
    color: '#888',
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginVertical: 5,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50', // verde para valores positivos
  },
  transactionCategory: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 5,
  },
  listContainer: {
    paddingBottom: 80,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#3b5998', // azul moderno
    borderRadius: 50,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addKeywordText: {
    color: '#3b5998',
    fontSize: 14,
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  picker: {
    marginVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
},
deleteButton: {
    backgroundColor: '#FF6B6B',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
},
deleteButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
},
});

export default styles;
