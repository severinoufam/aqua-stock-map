import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAlmoxarifado } from "@/contexts/AlmoxarifadoContext";

import {
  Package,
  Settings,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench,
} from "lucide-react";

export default function Dashboard() {
  const { 
    getTotalItens, 
    getBombasPorStatus, 
    getItensComEstoqueBaixo, 
    getMovimentacoesPorPeriodo,
    bombas 
  } = useAlmoxarifado();

  const itensComEstoqueBaixo = getItensComEstoqueBaixo();
  const bombasOperando = getBombasPorStatus('Operando');
  const bombasManutencao = getBombasPorStatus('Manutenção');
  const movimentacoesHoje = getMovimentacoesPorPeriodo(1);

  const statsCards = [
    {
      title: "Total de Itens",
      value: getTotalItens().toString(),
      description: "Itens cadastrados",
      icon: Package,
      trend: "+12% este mês",
      color: "text-primary",
    },
    {
      title: "Bombas Ativas",
      value: bombasOperando.length.toString(),
      description: "Em operação",
      icon: Settings,
      trend: `${bombasManutencao.length} em manutenção`,
      color: "text-success",
    },
    {
      title: "Movimentações Hoje",
      value: movimentacoesHoje.length.toString(),
      description: "Entradas e saídas",
      icon: TrendingUp,
      trend: "+8% vs ontem",
      color: "text-warning",
    },
    {
      title: "Alertas Ativos",
      value: itensComEstoqueBaixo.length.toString(),
      description: "Estoque baixo",
      icon: AlertTriangle,
      trend: "Requer atenção",
      color: "text-destructive",
    },
  ];

  const pumpStatus = bombas.slice(0, 4).map(bomba => ({
    id: bomba.id,
    location: bomba.localizacao,
    status: bomba.status,
    hours: bomba.horasUso
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Operando": return "bg-success text-success-foreground";
      case "Manutenção": return "bg-warning text-warning-foreground";
      case "Estoque": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getAlertColor = (qtdAtual: number, qtdMinima: number) => {
    if (qtdAtual === 0) return "bg-destructive text-destructive-foreground";
    if (qtdAtual <= qtdMinima) return "bg-warning text-warning-foreground";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do almoxarifado SAAE
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
              <p className="text-xs mt-1 font-medium">{card.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Alertas de Estoque
            </CardTitle>
            <CardDescription>
              Itens com quantidade abaixo do mínimo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {itensComEstoqueBaixo.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{item.nome}</p>
                    <p className="text-sm text-muted-foreground">{item.endereco}</p>
                    <p className="text-xs text-muted-foreground">
                      Disponível: {item.qtdAtual} {item.unidade} (Mín: {item.qtdMinima})
                    </p>
                  </div>
                  <Badge className={getAlertColor(item.qtdAtual, item.qtdMinima)}>
                    {item.qtdAtual === 0 ? "Esgotado" : "Baixo"}
                  </Badge>
                </div>
              ))}
              {itensComEstoqueBaixo.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-success" />
                  <p>Todos os itens estão com estoque adequado!</p>
                </div>
              )}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Ver Todos os Alertas
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Status das Bombas
            </CardTitle>
            <CardDescription>
              Localização e status atual das bombas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pumpStatus.map((pump) => (
                <div key={pump.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">Bomba {pump.id}</p>
                    <p className="text-sm text-muted-foreground">{pump.location}</p>
                    <p className="text-xs text-muted-foreground">{pump.hours} de uso</p>
                  </div>
                  <Badge className={getStatusColor(pump.status)}>
                    {pump.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Gerenciar Bombas
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}