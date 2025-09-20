import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'sonner';

// Types
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
  dataInstalacao?: string;
  horasUso: string;
  proximaManutencao: string;
}

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

interface AlmoxarifadoState {
  itens: Item[];
  bombas: Bomba[];
  movimentacoes: Movimentacao[];
}

type AlmoxarifadoAction =
  | { type: 'ADD_ITEM'; payload: Item }
  | { type: 'UPDATE_ITEM'; payload: Item }
  | { type: 'DELETE_ITEM'; payload: string }
  | { type: 'ADD_BOMBA'; payload: Bomba }
  | { type: 'UPDATE_BOMBA'; payload: Bomba }
  | { type: 'DELETE_BOMBA'; payload: string }
  | { type: 'ADD_MOVIMENTACAO'; payload: Movimentacao }
  | { type: 'UPDATE_ITEM_QUANTITY'; payload: { codigo: string; quantidade: number; tipo: 'entrada' | 'saida' } }
  | { type: 'LOAD_DATA'; payload: AlmoxarifadoState };

const initialState: AlmoxarifadoState = {
  itens: [
    {
      codigo: "HID001",
      nome: "Bomba Centrífuga 3HP",
      categoria: "Bombas",
      unidade: "unidade",
      fornecedor: "Bomba Tech",
      qtdAtual: 2,
      qtdMinima: 5,
      endereco: "A2-P1-N3-001",
      dataUltimaMovimentacao: "2024-01-20"
    },
    {
      codigo: "HID002",
      nome: "Conexão PVC 50mm",
      categoria: "Hidráulica",
      unidade: "unidade",
      fornecedor: "Hidro Parts",
      qtdAtual: 45,
      qtdMinima: 20,
      endereco: "B1-P2-N1-005"
    },
    {
      codigo: "ELE001",
      nome: "Cabo Flexível 4mm",
      categoria: "Elétrica",
      unidade: "metro",
      fornecedor: "ElectroMax",
      qtdAtual: 180,
      qtdMinima: 100,
      endereco: "C3-P1-N2-010"
    },
    {
      codigo: "FER001",
      nome: "Chave de Fenda 8mm",
      categoria: "Ferramentas",
      unidade: "unidade",
      fornecedor: "Tool Master",
      qtdAtual: 8,
      qtdMinima: 10,
      endereco: "D1-P3-N1-002"
    },
    {
      codigo: "EPI001",
      nome: "Capacete de Segurança",
      categoria: "EPI",
      unidade: "unidade",
      fornecedor: "Safety First",
      qtdAtual: 25,
      qtdMinima: 15,
      endereco: "E2-P1-N4-001"
    }
  ],
  bombas: [
    {
      id: "B001",
      serie: "BC-3HP-2024-001",
      fabricante: "Bomba Tech",
      modelo: "Centrífuga CT-3000",
      potencia: "3 HP",
      capacidade: "500 L/min",
      status: "Operando",
      localizacao: "ETA Central - Bomba Principal",
      responsavel: "João Silva",
      dataInstalacao: "2024-01-15",
      horasUso: "2.340h",
      proximaManutencao: "2024-12-15"
    },
    {
      id: "B002",
      serie: "BC-2HP-2023-015",
      fabricante: "AquaTech",
      modelo: "Submersível AS-2000",
      potencia: "2 HP",
      capacidade: "300 L/min",
      status: "Operando",
      localizacao: "Poço Artesiano Norte",
      responsavel: "Maria Santos",
      dataInstalacao: "2023-08-20",
      horasUso: "1.890h",
      proximaManutencao: "2024-11-20"
    },
    {
      id: "B003",
      serie: "BC-5HP-2022-008",
      fabricante: "HidroPower",
      modelo: "Industrial HI-5000",
      potencia: "5 HP",
      capacidade: "800 L/min",
      status: "Manutenção",
      localizacao: "Oficina de Manutenção",
      responsavel: "Carlos Tech",
      dataInstalacao: "2022-03-10",
      horasUso: "3.120h",
      proximaManutencao: "Em manutenção"
    },
    {
      id: "B004",
      serie: "BC-3HP-2024-002",
      fabricante: "Bomba Tech",
      modelo: "Centrífuga CT-3000",
      potencia: "3 HP",
      capacidade: "500 L/min",
      status: "Estoque",
      localizacao: "Almoxarifado",
      endereco: "A2-P1-N3-001",
      dataInstalacao: null,
      horasUso: "0h",
      proximaManutencao: "N/A"
    }
  ],
  movimentacoes: []
};

function almoxarifadoReducer(state: AlmoxarifadoState, action: AlmoxarifadoAction): AlmoxarifadoState {
  switch (action.type) {
    case 'LOAD_DATA':
      return action.payload;
    
    case 'ADD_ITEM':
      return {
        ...state,
        itens: [...state.itens, action.payload]
      };
    
    case 'UPDATE_ITEM':
      return {
        ...state,
        itens: state.itens.map(item => 
          item.codigo === action.payload.codigo ? action.payload : item
        )
      };
    
    case 'DELETE_ITEM':
      return {
        ...state,
        itens: state.itens.filter(item => item.codigo !== action.payload)
      };
    
    case 'ADD_BOMBA':
      return {
        ...state,
        bombas: [...state.bombas, action.payload]
      };
    
    case 'UPDATE_BOMBA':
      return {
        ...state,
        bombas: state.bombas.map(bomba => 
          bomba.id === action.payload.id ? action.payload : bomba
        )
      };
    
    case 'DELETE_BOMBA':
      return {
        ...state,
        bombas: state.bombas.filter(bomba => bomba.id !== action.payload)
      };
    
    case 'ADD_MOVIMENTACAO':
      return {
        ...state,
        movimentacoes: [action.payload, ...state.movimentacoes]
      };
    
    case 'UPDATE_ITEM_QUANTITY':
      return {
        ...state,
        itens: state.itens.map(item => {
          if (item.codigo === action.payload.codigo) {
            const novaQuantidade = action.payload.tipo === 'entrada' 
              ? item.qtdAtual + action.payload.quantidade
              : item.qtdAtual - action.payload.quantidade;
            
            return {
              ...item,
              qtdAtual: Math.max(0, novaQuantidade),
              dataUltimaMovimentacao: new Date().toISOString().split('T')[0]
            };
          }
          return item;
        })
      };
    
    default:
      return state;
  }
}

interface AlmoxarifadoContextType extends AlmoxarifadoState {
  adicionarItem: (item: Omit<Item, 'dataUltimaMovimentacao'>) => void;
  atualizarItem: (item: Item) => void;
  removerItem: (codigo: string) => void;
  adicionarBomba: (bomba: Bomba) => void;
  atualizarBomba: (bomba: Bomba) => void;
  removerBomba: (id: string) => void;
  registrarMovimentacao: (movimentacao: Omit<Movimentacao, 'id' | 'data' | 'hora'>) => void;
  getItensComEstoqueBaixo: () => Item[];
  getTotalItens: () => number;
  getBombasPorStatus: (status?: Bomba['status']) => Bomba[];
  getMovimentacoesPorPeriodo: (dias: number) => Movimentacao[];
}

const AlmoxarifadoContext = createContext<AlmoxarifadoContextType | undefined>(undefined);

export function AlmoxarifadoProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(almoxarifadoReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('almoxarifado-data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        dispatch({ type: 'LOAD_DATA', payload: data });
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('almoxarifado-data', JSON.stringify(state));
  }, [state]);

  const adicionarItem = (item: Omit<Item, 'dataUltimaMovimentacao'>) => {
    const newItem: Item = {
      ...item,
      dataUltimaMovimentacao: new Date().toISOString().split('T')[0]
    };
    dispatch({ type: 'ADD_ITEM', payload: newItem });
    toast.success(`Item ${item.nome} adicionado com sucesso!`);
  };

  const atualizarItem = (item: Item) => {
    dispatch({ type: 'UPDATE_ITEM', payload: item });
    toast.success(`Item ${item.nome} atualizado com sucesso!`);
  };

  const removerItem = (codigo: string) => {
    const item = state.itens.find(i => i.codigo === codigo);
    dispatch({ type: 'DELETE_ITEM', payload: codigo });
    toast.success(`Item ${item?.nome} removido com sucesso!`);
  };

  const adicionarBomba = (bomba: Bomba) => {
    dispatch({ type: 'ADD_BOMBA', payload: bomba });
    toast.success(`Bomba ${bomba.id} adicionada com sucesso!`);
  };

  const atualizarBomba = (bomba: Bomba) => {
    dispatch({ type: 'UPDATE_BOMBA', payload: bomba });
    toast.success(`Bomba ${bomba.id} atualizada com sucesso!`);
  };

  const removerBomba = (id: string) => {
    const bomba = state.bombas.find(b => b.id === id);
    dispatch({ type: 'DELETE_BOMBA', payload: id });
    toast.success(`Bomba ${bomba?.id} removida com sucesso!`);
  };

  const registrarMovimentacao = (movData: Omit<Movimentacao, 'id' | 'data' | 'hora'>) => {
    const now = new Date();
    const movimentacao: Movimentacao = {
      ...movData,
      id: `MOV${Date.now()}`,
      data: now.toISOString().split('T')[0],
      hora: now.toTimeString().split(' ')[0].substring(0, 5)
    };

    dispatch({ type: 'ADD_MOVIMENTACAO', payload: movimentacao });
    dispatch({ 
      type: 'UPDATE_ITEM_QUANTITY', 
      payload: { 
        codigo: movData.itemCodigo, 
        quantidade: movData.quantidade, 
        tipo: movData.tipo === 'Entrada' ? 'entrada' : 'saida' 
      } 
    });

    toast.success(`${movimentacao.tipo} registrada: ${movimentacao.quantidade} ${movimentacao.unidade} de ${movimentacao.itemNome}`);
  };

  const getItensComEstoqueBaixo = () => {
    return state.itens.filter(item => item.qtdAtual <= item.qtdMinima);
  };

  const getTotalItens = () => state.itens.length;

  const getBombasPorStatus = (status?: Bomba['status']) => {
    return status ? state.bombas.filter(b => b.status === status) : state.bombas;
  };

  const getMovimentacoesPorPeriodo = (dias: number) => {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - dias);
    
    return state.movimentacoes.filter(mov => {
      const dataMov = new Date(mov.data);
      return dataMov >= dataLimite;
    });
  };

  const value: AlmoxarifadoContextType = {
    ...state,
    adicionarItem,
    atualizarItem,
    removerItem,
    adicionarBomba,
    atualizarBomba,
    removerBomba,
    registrarMovimentacao,
    getItensComEstoqueBaixo,
    getTotalItens,
    getBombasPorStatus,
    getMovimentacoesPorPeriodo
  };

  return (
    <AlmoxarifadoContext.Provider value={value}>
      {children}
    </AlmoxarifadoContext.Provider>
  );
}

export function useAlmoxarifado() {
  const context = useContext(AlmoxarifadoContext);
  if (context === undefined) {
    throw new Error('useAlmoxarifado must be used within an AlmoxarifadoProvider');
  }
  return context;
}