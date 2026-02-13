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
  config: {
    pixKey: string;
  };
  addInscription: (data: Omit<Inscription, 'id' | 'dataInscricao'>) => void;
  togglePayment: (id: string) => void;
  removeInscription: (id: string) => void;
  updatePixKey: (key: string) => void;
}

export const useInscriptionStore = create<InscriptionStore>()(
  persist(
    (set) => ({
      inscriptions: [],
      config: {
        pixKey: "00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913Humani Eventos6009SAO PAULO62070503***6304E2CA", // Default Mock Key
      },
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
      updatePixKey: (key) => set((state) => ({
        config: { ...state.config, pixKey: key },
      })),
    }),
    {
      name: 'inscricoes-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
