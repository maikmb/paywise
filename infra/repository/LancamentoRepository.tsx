import { Lancamento } from '../../domain/Lancamento';

export class LancamentoRepository {
    private storageKey = 'lancamentos';

    private saveToLocalStorage(lancamentos: Lancamento[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(lancamentos));
    }

    private loadFromLocalStorage(): Lancamento[] {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    create(lancamento: Lancamento): Lancamento {
        const lancamentos = this.loadFromLocalStorage();
        lancamentos.push(lancamento);
        this.saveToLocalStorage(lancamentos);
        return Lancamento.fromJSON(lancamento);
    }
    

    update(updatedLancamento: Lancamento): Lancamento | undefined {
        const lancamentos = this.loadFromLocalStorage();
        const index = lancamentos.findIndex(lancamento => lancamento.id === updatedLancamento.id);
        if (index !== -1) {
            lancamentos[index] = updatedLancamento;
            this.saveToLocalStorage(lancamentos);
            return updatedLancamento;
        }
        return undefined;
    }

    delete(id: string): boolean {
        const lancamentos = this.loadFromLocalStorage();
        const index = lancamentos.findIndex(lancamento => lancamento.id === id);
        if (index !== -1) {
            lancamentos.splice(index, 1);
            this.saveToLocalStorage(lancamentos);
            return true;
        }
        return false;
    }

    getAll(): Lancamento[] {
        var lancamentos = this.loadFromLocalStorage();
        return lancamentos.map(Lancamento.fromJSON);
    }

    getById(id: string): Lancamento | undefined {
        var lancamentos = this.loadFromLocalStorage()
        const lancamento = lancamentos.find(lancamento => lancamento.id === id);
        return Lancamento.fromJSON(lancamento);
    }
}
