import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  picker: {
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 10,
    padding: 10,
  },
  totalIncome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 10,
    textAlign: 'center',
  },
  totalExpense: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f44336',
    marginTop: 10,
    textAlign: 'center',
  },
  categoryContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  categoryText: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  listContainer: {
    paddingTop: 10,
  },
  transactionItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  transactionDate: {
    fontSize: 14,
    color: '#999',
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  transactionAmountPositive: {
    color: '#4CAF50',
  },
  transactionAmountNegative: {
    color: '#f44336',
  },
  transactionCategory: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    borderRadius: 30,
    padding: 15,
    elevation: 5,
  },
  deleteButton: {
    backgroundColor: '#ff5252',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  showMoreButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  showMoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
