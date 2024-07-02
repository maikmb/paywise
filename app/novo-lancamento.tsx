import { Stack, router } from 'expo-router';
import { StyleSheet, TextInput, Button, View, ScrollView, Alert, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LancamentoRepository } from '@/infra/repository/LancamentoRepository';
import { Lancamento } from '@/domain/Lancamento';
import { Text, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { Categorias } from '@/constants/Categorias';

export default function HomeScreen() {
  const lancamentoRepository = new LancamentoRepository();
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [valor, setValor] = useState('');
  const [dataPagamento, setDataPagamento] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = () => {
    if (!titulo || !categoria || !valor) {
      Alert.alert('Erro', 'Todos os campos devem ser preenchidos.');
      return;
    }
    try {
      const novoLancamento = new Lancamento(titulo, parseFloat(valor.replace(/\D/g, '')) / 100, categoria, dataPagamento);
      novoLancamento.validarCampos();
      lancamentoRepository.create(novoLancamento);
      router.replace('/');
    } catch (error) {
      const errorMessage = (error as Error).message;
      Alert.alert('Erro', errorMessage);
    }
  };

  const handleCancel = () => {
    router.replace('/');
  };

  const handleValorChange = (text: string) => {
    const formattedValue = text
      .replace(/\D/g, '')
      .replace(/(\d)(\d{2})$/, '$1,$2')
      .replace(/(?=(\d{3})+(\D))\B/g, '.');
    setValor(formattedValue);
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || dataPagamento;
    setShowDatePicker(Platform.OS === 'ios');
    setDataPagamento(currentDate);
  };



  return (
    <>
      <Stack.Screen options={{ title: 'Incluir Lançamento' }} />
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.headerText}>Novo Lançamento</ThemedText>
          </View>
          <View style={styles.inputContainer}>
            <ThemedText type="defaultSemiBold">Título</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Digite o título"
              value={titulo}
              onChangeText={setTitulo}
            />
            <ThemedText type="defaultSemiBold">Categoria</ThemedText>
            <Picker
              selectedValue={categoria}
              style={styles.input}
              onValueChange={(itemValue: string) => setCategoria(itemValue)}
            >
              <Picker.Item label="Selecione uma categoria" value="" />
              {Categorias.map((categoria, index) => (
                <Picker.Item key={index} label={categoria.label} value={categoria.value} />
              ))}
            </Picker>
            <ThemedText type="defaultSemiBold">Valor</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Digite o valor"
              keyboardType="numeric"
              value={valor}
              onChangeText={handleValorChange}
            />
            <ThemedText type="defaultSemiBold">Data de Pagamento</ThemedText>
            {Platform.OS === 'web' ? (
              <TextInput
                style={styles.input}
                placeholder="Selecione a data"
                value={format(dataPagamento, 'dd/MM/yyyy')}
                onFocus={() => setShowDatePicker(true)}
                readOnly
              />
            ) : (
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Text style={styles.input}>{format(dataPagamento, 'dd/MM/yyyy')}</Text>
              </TouchableOpacity>
            )}
            {showDatePicker && (
              <DateTimePicker
                value={dataPagamento}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Button
                title="Salvar"
                onPress={handleSave}
                color="#4CAF50"
              />
            </View>
            <View style={styles.button}>
              <Button
                title="Cancelar"
                onPress={handleCancel}
                color="#F44336"
              />
            </View>
          </View>
        </ScrollView>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    color: '#4CAF50',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});
