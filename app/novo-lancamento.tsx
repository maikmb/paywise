import { Stack, router } from 'expo-router';
import { StyleSheet, TextInput, View, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LancamentoRepository } from '@/infra/repository/LancamentoRepository';
import { Lancamento } from '@/domain/Lancamento';
import { Text, TouchableOpacity } from 'react-native';
import { format, parse, isValid } from 'date-fns';
import { Categorias } from '@/constants/Categorias';
import uuid from 'react-native-uuid';
import Button from '@/components/Button';
import { extrairValorFinanceiro } from '@/helpers/ExtrairValorFinanceiro';
import { TipoLancamento } from '@/enums/TipoLancamento';

export default function HomeScreen() {
  const lancamentoRepository = new LancamentoRepository();
  const [titulo, setTitulo] = useState<string>('');
  const [categoria, setCategoria] = useState<string>('');
  const [tipoLancamento, setTipoLancamento] = useState<string>(TipoLancamento.DESPESA );
  const [valor, setValor] = useState<string>('');
  const [dataPagamento, setDataPagamento] = useState<Date>(new Date());
  const [dataPagamentoFormatada, setDataPagamentoFormatada] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const tiposLancamentos = [
    { label: 'Despesa', value: TipoLancamento.DESPESA },
    { label: 'Receita', value: TipoLancamento.RECEITA }
  ]

  useEffect(() => {
    const formattedDataPagamento = format(dataPagamento, 'dd/MM/yyyy');
    setDataPagamentoFormatada(formattedDataPagamento);
  }, []);

  const handleSave = () => {
    if (!titulo || !categoria || !valor) {
      window.alert('Todos os campos devem ser preenchidos.');
      return;
    }
    try {
      const id = uuid.v4().toString();

      const novoLancamento = Lancamento
        .create(id, titulo, extrairValorFinanceiro(valor), categoria, dataPagamento, tipoLancamento);

      novoLancamento.validarCampos();
      lancamentoRepository.create(novoLancamento);
      router.replace('/');
    } catch (error) {
      const errorMessage = (error as Error).message;
      window.alert(errorMessage);
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

  const formatarDataAoMudarTexto = (input: string) => {
    let value = input.replace(/\D/g, ''); // Remove tudo que não é dígito
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (value.length > 5) {
      value = value.slice(0, 5) + '/' + value.slice(5, 9);
    }
    return value;
  }

  return (
    <>
      <Stack.Screen options={{
        title: 'Paywise',
        headerTitleStyle: {
          fontFamily: 'NunitoBold',
          fontSize: 18
        },
      }} />
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.headerText}>Novo Lançamento</ThemedText>
          </View>
          <View style={styles.inputContainer}>
            <ThemedText type="label">Título</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Digite o título"
              value={titulo}
              onChangeText={setTitulo}
            />
            <ThemedText type="label">Categoria</ThemedText>
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
            <ThemedText type="label">Valor</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Digite o valor"
              keyboardType="numeric"
              value={valor}
              onChangeText={handleValorChange}
            />
            <ThemedText type="label">Data de Pagamento</ThemedText>
            {Platform.OS === 'web' ? (
              <TextInput
                maxLength={10}
                style={styles.input}
                value={dataPagamentoFormatada}
                placeholder="Selecione a data"
                onChangeText={(value) => {
                  var dataFormatadaTexto = formatarDataAoMudarTexto(value)
                  const novaDataPagameto = parse(dataFormatadaTexto, 'dd/MM/yyyy', new Date());
                  setDataPagamentoFormatada(dataFormatadaTexto)
                  if (isValid(novaDataPagameto)) {
                    handleDateChange(null, novaDataPagameto);
                  }
                }}
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
            <ThemedText type="label">Tipo de Lançamento</ThemedText>
            <Picker
              selectedValue={tipoLancamento}
              style={styles.input}
              onValueChange={(itemValue: string) => setTipoLancamento(itemValue)}
            >
              {tiposLancamentos.map((categoria, index) => (
                <Picker.Item key={index} label={categoria.label} value={categoria.value} />
              ))}
            </Picker>
          </View>
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Button
                title="Salvar"
                onPress={handleSave}
                color="#4CAF50"
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
    marginBottom: 20,
  },
  headerText: {
    color: '#000',
    fontFamily: 'NunitoBold',
    fontSize: 18
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
    fontFamily: 'NunitoRegular'
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
