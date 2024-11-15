import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/CategoriesScreenStyles';

type Category = {
  name: string;
  keywords: string[];
};

const CategoriesScreen = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const storedCategories = await AsyncStorage.getItem('categories');
    if (storedCategories) setCategories(JSON.parse(storedCategories));
  };

  const saveCategories = async (newCategories: Category[]) => {
    await AsyncStorage.setItem('categories', JSON.stringify(newCategories));
    await AsyncStorage.setItem('categoriesUpdated', 'true'); // Define o sinalizador para indicar que houve uma atualização
    setCategories(newCategories);
  };
  

  const addOrEditCategory = () => {
    if (!categoryName.trim()) return;

    const updatedCategories = isEditing
      ? categories.map((cat) =>
          cat.name === selectedCategory ? { ...cat, name: categoryName } : cat
        )
      : [...categories, { name: categoryName, keywords: [] }];

    saveCategories(updatedCategories);
    setCategoryName('');
    setSelectedCategory(null);
    setIsEditing(false);
  };

  const deleteCategory = (categoryName: string) => {
    Alert.alert("Confirmação", `Deseja excluir a categoria ${categoryName}?`, [
      { text: "Cancelar" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          const updatedCategories = categories.filter((cat) => cat.name !== categoryName);
          saveCategories(updatedCategories); // Salva as categorias atualizadas no AsyncStorage
        },
      },
    ]);
  };

  const editCategory = (categoryName: string) => {
    setCategoryName(categoryName);
    setSelectedCategory(categoryName);
    setIsEditing(true);
  };

  const addKeyword = (categoryName: string) => {
    if (keyword.trim()) {
      const updatedCategories = categories.map((cat) =>
        cat.name === categoryName ? { ...cat, keywords: [...cat.keywords, keyword] } : cat
      );
      saveCategories(updatedCategories);
      setKeyword('');
      setSelectedCategory(null);
    }
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <View style={styles.categoryItem}>
      <Text style={styles.categoryName}>{item.name}</Text>
      <FlatList
        data={item.keywords}
        renderItem={({ item }) => <Text style={styles.keyword}>{item}</Text>}
        keyExtractor={(keyword) => keyword}
      />
      <TouchableOpacity onPress={() => setSelectedCategory(item.name)}>
        <Text style={styles.addKeywordText}>Adicionar Palavra-chave</Text>
      </TouchableOpacity>

      {/* Botões de editar e excluir */}
      <View style={styles.categoryActions}>
        <TouchableOpacity onPress={() => editCategory(item.name)}>
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteCategory(item.name)}>
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>

      {selectedCategory === item.name && (
        <View style={styles.keywordInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Palavra-chave"
            value={keyword}
            onChangeText={setKeyword}
          />
          <Button title="Adicionar" onPress={() => addKeyword(item.name)} />
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categorias</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome da Categoria"
        value={categoryName}
        onChangeText={setCategoryName}
      />
      <Button title={isEditing ? "Salvar Alterações" : "Adicionar Categoria"} onPress={addOrEditCategory} />
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default CategoriesScreen;
