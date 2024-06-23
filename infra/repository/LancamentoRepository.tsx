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
        return lancamento;
    }

    read(titulo: string): Lancamento | undefined {
        const lancamentos = this.loadFromLocalStorage();
        return lancamentos.find(lancamento => lancamento.titulo === titulo);
    }

    update(titulo: string, updatedLancamento: Lancamento): Lancamento | undefined {
        const lancamentos = this.loadFromLocalStorage();
        const index = lancamentos.findIndex(lancamento => lancamento.titulo === titulo);
        if (index !== -1) {
            lancamentos[index] = updatedLancamento;
            this.saveToLocalStorage(lancamentos);
            return updatedLancamento;
        }
        return undefined;
    }

    delete(titulo: string): boolean {
        const lancamentos = this.loadFromLocalStorage();
        const index = lancamentos.findIndex(lancamento => lancamento.titulo === titulo);
        if (index !== -1) {
            lancamentos.splice(index, 1);
            this.saveToLocalStorage(lancamentos);
            return true;
        }
        return false;
    }

    getAll(): Lancamento[] {
        return this.loadFromLocalStorage();
    }
}
