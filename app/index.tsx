import { Link, Stack, router } from 'expo-router';
import { Button, StyleSheet, Text, View, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { useState, useEffect, useRef } from 'react';
import { Lancamento } from '@/domain/Lancamento';
import { LancamentoRepository } from '@/infra/repository/LancamentoRepository';
import { ThemedText } from '@/components/ThemedText';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { Meses } from '@/constants/Meses';
import { formatarMoeda } from '@/helpers/FormatarMoeda';

export default function HomeScreen() {
  const lancamentoRepository = new LancamentoRepository();
  const [totalLancamentos, setTotalLancamentos] = useState<number>(0);
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [mesSelecionado, setMesSelecionado] = useState<string>(new Date().getMonth().toString());

  useEffect(() => {
    const lancamentosObtidos = lancamentoRepository.getAll();
    const lancamentosFiltrados = lancamentosObtidos.filter(lancamento => new Date(lancamento.dataPagamento).getMonth().toString() === mesSelecionado);
    setLancamentos(lancamentosFiltrados);
    const total = lancamentosFiltrados.reduce((acc, lancamento) => acc + lancamento.valor, 0);
    setTotalLancamentos(total);
  }, [mesSelecionado]);

  const handleRemove = (index: number) => {
    const novosLancamentos = [...lancamentos];
    novosLancamentos.splice(index, 1);
    setLancamentos(novosLancamentos);
    const total = novosLancamentos.reduce((acc, lancamento) => acc + lancamento.valor, 0);
    setTotalLancamentos(total);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Paywise',
          headerTitleStyle: { 
            fontFamily: 'NunitoBold',
          fontSize: 18 },
          headerRight: () => (
            <Picker
              selectedValue={mesSelecionado}
              style={styles.picker}
              onValueChange={(itemValue) => setMesSelecionado(itemValue)}
              mode="dropdown"
              dropdownIconColor="#4CAF50"
            >
              {Meses.map((mes) => (
                <Picker.Item key={mes.value} label={mes.label} value={mes.value} />
              ))}
            </Picker>
          )
        }}
      />
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <Animated.Text style={styles.totalValue}>
            {formatarMoeda(totalLancamentos)}
          </Animated.Text>
        </View>
        <ScrollView style={styles.lancamentosContainer}>
          {lancamentos.map((lancamento, index) => (
            <View key={index} style={styles.lancamentoItem}>
              <View style={styles.lancamentoInfo}>
                <ThemedText type="defaultSemiBold" style={styles.lancamentoTitulo}>{lancamento.titulo}</ThemedText>
                <ThemedText type="default" style={styles.lancamentoValor}>{formatarMoeda(lancamento.valor)}</ThemedText>
              </View>
              <TouchableOpacity onPress={() => handleRemove(index)}>
                <Ionicons name="trash" size={18} color="#000" />
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
            color="#000"
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
    backgroundColor: '#f2f4f5', // Cor clara cinza
  },
  picker: {
    marginRight: 5,
    color: '#000000', // Fonte de cor preta
    fontSize: 18,
    fontWeight: 'bold',
    borderWidth: 0,
    fontFamily: 'NunitoBold'
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  totalValue: {
    color: '#000000', // Fonte de cor preta
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: 'NunitoBold'
  },
  lancamentosContainer: {
    flex: 1,
    width: '100%',
  },
  lancamentoItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginVertical: 8,
    borderRadius: 2,
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
    color: '#000000', // Fonte de cor preta
    fontFamily: 'NunitoBold'
  },
  lancamentoValor: {
    color: '#000',
    fontFamily: 'NunitoRegular',
    fontSize: 12
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

