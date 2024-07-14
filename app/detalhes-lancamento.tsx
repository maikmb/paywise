import { Stack, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, TextInput, Button, View, ScrollView, Alert, Platform, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Children, useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LancamentoRepository } from '@/infra/repository/LancamentoRepository';
import { Lancamento } from '@/domain/Lancamento';
import { formatarMoeda } from '@/helpers/FormatarMoeda';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AcaoItem from '@/components/AcaoItem';
import { useToast } from '@/components/Toast';

export default function DetalhesLancamento() {
  const lancamentoRepository = new LancamentoRepository();
  const [lancamento, setLancamento] = useState<Lancamento>();
  const params = useLocalSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    if (params.id) {
      setLancamento(lancamentoRepository.getById(params.id.toString()))
    }
  }, [params])

  const onClickMarcarPago = (lancamento: Lancamento) => {
    debugger
    lancamento.realizarPagamento();
    lancamentoRepository.update(lancamento)
    toast('Lançamento marcado como pago!', 'success', 4000);
    router.replace('/');
  };

  const onClickExcluir = (id: string) => {
    lancamentoRepository.delete(id);
    toast('Lançamento excluído!', 'success', 4000);
    router.replace('/');
  };

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
        {lancamento ? (
          <>
            <View>
              <ThemedText type="title" style={styles.headerText}>{lancamento.titulo}</ThemedText>
            </View>

            <View style={styles.detalheItem}>
              <View>
                <ThemedText type="default">Valor:</ThemedText>
              </View>
              <View>
                <ThemedText type="defaultSemiBold">{formatarMoeda(lancamento.valor)}</ThemedText>
              </View>
            </View>
            <View style={styles.detalheItem}>
              <View>
                <ThemedText type="default" >Categoria:</ThemedText>
              </View>
              <View>
                <ThemedText type="defaultSemiBold">{lancamento.categoria}</ThemedText>
              </View>
            </View>

            <View style={styles.acoesContainer}>
              <AcaoItem title='Excluir' onPress={() => onClickExcluir(lancamento.id)}>
                <Ionicons name="trash" size={20} color="#000" />
              </AcaoItem>
              <AcaoItem title='Marcar como pago' onPress={() => onClickMarcarPago(lancamento)}>
                <MaterialCommunityIcons name="contactless-payment" size={20} color="#000" />
              </AcaoItem>
            </View>
          </>
        ) : 'Carregando...'}
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center'
  },
  headerText: {
    marginTop: 50,
    marginBottom: 50,
    color: '#000',
    fontFamily: 'NunitoBold',
    textAlign: 'center'
  },
  acoesContainer: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  detalheItem: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomColor: '#c6c6c6',
    borderBottomWidth: 0.5
  }
});
