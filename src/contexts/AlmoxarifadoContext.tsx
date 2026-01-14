import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  Item, 
  Bomba, 
  Movimentacao, 
  Usuario, 
  Alerta,
  AlmoxarifadoState,
  AlmoxarifadoAction
} from '@/types';
import { 
  mockItens, 
  mockBombas, 
  mockMovimentacoes,
  mockUsuarios,
  mockAlertas
} from '@/data/mockData';

// Re-export types for backward compatibility
export type { Item, Bomba, Movimentacao, Usuario, Alerta };

const initialState: AlmoxarifadoState = {
  itens: mockItens,
  bombas: mockBombas,
  movimentacoes: mockMovimentacoes,
  usuarios: mockUsuarios,
  alertas: mockAlertas
};

function almoxarifadoReducer(state: AlmoxarifadoState, action: AlmoxarifadoAction): AlmoxarifadoState {
  switch (action.type) {
    case 'LOAD_DATA':
      return action.payload;
    
    case 'ADD_ITEM':
      return { ...state, itens: [...state.itens, action.payload] };
    
    case 'UPDATE_ITEM':
      return {
        ...state,
        itens: state.itens.map(item => 
          item.codigo === action.payload.codigo ? action.payload : item
        )
      };
    
    case 'DELETE_ITEM':
      return { ...state, itens: state.itens.filter(item => item.codigo !== action.payload) };
    
    case 'ADD_BOMBA':
      return { ...state, bombas: [...state.bombas, action.payload] };
    
    case 'UPDATE_BOMBA':
      return {
        ...state,
        bombas: state.bombas.map(bomba => 
          bomba.id === action.payload.id ? action.payload : bomba
        )
      };
    
    case 'DELETE_BOMBA':
      return { ...state, bombas: state.bombas.filter(bomba => bomba.id !== action.payload) };
    
    case 'ADD_MOVIMENTACAO':
      return { ...state, movimentacoes: [action.payload, ...state.movimentacoes] };
    
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
    
    case 'ADD_USUARIO':
      return { ...state, usuarios: [...state.usuarios, action.payload] };
    
    case 'UPDATE_USUARIO':
      return {
        ...state,
        usuarios: state.usuarios.map(usuario => 
          usuario.id === action.payload.id ? action.payload : usuario
        )
      };
    
    case 'DELETE_USUARIO':
      return { ...state, usuarios: state.usuarios.filter(usuario => usuario.id !== action.payload) };
    
    case 'ADD_ALERTA':
      return { ...state, alertas: [action.payload, ...state.alertas] };
    
    case 'UPDATE_ALERTA':
      return {
        ...state,
        alertas: state.alertas.map(alerta => 
          alerta.id === action.payload.id ? action.payload : alerta
        )
      };
    
    case 'DELETE_ALERTA':
      return { ...state, alertas: state.alertas.filter(alerta => alerta.id !== action.payload) };
    
    default:
      return state;
  }
}

interface AlmoxarifadoContextType extends AlmoxarifadoState {
  // Item operations
  adicionarItem: (item: Omit<Item, 'dataUltimaMovimentacao'>) => void;
  atualizarItem: (item: Item) => void;
  removerItem: (codigo: string) => void;
  
  // Bomba operations
  adicionarBomba: (bomba: Bomba) => void;
  atualizarBomba: (bomba: Bomba) => void;
  removerBomba: (id: string) => void;
  
  // Movimentacao operations
  registrarMovimentacao: (movimentacao: Omit<Movimentacao, 'id' | 'data' | 'hora'>) => void;
  
  // Usuario operations
  adicionarUsuario: (usuario: Omit<Usuario, 'id' | 'dataCadastro' | 'ultimoAcesso'>) => void;
  atualizarUsuario: (usuario: Usuario) => void;
  removerUsuario: (id: string) => void;
  
  // Alerta operations
  adicionarAlerta: (alerta: Omit<Alerta, 'id' | 'dataGeracao'>) => void;
  atualizarAlerta: (alerta: Alerta) => void;
  removerAlerta: (id: string) => void;
  resolverAlerta: (id: string) => void;
  
  // Getters
  getItensComEstoqueBaixo: () => Item[];
  getTotalItens: () => number;
  getBombasPorStatus: (status?: Bomba['status']) => Bomba[];
  getMovimentacoesPorPeriodo: (dias: number) => Movimentacao[];
  getAlertasPendentes: () => Alerta[];
  getUsuariosAtivos: () => Usuario[];
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
        // Ensure all required fields exist
        const loadedData: AlmoxarifadoState = {
          itens: data.itens || mockItens,
          bombas: data.bombas || mockBombas,
          movimentacoes: data.movimentacoes || mockMovimentacoes,
          usuarios: data.usuarios || mockUsuarios,
          alertas: data.alertas || mockAlertas
        };
        dispatch({ type: 'LOAD_DATA', payload: loadedData });
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('almoxarifado-data', JSON.stringify(state));
  }, [state]);

  // Check for low stock and create alerts automatically
  useEffect(() => {
    const itensEstoqueBaixo = state.itens.filter(item => item.qtdAtual <= item.qtdMinima);
    itensEstoqueBaixo.forEach(item => {
      const alertaExistente = state.alertas.find(
        a => a.itemCodigo === item.codigo && a.status !== 'Resolvido'
      );
      if (!alertaExistente) {
        const novoAlerta: Alerta = {
          id: `ALT${Date.now()}${item.codigo}`,
          tipo: 'Estoque Baixo',
          prioridade: item.qtdAtual === 0 ? 'Alta' : 'Média',
          titulo: `${item.nome} - Estoque ${item.qtdAtual === 0 ? 'Esgotado' : 'Baixo'}`,
          descricao: `Quantidade atual (${item.qtdAtual}) ${item.qtdAtual <= item.qtdMinima ? 'abaixo' : 'igual'} ao mínimo (${item.qtdMinima}).`,
          itemCodigo: item.codigo,
          dataGeracao: new Date().toISOString().replace('T', ' ').substring(0, 16),
          status: 'Pendente',
          responsavel: 'Sistema'
        };
        dispatch({ type: 'ADD_ALERTA', payload: novoAlerta });
      }
    });
  }, [state.itens]);

  // Item operations
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

  // Bomba operations
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

  // Movimentacao operations
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

  // Usuario operations
  const adicionarUsuario = (userData: Omit<Usuario, 'id' | 'dataCadastro' | 'ultimoAcesso'>) => {
    const now = new Date();
    const usuario: Usuario = {
      ...userData,
      id: `USR${Date.now()}`,
      dataCadastro: now.toISOString().split('T')[0],
      ultimoAcesso: now.toISOString().replace('T', ' ').substring(0, 16)
    };
    dispatch({ type: 'ADD_USUARIO', payload: usuario });
    toast.success(`Usuário ${usuario.nome} adicionado com sucesso!`);
  };

  const atualizarUsuario = (usuario: Usuario) => {
    dispatch({ type: 'UPDATE_USUARIO', payload: usuario });
    toast.success(`Usuário ${usuario.nome} atualizado com sucesso!`);
  };

  const removerUsuario = (id: string) => {
    const usuario = state.usuarios.find(u => u.id === id);
    dispatch({ type: 'DELETE_USUARIO', payload: id });
    toast.success(`Usuário ${usuario?.nome} removido com sucesso!`);
  };

  // Alerta operations
  const adicionarAlerta = (alertaData: Omit<Alerta, 'id' | 'dataGeracao'>) => {
    const alerta: Alerta = {
      ...alertaData,
      id: `ALT${Date.now()}`,
      dataGeracao: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    dispatch({ type: 'ADD_ALERTA', payload: alerta });
    toast.success(`Alerta criado com sucesso!`);
  };

  const atualizarAlerta = (alerta: Alerta) => {
    dispatch({ type: 'UPDATE_ALERTA', payload: alerta });
    toast.success(`Alerta atualizado com sucesso!`);
  };

  const removerAlerta = (id: string) => {
    dispatch({ type: 'DELETE_ALERTA', payload: id });
    toast.success(`Alerta removido com sucesso!`);
  };

  const resolverAlerta = (id: string) => {
    const alerta = state.alertas.find(a => a.id === id);
    if (alerta) {
      dispatch({ type: 'UPDATE_ALERTA', payload: { ...alerta, status: 'Resolvido' } });
      toast.success(`Alerta marcado como resolvido!`);
    }
  };

  // Getters
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

  const getAlertasPendentes = () => {
    return state.alertas.filter(a => a.status !== 'Resolvido');
  };

  const getUsuariosAtivos = () => {
    return state.usuarios.filter(u => u.status === 'Ativo');
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
    adicionarUsuario,
    atualizarUsuario,
    removerUsuario,
    adicionarAlerta,
    atualizarAlerta,
    removerAlerta,
    resolverAlerta,
    getItensComEstoqueBaixo,
    getTotalItens,
    getBombasPorStatus,
    getMovimentacoesPorPeriodo,
    getAlertasPendentes,
    getUsuariosAtivos
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
