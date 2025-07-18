import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface Item {
  id: string;
  name: string;
  bought: boolean;
}

const ShoppingList = () => {
  const [item, setItem] = useState('');
  const [list, setList] = useState<Item[]>([]);

  const addItem = () => {
    if (!item) return;
    setList([
      ...list,
      { id: Date.now().toString(), name: item, bought: false },
    ]);
    setItem('');
  };

  const toggleBought = (id: string) => {
    setList(list.map(i => (i.id === id ? { ...i, bought: !i.bought } : i)));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🛒 Shopping List</Text>
      <View style={styles.row}>
        <TextInput
          placeholder="Add item"
          value={item}
          onChangeText={setItem}
          style={styles.input}
        />
        <Button title="Add" onPress={addItem} />
      </View>
      <FlatList
        data={list}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleBought(item.id)}
            style={styles.itemRow}
          >
            <Text style={[styles.itemText, item.bought && styles.bought]}>
              {item.bought ? '✅' : '🟩'} {item.name}
            </Text>
          </TouchableOpacity>
        )}
        style={{ marginTop: 16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center' },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginVertical: 8,
    marginRight: 8,
  },
  itemRow: { padding: 8, borderBottomWidth: 1, borderColor: '#eee' },
  itemText: { fontSize: 16 },
  bought: { textDecorationLine: 'line-through', color: 'gray' },
});

export default ShoppingList;
