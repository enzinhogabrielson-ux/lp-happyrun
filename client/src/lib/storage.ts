import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Inscription {
  id: string;
  nome: string;
  telefone: string;
  tamanho: string;
  pagamentoConfirmado: boolean;
  dataInscricao: string;
}

interface InscriptionStore {
  inscriptions: Inscription[];
  addInscription: (data: Omit<Inscription, 'id' | 'dataInscricao'>) => void;
  togglePayment: (id: string) => void;
  removeInscription: (id: string) => void;
}

export const useInscriptionStore = create<InscriptionStore>()(
  persist(
    (set) => ({
      inscriptions: [],
      addInscription: (data) => set((state) => ({
        inscriptions: [
          ...state.inscriptions,
          {
            ...data,
            id: Math.random().toString(36).substring(7),
            dataInscricao: new Date().toISOString(),
          },
        ],
      })),
      togglePayment: (id) => set((state) => ({
        inscriptions: state.inscriptions.map((ins) =>
          ins.id === id ? { ...ins, pagamentoConfirmado: !ins.pagamentoConfirmado } : ins
        ),
      })),
      removeInscription: (id) => set((state) => ({
        inscriptions: state.inscriptions.filter((ins) => ins.id !== id),
      })),
    }),
    {
      name: 'inscricoes-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
