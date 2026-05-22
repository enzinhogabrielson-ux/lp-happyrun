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
        pixKey: "00020101021126580014br.gov.bcb.pix0136e8e85660-4d21-414e-9414-9f85e840241a520400005303986540597.005802BR5916RAFAELA M FARIAS6008SOROCABA62070503***6304D57B", // Novo código fornecido
        username: "admin",
        password: "admin"
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
