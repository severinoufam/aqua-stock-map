import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAlmoxarifado } from "@/contexts/AlmoxarifadoContext";
import { AlertTriangle, CheckCircle, Clock, Search, Bell, Package, Settings } from "lucide-react";

export default function Alertas() {
  const { alertas, resolverAlerta, removerAlerta } = useAlmoxarifado();
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroPrioridade, setFiltroPrioridade] = useState("todos");

  const alertasFiltrados = alertas.filter(a => {
    const matchBusca = a.titulo.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === "todos" || a.status === filtroStatus;
    const matchPrioridade = filtroPrioridade === "todos" || a.prioridade === filtroPrioridade;
    return matchBusca && matchStatus && matchPrioridade;
  });

  const getIcone = (tipo: string) => {
    if (tipo === 'Estoque Baixo') return <Package className="h-5 w-5" />;
    if (tipo === 'Manutenção') return <Settings className="h-5 w-5" />;
    return <Bell className="h-5 w-5" />;
  };

  const getPrioridadeCor = (prioridade: string) => {
    if (prioridade === 'Alta') return 'destructive';
    if (prioridade === 'Média') return 'secondary';
    return 'outline';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Resolvido') return <CheckCircle className="h-4 w-4 text-success" />;
    if (status === 'Em Andamento') return <Clock className="h-4 w-4 text-warning" />;
    return <AlertTriangle className="h-4 w-4 text-destructive" />;
  };

  const pendentes = alertas.filter(a => a.status === 'Pendente').length;
  const emAndamento = alertas.filter(a => a.status === 'Em Andamento').length;
  const resolvidos = alertas.filter(a => a.status === 'Resolvido').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-warning" />
            Alertas
          </h1>
          <p className="text-muted-foreground">Gerenciamento de alertas do sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4 text-center"><AlertTriangle className="h-6 w-6 text-destructive mx-auto mb-2" /><p className="text-2xl font-bold">{pendentes}</p><p className="text-xs text-muted-foreground">Pendentes</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><Clock className="h-6 w-6 text-warning mx-auto mb-2" /><p className="text-2xl font-bold">{emAndamento}</p><p className="text-xs text-muted-foreground">Em Andamento</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><CheckCircle className="h-6 w-6 text-success mx-auto mb-2" /><p className="text-2xl font-bold">{resolvidos}</p><p className="text-xs text-muted-foreground">Resolvidos</p></CardContent></Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input placeholder="Buscar alertas..." className="pl-10" value={busca} onChange={e => setBusca(e.target.value)} /></div>
        <Select value={filtroStatus} onValueChange={setFiltroStatus}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="todos">Todos Status</SelectItem><SelectItem value="Pendente">Pendente</SelectItem><SelectItem value="Em Andamento">Em Andamento</SelectItem><SelectItem value="Resolvido">Resolvido</SelectItem></SelectContent></Select>
        <Select value={filtroPrioridade} onValueChange={setFiltroPrioridade}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="todos">Todas Prioridades</SelectItem><SelectItem value="Alta">Alta</SelectItem><SelectItem value="Média">Média</SelectItem><SelectItem value="Baixa">Baixa</SelectItem></SelectContent></Select>
      </div>

      <div className="space-y-4">
        {alertasFiltrados.map(alerta => (
          <Card key={alerta.id} className={alerta.status === 'Resolvido' ? 'opacity-60' : ''}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getIcone(alerta.tipo)}
                  <div>
                    <CardTitle className="text-lg">{alerta.titulo}</CardTitle>
                    <CardDescription>{alerta.dataGeracao}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getPrioridadeCor(alerta.prioridade) as any}>{alerta.prioridade}</Badge>
                  <div className="flex items-center gap-1">{getStatusIcon(alerta.status)}<span className="text-sm">{alerta.status}</span></div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{alerta.descricao}</p>
              <div className="flex items-center justify-between">
                <p className="text-sm"><strong>Responsável:</strong> {alerta.responsavel}</p>
                <div className="flex gap-2">
                  {alerta.status !== 'Resolvido' && <Button size="sm" onClick={() => resolverAlerta(alerta.id)}><CheckCircle className="h-4 w-4 mr-1" />Resolver</Button>}
                  <Button variant="destructive" size="sm" onClick={() => removerAlerta(alerta.id)}>Excluir</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {alertasFiltrados.length === 0 && <div className="text-center py-8 text-muted-foreground">Nenhum alerta encontrado</div>}
      </div>
    </div>
  );
}
