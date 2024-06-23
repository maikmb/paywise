import { Link, Stack, router } from 'expo-router';
import { Button, StyleSheet, Text, View, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { useState, useEffect, useRef } from 'react';
import { Lancamento } from '@/domain/Lancamento';
import { LancamentoRepository } from '@/infra/repository/LancamentoRepository';
import { ThemedText } from '@/components/ThemedText';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const lancamentoRepository = new LancamentoRepository();
  const [totalLancamentos, setTotalLancamentos] = useState<number>(0);
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [mesSelecionado, setMesSelecionado] = useState<string>(new Date().getMonth().toString());
  const totalAnimado = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const lancamentosObtidos = lancamentoRepository.getAll();
    const lancamentosFiltrados = lancamentosObtidos.filter(lancamento => new Date(lancamento.dataPagamento).getMonth().toString() === mesSelecionado);
    setLancamentos(lancamentosFiltrados);
    const total = lancamentosFiltrados.reduce((acc, lancamento) => acc + lancamento.valor, 0);
    setTotalLancamentos(total);
    Animated.timing(totalAnimado, {
      toValue: total,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [mesSelecionado]);

  const handleRemove = (index: number) => {
    const novosLancamentos = [...lancamentos];
    novosLancamentos.splice(index, 1);
    setLancamentos(novosLancamentos);
    const total = novosLancamentos.reduce((acc, lancamento) => acc + lancamento.valor, 0);
    setTotalLancamentos(total);
    Animated.timing(totalAnimado, {
      toValue: total,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const animatedValue = totalAnimado.interpolate({
    inputRange: [0, totalLancamentos],
    outputRange: [0, totalLancamentos],
  });

  return (
    <>
      <Stack.Screen options={{ title: 'Paywise' }} />
      <ThemedView style={styles.container}>
        <Picker
          selectedValue={mesSelecionado}
          style={styles.picker}
          onValueChange={(itemValue) => setMesSelecionado(itemValue)}
        >
          <Picker.Item label="Janeiro" value="0" />
          <Picker.Item label="Fevereiro" value="1" />
          <Picker.Item label="Março" value="2" />
          <Picker.Item label="Abril" value="3" />
          <Picker.Item label="Maio" value="4" />
          <Picker.Item label="Junho" value="5" />
          <Picker.Item label="Julho" value="6" />
          <Picker.Item label="Agosto" value="7" />
          <Picker.Item label="Setembro" value="8" />
          <Picker.Item label="Outubro" value="9" />
          <Picker.Item label="Novembro" value="10" />
          <Picker.Item label="Dezembro" value="11" />
        </Picker>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.totalText}>Total de Lançamentos</ThemedText>
          <Animated.Text style={styles.totalValue}>
            R$ {totalLancamentos.toFixed(2)}
          </Animated.Text>
        </View>
        <ScrollView style={styles.lancamentosContainer}>
          {lancamentos.map((lancamento, index) => (
            <View key={index} style={styles.lancamentoItem}>
              <View style={styles.lancamentoInfo}>
                <ThemedText type="defaultSemiBold" style={styles.lancamentoTitulo}>{lancamento.titulo}</ThemedText>
                <ThemedText type="default" style={styles.lancamentoValor}>R$ {lancamento.valor}</ThemedText>
              </View>
              <TouchableOpacity onPress={() => handleRemove(index)}>
                <Ionicons name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button
            title="Incluir lançamento"
            onPress={() => {
              // Navegar para a página "novo-lancamento"
              router.replace('/novo-lancamento')
            }}
            color="#4CAF50"
          />
        </View>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  picker: {
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  totalText: {
    color: '#4CAF50',
  },
  totalValue: {
    color: '#4CAF50',
    fontSize: 32,
    fontWeight: 'bold',
  },
  lancamentosContainer: {
    flex: 1,
    width: '100%',
  },
  lancamentoItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lancamentoInfo: {
    flexDirection: 'column',
  },
  lancamentoTitulo: {
    color: '#333333',
  },
  lancamentoValor: {
    color: '#4CAF50',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
