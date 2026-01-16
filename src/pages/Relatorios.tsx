import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAlmoxarifado } from "@/contexts/AlmoxarifadoContext";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { 
  FileText, 
  Download, 
  TrendingUp, 
  Package, 
  Settings, 
  AlertTriangle,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function Relatorios() {
  const { itens, bombas, movimentacoes, alertas, getItensComEstoqueBaixo } = useAlmoxarifado();
  const [periodo, setPeriodo] = useState("30");

  // Dados para gráfico de itens por categoria
  const itensPorCategoria = itens.reduce((acc, item) => {
    const existing = acc.find(c => c.categoria === item.categoria);
    if (existing) {
      existing.quantidade += item.qtdAtual;
      existing.itens += 1;
    } else {
      acc.push({ 
        categoria: item.categoria, 
        quantidade: item.qtdAtual, 
        itens: 1 
      });
    }
    return acc;
  }, [] as { categoria: string; quantidade: number; itens: number }[]);

  // Dados para gráfico de status das bombas
  const bombasPorStatus = bombas.reduce((acc, bomba) => {
    const existing = acc.find(s => s.status === bomba.status);
    if (existing) {
      existing.quantidade += 1;
    } else {
      acc.push({ status: bomba.status, quantidade: 1 });
    }
    return acc;
  }, [] as { status: string; quantidade: number }[]);

  // Dados para gráfico de movimentações por tipo
  const movimentacoesPorTipo = movimentacoes.reduce((acc, mov) => {
    const existing = acc.find(t => t.tipo === mov.tipo);
    if (existing) {
      existing.quantidade += mov.quantidade;
      existing.operacoes += 1;
    } else {
      acc.push({ tipo: mov.tipo, quantidade: mov.quantidade, operacoes: 1 });
    }
    return acc;
  }, [] as { tipo: string; quantidade: number; operacoes: number }[]);

  // Dados para gráfico de movimentações por dia (últimos 7 dias)
  const ultimos7Dias = Array.from({ length: 7 }, (_, i) => {
    const data = new Date();
    data.setDate(data.getDate() - (6 - i));
    return data.toISOString().split('T')[0];
  });

  const movimentacoesPorDia = ultimos7Dias.map(dia => {
    const movsDia = movimentacoes.filter(m => m.data === dia);
    const entradas = movsDia.filter(m => m.tipo === 'Entrada').reduce((acc, m) => acc + m.quantidade, 0);
    const saidas = movsDia.filter(m => m.tipo === 'Saída').reduce((acc, m) => acc + m.quantidade, 0);
    return {
      data: new Date(dia).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' }),
      entradas,
      saidas
    };
  });

  // Dados para gráfico de alertas por prioridade
  const alertasPorPrioridade = alertas.reduce((acc, alerta) => {
    const existing = acc.find(p => p.prioridade === alerta.prioridade);
    if (existing) {
      existing.quantidade += 1;
    } else {
      acc.push({ prioridade: alerta.prioridade, quantidade: 1 });
    }
    return acc;
  }, [] as { prioridade: string; quantidade: number }[]);

  // Dados para gráfico de alertas por status
  const alertasPorStatus = alertas.reduce((acc, alerta) => {
    const existing = acc.find(s => s.status === alerta.status);
    if (existing) {
      existing.quantidade += 1;
    } else {
      acc.push({ status: alerta.status, quantidade: 1 });
    }
    return acc;
  }, [] as { status: string; quantidade: number }[]);

  // Dados para gráfico de estoque por fornecedor
  const estoquePorFornecedor = itens.reduce((acc, item) => {
    const existing = acc.find(f => f.fornecedor === item.fornecedor);
    if (existing) {
      existing.quantidade += item.qtdAtual;
      existing.valor += item.qtdAtual * 50; // valor estimado
    } else {
      acc.push({ 
        fornecedor: item.fornecedor, 
        quantidade: item.qtdAtual,
        valor: item.qtdAtual * 50
      });
    }
    return acc;
  }, [] as { fornecedor: string; quantidade: number; valor: number }[]);

  // Dados para gráfico de bombas por fabricante
  const bombasPorFabricante = bombas.reduce((acc, bomba) => {
    const existing = acc.find(f => f.fabricante === bomba.fabricante);
    if (existing) {
      existing.quantidade += 1;
    } else {
      acc.push({ fabricante: bomba.fabricante, quantidade: 1 });
    }
    return acc;
  }, [] as { fabricante: string; quantidade: number }[]);

  // Dados para gráfico de movimentações por responsável
  const movimentacoesPorResponsavel = movimentacoes.reduce((acc, mov) => {
    const existing = acc.find(r => r.responsavel === mov.responsavel);
    if (existing) {
      existing.operacoes += 1;
      existing.quantidade += mov.quantidade;
    } else {
      acc.push({ responsavel: mov.responsavel, operacoes: 1, quantidade: mov.quantidade });
    }
    return acc;
  }, [] as { responsavel: string; operacoes: number; quantidade: number }[]);

  const itensEstoqueBaixo = getItensComEstoqueBaixo();

  // Estatísticas gerais
  const estatisticas = {
    totalItens: itens.length,
    totalUnidades: itens.reduce((acc, i) => acc + i.qtdAtual, 0),
    totalBombas: bombas.length,
    bombasOperando: bombas.filter(b => b.status === 'Operando').length,
    totalMovimentacoes: movimentacoes.length,
    alertasPendentes: alertas.filter(a => a.status !== 'Resolvido').length,
    itensEstoqueBaixo: itensEstoqueBaixo.length
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            Relatórios
          </h1>
          <p className="text-muted-foreground">
            Análise detalhada do almoxarifado SAAE
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
              <SelectItem value="365">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline"
            onClick={() => {
              const relatorio = `
RELATÓRIO DO ALMOXARIFADO SAAE
==============================
Data: ${new Date().toLocaleDateString('pt-BR')}
Período: Últimos ${periodo} dias

RESUMO GERAL
-------------
Total de Itens Cadastrados: ${estatisticas.totalItens}
Total de Unidades em Estoque: ${estatisticas.totalUnidades}
Total de Bombas: ${estatisticas.totalBombas}
Bombas em Operação: ${estatisticas.bombasOperando}
Total de Movimentações: ${estatisticas.totalMovimentacoes}
Alertas Pendentes: ${estatisticas.alertasPendentes}
Itens com Estoque Baixo: ${estatisticas.itensEstoqueBaixo}

ITENS POR CATEGORIA
-------------------
${itensPorCategoria.map(c => `${c.categoria}: ${c.itens} itens (${c.quantidade} unidades)`).join('\n')}

BOMBAS POR STATUS
-----------------
${bombasPorStatus.map(s => `${s.status}: ${s.quantidade}`).join('\n')}

==============================
Relatório gerado automaticamente
              `;
              alert(relatorio);
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center">
              <Package className="h-6 w-6 text-primary mb-2" />
              <p className="text-2xl font-bold">{estatisticas.totalItens}</p>
              <p className="text-xs text-muted-foreground text-center">Tipos de Itens</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center">
              <BarChart3 className="h-6 w-6 text-success mb-2" />
              <p className="text-2xl font-bold">{estatisticas.totalUnidades}</p>
              <p className="text-xs text-muted-foreground text-center">Unidades Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center">
              <Settings className="h-6 w-6 text-primary mb-2" />
              <p className="text-2xl font-bold">{estatisticas.totalBombas}</p>
              <p className="text-xs text-muted-foreground text-center">Bombas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center">
              <Settings className="h-6 w-6 text-success mb-2" />
              <p className="text-2xl font-bold">{estatisticas.bombasOperando}</p>
              <p className="text-xs text-muted-foreground text-center">Operando</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center">
              <TrendingUp className="h-6 w-6 text-warning mb-2" />
              <p className="text-2xl font-bold">{estatisticas.totalMovimentacoes}</p>
              <p className="text-xs text-muted-foreground text-center">Movimentações</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center">
              <AlertTriangle className="h-6 w-6 text-destructive mb-2" />
              <p className="text-2xl font-bold">{estatisticas.alertasPendentes}</p>
              <p className="text-xs text-muted-foreground text-center">Alertas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center">
              <Package className="h-6 w-6 text-destructive mb-2" />
              <p className="text-2xl font-bold">{estatisticas.itensEstoqueBaixo}</p>
              <p className="text-xs text-muted-foreground text-center">Estoque Baixo</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="estoque" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="estoque">Estoque</TabsTrigger>
          <TabsTrigger value="bombas">Bombas</TabsTrigger>
          <TabsTrigger value="movimentacoes">Movimentações</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
        </TabsList>

        {/* Tab Estoque */}
        <TabsContent value="estoque" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Itens por Categoria
                </CardTitle>
                <CardDescription>Distribuição de itens cadastrados</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={itensPorCategoria}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ categoria, itens }) => `${categoria}: ${itens}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="itens"
                    >
                      {itensPorCategoria.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Quantidade por Categoria
                </CardTitle>
                <CardDescription>Volume de estoque por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={itensPorCategoria}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="categoria" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantidade" fill="#0088FE" name="Quantidade" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Estoque por Fornecedor
                </CardTitle>
                <CardDescription>Distribuição de itens por fornecedor</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={estoquePorFornecedor} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="fornecedor" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantidade" fill="#00C49F" name="Quantidade" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Tabela de itens com estoque baixo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Itens com Estoque Baixo
              </CardTitle>
              <CardDescription>Itens que precisam de reposição</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Código</th>
                      <th className="text-left p-2">Nome</th>
                      <th className="text-left p-2">Categoria</th>
                      <th className="text-center p-2">Atual</th>
                      <th className="text-center p-2">Mínimo</th>
                      <th className="text-center p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itensEstoqueBaixo.map(item => (
                      <tr key={item.codigo} className="border-b">
                        <td className="p-2 font-mono">{item.codigo}</td>
                        <td className="p-2">{item.nome}</td>
                        <td className="p-2">{item.categoria}</td>
                        <td className="p-2 text-center font-bold">{item.qtdAtual}</td>
                        <td className="p-2 text-center">{item.qtdMinima}</td>
                        <td className="p-2 text-center">
                          <Badge variant={item.qtdAtual === 0 ? "destructive" : "secondary"}>
                            {item.qtdAtual === 0 ? "Esgotado" : "Baixo"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    {itensEstoqueBaixo.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center p-4 text-muted-foreground">
                          Nenhum item com estoque baixo
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Bombas */}
        <TabsContent value="bombas" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Bombas por Status
                </CardTitle>
                <CardDescription>Situação atual das bombas</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={bombasPorStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, quantidade }) => `${status}: ${quantidade}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="quantidade"
                    >
                      {bombasPorStatus.map((entry, index) => {
                        let color = COLORS[index % COLORS.length];
                        if (entry.status === 'Operando') color = '#00C49F';
                        if (entry.status === 'Manutenção') color = '#FFBB28';
                        if (entry.status === 'Estoque') color = '#0088FE';
                        if (entry.status === 'Descartada') color = '#FF8042';
                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Bombas por Fabricante
                </CardTitle>
                <CardDescription>Distribuição por fabricante</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={bombasPorFabricante}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fabricante" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantidade" fill="#8884d8" name="Quantidade" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Lista detalhada de bombas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Detalhamento das Bombas
              </CardTitle>
              <CardDescription>Informações completas de todas as bombas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">ID</th>
                      <th className="text-left p-2">Modelo</th>
                      <th className="text-left p-2">Fabricante</th>
                      <th className="text-left p-2">Potência</th>
                      <th className="text-left p-2">Localização</th>
                      <th className="text-left p-2">Horas de Uso</th>
                      <th className="text-center p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bombas.map(bomba => (
                      <tr key={bomba.id} className="border-b">
                        <td className="p-2 font-mono">{bomba.id}</td>
                        <td className="p-2">{bomba.modelo}</td>
                        <td className="p-2">{bomba.fabricante}</td>
                        <td className="p-2">{bomba.potencia}</td>
                        <td className="p-2">{bomba.localizacao}</td>
                        <td className="p-2">{bomba.horasUso}</td>
                        <td className="p-2 text-center">
                          <Badge 
                            variant={
                              bomba.status === 'Operando' ? 'default' :
                              bomba.status === 'Manutenção' ? 'secondary' :
                              bomba.status === 'Estoque' ? 'outline' : 'destructive'
                            }
                          >
                            {bomba.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Movimentações */}
        <TabsContent value="movimentacoes" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Movimentações por Tipo
                </CardTitle>
                <CardDescription>Entradas vs Saídas</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={movimentacoesPorTipo}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ tipo, operacoes }) => `${tipo}: ${operacoes}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="operacoes"
                    >
                      {movimentacoesPorTipo.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.tipo === 'Entrada' ? '#00C49F' : '#FF8042'} 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Movimentações por Dia
                </CardTitle>
                <CardDescription>Últimos 7 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={movimentacoesPorDia}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="entradas" stackId="1" stroke="#00C49F" fill="#00C49F" name="Entradas" />
                    <Area type="monotone" dataKey="saidas" stackId="2" stroke="#FF8042" fill="#FF8042" name="Saídas" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Movimentações por Responsável
                </CardTitle>
                <CardDescription>Atividade por colaborador</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={movimentacoesPorResponsavel}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="responsavel" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="operacoes" fill="#0088FE" name="Operações" />
                    <Bar dataKey="quantidade" fill="#00C49F" name="Quantidade Total" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Alertas */}
        <TabsContent value="alertas" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Alertas por Prioridade
                </CardTitle>
                <CardDescription>Distribuição de alertas</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={alertasPorPrioridade}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ prioridade, quantidade }) => `${prioridade}: ${quantidade}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="quantidade"
                    >
                      {alertasPorPrioridade.map((entry, index) => {
                        let color = COLORS[index % COLORS.length];
                        if (entry.prioridade === 'Alta') color = '#FF8042';
                        if (entry.prioridade === 'Média') color = '#FFBB28';
                        if (entry.prioridade === 'Baixa') color = '#00C49F';
                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Alertas por Status
                </CardTitle>
                <CardDescription>Situação dos alertas</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={alertasPorStatus}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantidade" fill="#8884d8" name="Quantidade">
                      {alertasPorStatus.map((entry, index) => {
                        let color = COLORS[index % COLORS.length];
                        if (entry.status === 'Pendente') color = '#FF8042';
                        if (entry.status === 'Em Andamento') color = '#FFBB28';
                        if (entry.status === 'Resolvido') color = '#00C49F';
                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
