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
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  listContainer: {
    paddingTop: 20,
  },
  categoryItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  keyword: {
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
  },
  addKeywordText: {
    color: '#007bff',
    marginTop: 10,
  },
  keywordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  categoryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    marginRight: 10,
  },
  deleteButtonText: {
    color: '#ff5252',
    fontWeight: 'bold',
  },
  
});

export default styles;
