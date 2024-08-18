import { Stack, router } from 'expo-router';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { useState, useEffect, useRef } from 'react';
import { Lancamento } from '@/domain/Lancamento';
import { LancamentoRepository } from '@/infra/repository/LancamentoRepository';
import { ThemedText } from '@/components/ThemedText';
import { Picker } from '@react-native-picker/picker';
import { Meses } from '@/constants/Meses';
import { formatarMoeda } from '@/helpers/FormatarMoeda';
import { isEmpty } from 'lodash';
import Button from '@/components/Button';
import uuid from 'react-native-uuid';
import { TipoLancamento } from '@/enums/TipoLancamento';

export default function HomeScreen() {
  const lancamentoRepository = new LancamentoRepository();
  const [totalDespesas, setTotalDespesas] = useState<number>(0);
  const [totalReceita, setTotalReceita] = useState<number>(0);
  const [totalLiquido, setTotalLiquido] = useState<number>(0);
  const [lancamentosDespesas, setLancamentosDespesas] = useState<Lancamento[]>([]);
  const [lancamentosReceitas, setLancamentosReceitas] = useState<Lancamento[]>([]);
  const [mesSelecionado, setMesSelecionado] = useState<number>(new Date().getMonth() + 1);
  const [existeLancamentosAnteriores, setExisteLancamentosAnteriores] = useState<boolean>(false);

  useEffect(() => {
    debugger
    getTodasDespesas()
    getTodasReceitas()
  }, [mesSelecionado]);

  useEffect(() => {
    if (totalDespesas >= 0 && totalReceita >= 0)
      setTotalLiquido(totalReceita - totalDespesas);
  }, [totalDespesas, totalReceita]);

  const getTodasReceitas = () => {
    const dbLancamentos = lancamentoRepository.getAll();
    const receitasDoMes = dbLancamentos
      .filter(lancamento => {
        const dataPagamento = new Date(lancamento.dataPagamento)
        return (dataPagamento.getMonth() + 1) === mesSelecionado
          && dataPagamento.getFullYear() === new Date().getFullYear()
          && lancamento.tipoLancamento == TipoLancamento.RECEITA;
      });

    setTotalReceita(receitasDoMes.reduce((acc, lancamento) => acc + lancamento.valor, 0));
    setLancamentosReceitas(receitasDoMes);
  };

  const getTodasDespesas = () => {
    debugger
    const dbLancamentos = lancamentoRepository.getAll();
    const lancamentosFiltrados = dbLancamentos
      .filter(lancamento => {
        if (!lancamento.dataPagamento) return false;
        const dataPagamento = new Date(lancamento.dataPagamento)
        return (dataPagamento.getMonth() + 1) === mesSelecionado
          && dataPagamento.getFullYear() === new Date().getFullYear()
          && lancamento.tipoLancamento == TipoLancamento.DESPESA;
      });

    setExisteLancamentosAnteriores(!isEmpty(dbLancamentos));
    setLancamentosDespesas(lancamentosFiltrados);
    setTotalDespesas(lancamentosFiltrados.reduce((acc, lancamento) => acc + lancamento.valor, 0));
  }

  const onCopiarMesAnterior = () => {
    debugger
    const mesAnterior = mesSelecionado - 1;

    const mesAnteriorFiltrados = lancamentoRepository
      .getAll()
      .filter(lancamento => (new Date(lancamento.dataPagamento).getMonth() + 1) === mesAnterior)
      .map(lancamento => {
        lancamento.id = uuid.v4().toString();
        lancamento.pagamentoRealizado = false;
        lancamento.dataPagamento = new Date(new Date(lancamento.dataPagamento).setMonth(mesSelecionado - 1));
        return lancamento
      });

    if (mesAnteriorFiltrados.length === 0) {
      window.alert('Não existe dados para o mês anterior');
      return;
    }

    mesAnteriorFiltrados.forEach(lancamento => lancamentoRepository.create(lancamento));
    getTodasDespesas();
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Paywise',
          headerTitleStyle: {
            fontFamily: 'NunitoBold',
            fontSize: 18
          },
          headerRight: () => (
            <Picker
              selectedValue={mesSelecionado}
              style={styles.picker}
              onValueChange={(itemValue) => setMesSelecionado(Number(itemValue))}
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
        {!isEmpty(lancamentosDespesas) ?
          <>
            <View style={styles.saldoContainer}>
              <ThemedText align='left' type='title'>
                Saldo total
              </ThemedText>
              <ThemedText align='left' type='title' style={styles.saldo}>
                {formatarMoeda(totalLiquido)}
              </ThemedText>
            </View>
            <View>
              <ThemedText type='default' style={styles.tipoLancamentos}>
                📈 Receitas: {formatarMoeda(totalReceita)}
              </ThemedText>
              <ScrollView style={styles.lancamentosContainer}>
                {lancamentosReceitas.map((lancamento, index) => (
                  <TouchableOpacity key={index} style={styles.lancamentoItem} onPress={() => {
                    // Navegar para a página "detalhes-lancamento"
                    router.push({ pathname: '/detalhes-lancamento', params: { id: lancamento.id, titulo: lancamento.titulo } })
                  }}>
                    <View style={styles.lancamentoInfo}>
                      <ThemedText type="defaultSemiBold" style={styles.lancamentoTitulo}>{lancamento.titulo}</ThemedText>
                      <ThemedText type="default" style={styles.lancamentoValor}>{formatarMoeda(lancamento.valor)}</ThemedText>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View>
              <ThemedText type='default' style={styles.tipoLancamentos}>
                📉 Despesas: {formatarMoeda(totalDespesas)}
              </ThemedText>
              <ScrollView style={styles.lancamentosContainer}>
                {lancamentosDespesas.map((lancamento, index) => (
                  <TouchableOpacity key={index} style={styles.lancamentoItem} onPress={() => {
                    // Navegar para a página "detalhes-lancamento"
                    router.push({ pathname: '/detalhes-lancamento', params: { id: lancamento.id, titulo: lancamento.titulo } })
                  }}>
                    <View style={styles.lancamentoInfo}>
                      <ThemedText type="defaultSemiBold" style={styles.lancamentoTitulo}>{lancamento.titulo}</ThemedText>
                      <ThemedText type="default" style={styles.lancamentoValor}>{formatarMoeda(lancamento.valor)}</ThemedText>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </> :
          <View style={styles.pagamentosVazioContainer}>
            <ThemedText align='center' type="defaultSemiBold">Você ainda não tem lembretes de pagamentos cadastrados. Que tal começar agora?</ThemedText>
            <Image style={styles.pagamentosVazio} source={require('@/assets/illustrations/empty.svg')} />
          </View>
        }
        <View style={styles.buttonContainer}>
          <Button title='Incluir lançamento' onPress={() => {
            router.push('/novo-lancamento')
          }} />
          {existeLancamentosAnteriores && isEmpty(lancamentosDespesas) && (
            <>
              <ThemedText align='center' type="defaultSemiBold" style={styles.textoCopiarLancamentos}>ou se preferir você pode copiar seus pagamentos do mês anterior</ThemedText>
              <Button title='Copiar do mês anterior' onPress={() => onCopiarMesAnterior()} />
            </>
          )}
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
  pagamentosVazio: {
    height: 300,
    width: 300
  },
  picker: {
    marginRight: 5,
    color: '#000000', // Fonte de cor preta
    fontSize: 18,
    fontWeight: 'bold',
    borderWidth: 0,
    fontFamily: 'NunitoBold'
  },
  tipoLancamentos: {
    color: '#000000', // Fonte de cor preta
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'NunitoBold',
    marginTop: 10,
    marginBottom: 10
  },
  saldoContainer: {
    marginBottom: 30,
    marginTop: 30
  },
  saldo: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30
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
    display: 'flex',
    flexDirection: 'column',
    marginTop: 20,
    alignItems: 'center',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  pagamentosVazioContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 500,
  },
  textoCopiarLancamentos: {
    marginBottom: 20,
    marginTop: 20
  }
});

