export class Lancamento {
    id: string;
    titulo: string;
    valor: number;
    categoria: string;
    dataPagamento: Date;
    criadoEm: Date;
    pagamentoRealizado: boolean;
    tipoLancamento: string;

    constructor() {
        this.id = '';
        this.titulo = '';
        this.valor = 0;
        this.categoria = '';
        this.dataPagamento = new Date();
        this.criadoEm = new Date();
        this.pagamentoRealizado = false;
        this.tipoLancamento = '';
    }

    public validarCampos(): void {
        if (!this.titulo || this.titulo.trim() === "") {
            throw new Error("O campo título não pode ser em branco.");
        }

        if (!this.tipoLancamento) {
            throw new Error("O tipo lancamento não pode ser em branco.");
        }

        if (this.valor <= 0) {
            throw new Error("O valor deve ser maior que 0.");
        }
    }

    public realizarPagamento() {
        this.pagamentoRealizado = true;
    }

    public static create(lancamentoRequest: any) {
        var lancamento = new Lancamento()
        lancamento.id = lancamentoRequest.id;
        lancamento.titulo = lancamentoRequest.titulo;
        lancamento.valor = lancamentoRequest.valor;
        lancamento.categoria = lancamentoRequest.categoria;
        lancamento.dataPagamento = lancamentoRequest.dataPagamento;
        lancamento.tipoLancamento = lancamentoRequest.tipoLancamento;        
        lancamento.criadoEm = new Date();
        lancamento.pagamentoRealizado = false;
        lancamento.validarCampos();
        return lancamento;  
    }
    
    public static fromJSON(json: any) {
        var lancamento = new Lancamento()
        lancamento.id = json.id;
        lancamento.titulo = json.titulo;
        lancamento.valor = json.valor;
        lancamento.categoria = json.categoria;
        lancamento.dataPagamento = json.dataPagamento;
        lancamento.tipoLancamento = json.tipoLancamento;
        lancamento.criadoEm = json.criadoEm;
        lancamento.pagamentoRealizado = json.pagamentoRealizado;   
        return lancamento;
    }
}