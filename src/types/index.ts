// ===========================================
// TIPOS DO SISTEMA - Almoxarifado SAAE
// ===========================================

// ============= ITEM DO ALMOXARIFADO =============
export interface Item {
  codigo: string;
  nome: string;
  categoria: string;
  unidade: string;
  fornecedor: string;
  qtdAtual: number;
  qtdMinima: number;
  endereco: string;
  dataUltimaMovimentacao?: string;
}

// ============= BOMBA DE ÁGUA =============
export interface Bomba {
  id: string;
  serie: string;
  fabricante: string;
  modelo: string;
  potencia: string;
  capacidade: string;
  status: 'Estoque' | 'Operando' | 'Manutenção' | 'Descartada';
  localizacao: string;
  endereco?: string;
  responsavel?: string;
  dataInstalacao?: string | null;
  horasUso: string;
  proximaManutencao: string;
}

// ============= MOVIMENTAÇÃO =============
export interface Movimentacao {
  id: string;
  tipo: 'Entrada' | 'Saída';
  itemCodigo: string;
  itemNome: string;
  quantidade: number;
  unidade: string;
  responsavel: string;
  setor: string;
  data: string;
  hora: string;
  notaFiscal?: string;
  fornecedor?: string;
  observacao: string;
}

// ============= USUÁRIO =============
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: 'Almoxarife' | 'Gestor' | 'Técnico' | 'Administrador';
  setor: string;
  status: 'Ativo' | 'Inativo';
  ultimoAcesso: string;
  dataCadastro: string;
  senha?: string;
}

// ============= ALERTA =============
export interface Alerta {
  id: string;
  tipo: 'Estoque Baixo' | 'Manutenção' | 'Vencimento' | 'Sistema';
  prioridade: 'Alta' | 'Média' | 'Baixa';
  titulo: string;
  descricao: string;
  itemCodigo?: string;
  bombaId?: string;
  dataGeracao: string;
  status: 'Pendente' | 'Em Andamento' | 'Resolvido';
  responsavel: string;
}

// ============= ESTADO DO ALMOXARIFADO =============
export interface AlmoxarifadoState {
  itens: Item[];
  bombas: Bomba[];
  movimentacoes: Movimentacao[];
  usuarios: Usuario[];
  alertas: Alerta[];
}

// ============= AÇÕES DO REDUCER =============
export type AlmoxarifadoAction =
  | { type: 'ADD_ITEM'; payload: Item }
  | { type: 'UPDATE_ITEM'; payload: Item }
  | { type: 'DELETE_ITEM'; payload: string }
  | { type: 'ADD_BOMBA'; payload: Bomba }
  | { type: 'UPDATE_BOMBA'; payload: Bomba }
  | { type: 'DELETE_BOMBA'; payload: string }
  | { type: 'ADD_MOVIMENTACAO'; payload: Movimentacao }
  | { type: 'UPDATE_ITEM_QUANTITY'; payload: { codigo: string; quantidade: number; tipo: 'entrada' | 'saida' } }
  | { type: 'ADD_USUARIO'; payload: Usuario }
  | { type: 'UPDATE_USUARIO'; payload: Usuario }
  | { type: 'DELETE_USUARIO'; payload: string }
  | { type: 'ADD_ALERTA'; payload: Alerta }
  | { type: 'UPDATE_ALERTA'; payload: Alerta }
  | { type: 'DELETE_ALERTA'; payload: string }
  | { type: 'LOAD_DATA'; payload: AlmoxarifadoState };
