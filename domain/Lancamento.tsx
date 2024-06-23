export class Lancamento {
    titulo: string;
    valor: number;
    categoria: string;
    dataPagamento: Date;
    criadoEm: Date;
    
    constructor(titulo: string, valor: number, categoria: string, dataPagamento: Date) {
        this.titulo = titulo;
        this.dataPagamento = new Date();
        this.valor = valor;
        this.categoria = categoria;
        this.criadoEm = new Date();
        this.dataPagamento = dataPagamento;
    }
}