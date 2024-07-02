export class Lancamento {
    titulo: string;
    valor: number;
    categoria: string;
    dataPagamento: Date;
    criadoEm: Date;
    
    constructor(titulo: string, valor: number, categoria: string, dataPagamento: Date) {
        this.titulo = titulo;
        this.valor = valor;
        this.categoria = categoria;
        this.dataPagamento = dataPagamento;
        this.criadoEm = new Date();
        this.validarCampos();
    }

    public validarCampos(): void {
        if (!this.titulo || this.titulo.trim() === "") {
            throw new Error("O campo título não pode ser em branco.");
        }
        if (this.valor <= 0) {
            throw new Error("O valor deve ser maior que 0.");
        }
    }
}