// ===========================================
// DADOS MOCKADOS - Sistema de Almoxarifado SAAE
// ===========================================
// Este arquivo contém todos os dados de exemplo
// para simular o funcionamento do sistema
// ===========================================

import { Item, Bomba, Movimentacao, Usuario, Alerta } from '@/types';

// ============= ITENS DO ALMOXARIFADO =============
export const mockItens: Item[] = [
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
    endereco: "B1-P2-N1-005",
    dataUltimaMovimentacao: "2024-01-18"
  },
  {
    codigo: "HID003",
    nome: "Tubo PVC 100mm",
    categoria: "Hidráulica",
    unidade: "metro",
    fornecedor: "Hidro Parts",
    qtdAtual: 120,
    qtdMinima: 50,
    endereco: "B1-P3-N1-001",
    dataUltimaMovimentacao: "2024-01-15"
  },
  {
    codigo: "HID004",
    nome: "Válvula de Retenção 2\"",
    categoria: "Hidráulica",
    unidade: "unidade",
    fornecedor: "ValvuTech",
    qtdAtual: 8,
    qtdMinima: 10,
    endereco: "B2-P1-N2-003",
    dataUltimaMovimentacao: "2024-01-12"
  },
  {
    codigo: "ELE001",
    nome: "Cabo Flexível 4mm",
    categoria: "Elétrica",
    unidade: "metro",
    fornecedor: "ElectroMax",
    qtdAtual: 180,
    qtdMinima: 100,
    endereco: "C3-P1-N2-010",
    dataUltimaMovimentacao: "2024-01-19"
  },
  {
    codigo: "ELE002",
    nome: "Disjuntor 32A",
    categoria: "Elétrica",
    unidade: "unidade",
    fornecedor: "ElectroMax",
    qtdAtual: 15,
    qtdMinima: 8,
    endereco: "C3-P2-N1-005",
    dataUltimaMovimentacao: "2024-01-17"
  },
  {
    codigo: "ELE003",
    nome: "Contator 25A",
    categoria: "Elétrica",
    unidade: "unidade",
    fornecedor: "WEG Industrial",
    qtdAtual: 3,
    qtdMinima: 5,
    endereco: "C3-P2-N2-001",
    dataUltimaMovimentacao: "2024-01-10"
  },
  {
    codigo: "FER001",
    nome: "Chave de Fenda 8mm",
    categoria: "Ferramentas",
    unidade: "unidade",
    fornecedor: "Tool Master",
    qtdAtual: 8,
    qtdMinima: 10,
    endereco: "D1-P3-N1-002",
    dataUltimaMovimentacao: "2024-01-14"
  },
  {
    codigo: "FER002",
    nome: "Alicate Universal",
    categoria: "Ferramentas",
    unidade: "unidade",
    fornecedor: "Tool Master",
    qtdAtual: 12,
    qtdMinima: 8,
    endereco: "D1-P3-N1-003",
    dataUltimaMovimentacao: "2024-01-16"
  },
  {
    codigo: "FER003",
    nome: "Trena 5m",
    categoria: "Ferramentas",
    unidade: "unidade",
    fornecedor: "Stanley Brasil",
    qtdAtual: 6,
    qtdMinima: 4,
    endereco: "D1-P3-N2-001",
    dataUltimaMovimentacao: "2024-01-13"
  },
  {
    codigo: "EPI001",
    nome: "Capacete de Segurança",
    categoria: "EPI",
    unidade: "unidade",
    fornecedor: "Safety First",
    qtdAtual: 25,
    qtdMinima: 15,
    endereco: "E2-P1-N4-001",
    dataUltimaMovimentacao: "2024-01-11"
  },
  {
    codigo: "EPI002",
    nome: "Luvas de Proteção",
    categoria: "EPI",
    unidade: "par",
    fornecedor: "Safety First",
    qtdAtual: 40,
    qtdMinima: 20,
    endereco: "E2-P1-N4-002",
    dataUltimaMovimentacao: "2024-01-18"
  },
  {
    codigo: "EPI003",
    nome: "Óculos de Proteção",
    categoria: "EPI",
    unidade: "unidade",
    fornecedor: "Safety First",
    qtdAtual: 18,
    qtdMinima: 12,
    endereco: "E2-P1-N4-003",
    dataUltimaMovimentacao: "2024-01-19"
  }
];

// ============= BOMBAS DE ÁGUA =============
export const mockBombas: Bomba[] = [
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
    horasUso: "0h",
    proximaManutencao: "N/A"
  },
  {
    id: "B005",
    serie: "BC-4HP-2023-012",
    fabricante: "AquaTech",
    modelo: "Centrífuga AT-4000",
    potencia: "4 HP",
    capacidade: "650 L/min",
    status: "Operando",
    localizacao: "Estação de Recalque Sul",
    responsavel: "Pedro Oliveira",
    dataInstalacao: "2023-05-10",
    horasUso: "2.100h",
    proximaManutencao: "2024-10-10"
  },
  {
    id: "B006",
    serie: "BC-2HP-2024-003",
    fabricante: "HidroPower",
    modelo: "Submersível HP-2500",
    potencia: "2.5 HP",
    capacidade: "350 L/min",
    status: "Estoque",
    localizacao: "Almoxarifado",
    endereco: "A2-P1-N3-002",
    horasUso: "0h",
    proximaManutencao: "N/A"
  }
];

// ============= MOVIMENTAÇÕES =============
export const mockMovimentacoes: Movimentacao[] = [
  {
    id: "MOV001",
    tipo: "Entrada",
    itemCodigo: "HID002",
    itemNome: "Conexão PVC 50mm",
    quantidade: 50,
    unidade: "unidade",
    responsavel: "João Silva",
    setor: "Almoxarifado",
    data: "2024-01-20",
    hora: "08:30",
    notaFiscal: "NF-2024-001234",
    fornecedor: "Hidro Parts",
    observacao: "Reposição de estoque mensal"
  },
  {
    id: "MOV002",
    tipo: "Saída",
    itemCodigo: "ELE001",
    itemNome: "Cabo Flexível 4mm",
    quantidade: 30,
    unidade: "metro",
    responsavel: "Maria Santos",
    setor: "Manutenção Elétrica",
    data: "2024-01-20",
    hora: "10:15",
    observacao: "Manutenção preventiva ETA Central"
  },
  {
    id: "MOV003",
    tipo: "Saída",
    itemCodigo: "FER001",
    itemNome: "Chave de Fenda 8mm",
    quantidade: 2,
    unidade: "unidade",
    responsavel: "Carlos Tech",
    setor: "Equipe de Campo",
    data: "2024-01-19",
    hora: "14:00",
    observacao: "Substituição de ferramentas danificadas"
  },
  {
    id: "MOV004",
    tipo: "Entrada",
    itemCodigo: "EPI001",
    itemNome: "Capacete de Segurança",
    quantidade: 20,
    unidade: "unidade",
    responsavel: "Ana Paula",
    setor: "Almoxarifado",
    data: "2024-01-18",
    hora: "09:45",
    notaFiscal: "NF-2024-001198",
    fornecedor: "Safety First",
    observacao: "Compra trimestral de EPIs"
  },
  {
    id: "MOV005",
    tipo: "Saída",
    itemCodigo: "HID004",
    itemNome: "Válvula de Retenção 2\"",
    quantidade: 3,
    unidade: "unidade",
    responsavel: "Pedro Oliveira",
    setor: "Manutenção Hidráulica",
    data: "2024-01-17",
    hora: "11:30",
    observacao: "Substituição emergencial - Poço Norte"
  },
  {
    id: "MOV006",
    tipo: "Entrada",
    itemCodigo: "ELE003",
    itemNome: "Contator 25A",
    quantidade: 5,
    unidade: "unidade",
    responsavel: "João Silva",
    setor: "Almoxarifado",
    data: "2024-01-15",
    hora: "08:00",
    notaFiscal: "NF-2024-001150",
    fornecedor: "WEG Industrial",
    observacao: "Reposição de componentes elétricos"
  }
];

// ============= USUÁRIOS DO SISTEMA =============
export const mockUsuarios: Usuario[] = [
  {
    id: "USR001",
    nome: "João Silva",
    email: "joao.silva@saae.gov.br",
    perfil: "Almoxarife",
    setor: "Almoxarifado Central",
    status: "Ativo",
    ultimoAcesso: "2024-01-20 08:30",
    dataCadastro: "2023-01-15"
  },
  {
    id: "USR002",
    nome: "Maria Santos",
    email: "maria.santos@saae.gov.br",
    perfil: "Gestor",
    setor: "Gerência de Manutenção",
    status: "Ativo",
    ultimoAcesso: "2024-01-20 09:15",
    dataCadastro: "2022-06-20"
  },
  {
    id: "USR003",
    nome: "Carlos Tech",
    email: "carlos.tech@saae.gov.br",
    perfil: "Técnico",
    setor: "Manutenção Elétrica",
    status: "Ativo",
    ultimoAcesso: "2024-01-19 16:45",
    dataCadastro: "2023-03-10"
  },
  {
    id: "USR004",
    nome: "Ana Paula",
    email: "ana.paula@saae.gov.br",
    perfil: "Almoxarife",
    setor: "Almoxarifado Central",
    status: "Ativo",
    ultimoAcesso: "2024-01-20 07:50",
    dataCadastro: "2023-08-05"
  },
  {
    id: "USR005",
    nome: "Pedro Oliveira",
    email: "pedro.oliveira@saae.gov.br",
    perfil: "Técnico",
    setor: "Manutenção Hidráulica",
    status: "Ativo",
    ultimoAcesso: "2024-01-18 14:20",
    dataCadastro: "2022-11-12"
  },
  {
    id: "USR006",
    nome: "Roberto Lima",
    email: "roberto.lima@saae.gov.br",
    perfil: "Gestor",
    setor: "Diretoria Técnica",
    status: "Inativo",
    ultimoAcesso: "2024-01-10 10:00",
    dataCadastro: "2021-04-18"
  }
];

// ============= ALERTAS DO SISTEMA =============
export const mockAlertas: Alerta[] = [
  {
    id: "ALT001",
    tipo: "Estoque Baixo",
    prioridade: "Alta",
    titulo: "Bomba Centrífuga 3HP - Estoque Crítico",
    descricao: "Quantidade atual (2) abaixo do mínimo (5). Solicitar reposição urgente.",
    itemCodigo: "HID001",
    dataGeracao: "2024-01-20 08:00",
    status: "Pendente",
    responsavel: "João Silva"
  },
  {
    id: "ALT002",
    tipo: "Estoque Baixo",
    prioridade: "Média",
    titulo: "Válvula de Retenção 2\" - Estoque Baixo",
    descricao: "Quantidade atual (8) próxima do mínimo (10). Programar reposição.",
    itemCodigo: "HID004",
    dataGeracao: "2024-01-19 14:30",
    status: "Pendente",
    responsavel: "João Silva"
  },
  {
    id: "ALT003",
    tipo: "Manutenção",
    prioridade: "Alta",
    titulo: "Bomba B003 - Manutenção em Andamento",
    descricao: "Bomba Industrial HI-5000 em manutenção desde 15/01. Previsão de retorno: 25/01.",
    bombaId: "B003",
    dataGeracao: "2024-01-15 10:00",
    status: "Em Andamento",
    responsavel: "Carlos Tech"
  },
  {
    id: "ALT004",
    tipo: "Estoque Baixo",
    prioridade: "Média",
    titulo: "Contator 25A - Estoque Baixo",
    descricao: "Quantidade atual (3) abaixo do mínimo (5). Solicitar cotação.",
    itemCodigo: "ELE003",
    dataGeracao: "2024-01-18 11:00",
    status: "Pendente",
    responsavel: "Ana Paula"
  },
  {
    id: "ALT005",
    tipo: "Estoque Baixo",
    prioridade: "Média",
    titulo: "Chave de Fenda 8mm - Estoque Baixo",
    descricao: "Quantidade atual (8) abaixo do mínimo (10). Incluir na próxima compra.",
    itemCodigo: "FER001",
    dataGeracao: "2024-01-17 09:00",
    status: "Resolvido",
    responsavel: "João Silva"
  },
  {
    id: "ALT006",
    tipo: "Manutenção",
    prioridade: "Baixa",
    titulo: "Bomba B002 - Manutenção Preventiva Próxima",
    descricao: "Manutenção preventiva programada para 20/11/2024. Agendar serviço.",
    bombaId: "B002",
    dataGeracao: "2024-01-10 08:00",
    status: "Pendente",
    responsavel: "Pedro Oliveira"
  }
];

// ============= CATEGORIAS =============
export const categorias = [
  "Bombas",
  "Hidráulica",
  "Elétrica",
  "Ferramentas",
  "EPI",
  "Químicos",
  "Tubulação",
  "Válvulas"
];

// ============= SETORES =============
export const setores = [
  "Almoxarifado Central",
  "Manutenção Elétrica",
  "Manutenção Hidráulica",
  "ETA Central",
  "Equipe de Campo",
  "Gerência de Manutenção",
  "Diretoria Técnica"
];

// ============= FORNECEDORES =============
export const fornecedores = [
  "Bomba Tech",
  "AquaTech",
  "HidroPower",
  "Hidro Parts",
  "ElectroMax",
  "WEG Industrial",
  "Tool Master",
  "Stanley Brasil",
  "Safety First",
  "ValvuTech"
];

// ============= LOCALIZAÇÕES DAS BOMBAS =============
export const localizacoesBombas = [
  "ETA Central - Bomba Principal",
  "ETA Central - Bomba Reserva",
  "Poço Artesiano Norte",
  "Poço Artesiano Sul",
  "Estação de Recalque Sul",
  "Estação de Recalque Norte",
  "Reservatório Central",
  "Almoxarifado",
  "Oficina de Manutenção"
];

// ============= PERFIS DE USUÁRIO =============
export const perfisUsuario = [
  "Almoxarife",
  "Gestor",
  "Técnico",
  "Administrador"
];
