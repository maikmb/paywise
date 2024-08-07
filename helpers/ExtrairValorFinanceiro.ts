export function extrairValorFinanceiro(valor: string) {
    return parseFloat(valor.replace(/\D/g, '')) / 100;
}