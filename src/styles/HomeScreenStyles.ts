import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  header: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#D1D9E6',
    textAlign: 'center',
    marginTop: 5,
  },
  balanceCard: {
    width: '100%',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  balanceTitle: {
    fontSize: 18,
    color: '#333',
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 10,
  },
  categoryContainer: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  categoryCard: {
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDetails: {
    marginLeft: 15,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryTotal: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  categoryPercentage: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  tipsCard: {
    width: '100%',
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 10,
  },
  tipsText: {
    fontSize: 14,
    color: '#6D4C41',
    lineHeight: 20,
  },
});

export default styles;
