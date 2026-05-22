import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iknfuwgfcfdfevbvlboa.supabase.co';
const supabaseAnonKey = 'sb_publishable_ZBpCWMXdzUQ0eX13sKC0ow_rVPVEdhm';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipo retornado pelo Supabase (snake_case)
export interface SupabaseInscription {
  id: number;
  nome: string;
  telefone: string;
  tamanho: string;
  cor_camisa: string;
  trabalha_bandeiras: boolean;
  empresa_bandeiras: string | null;
  presenca_spinning: boolean;
  pagamento_confirmado: boolean;
  data_inscricao: string;
}

// Tipo padronizado no frontend (camelCase)
export interface Inscription {
  id: number;
  nome: string;
  telefone: string;
  tamanho: string;
  corCamisa: string;
  trabalhaBandeiras: boolean;
  empresaBandeiras: string;
  presencaSpinning: boolean;
  pagamentoConfirmado: boolean;
  dataInscricao: Date;
}

// Converte snake_case → camelCase
export function mapInscription(raw: SupabaseInscription): Inscription {
  return {
    id: raw.id,
    nome: raw.nome,
    telefone: raw.telefone,
    tamanho: raw.tamanho,
    corCamisa: raw.cor_camisa,
    trabalhaBandeiras: raw.trabalha_bandeiras,
    empresaBandeiras: raw.empresa_bandeiras ?? '',
    presencaSpinning: raw.presenca_spinning,
    pagamentoConfirmado: raw.pagamento_confirmado,
    dataInscricao: new Date(raw.data_inscricao),
  };
}
