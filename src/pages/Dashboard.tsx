import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  const statsCards = [
    {
      title: "Total de Itens",
      value: "2,847",
      description: "Itens cadastrados",
      icon: Package,
      trend: "+12% este mês",
      color: "text-primary",
    },
    {
      title: "Bombas Ativas",
      value: "47",
      description: "Em operação",
      icon: Settings,
      trend: "3 em manutenção",
      color: "text-success",
    },
    {
      title: "Movimentações Hoje",
      value: "23",
      description: "Entradas e saídas",
      icon: TrendingUp,
      trend: "+8% vs ontem",
      color: "text-warning",
    },
    {
      title: "Alertas Ativos",
      value: "12",
      description: "Estoque baixo",
      icon: AlertTriangle,
      trend: "Requer atenção",
      color: "text-destructive",
    },
  ];

  const recentAlerts = [
    { item: "Bomba Centrífuga 3HP", location: "Corredor A, Prateleira 2", level: "Crítico" },
    { item: "Conexão PVC 50mm", location: "Corredor B, Prateleira 1", level: "Baixo" },
    { item: "Filtro de Areia", location: "Corredor C, Prateleira 3", level: "Baixo" },
  ];

  const pumpStatus = [
    { id: "B001", location: "ETA Central", status: "Operando", hours: "2.340h" },
    { id: "B002", location: "Poço Artesiano Norte", status: "Operando", hours: "1.890h" },
    { id: "B003", location: "Oficina", status: "Manutenção", hours: "3.120h" },
    { id: "B004", location: "Almoxarifado - A2-P1-N3", status: "Estoque", hours: "0h" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Operando": return "bg-success text-success-foreground";
      case "Manutenção": return "bg-warning text-warning-foreground";
      case "Estoque": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case "Crítico": return "bg-destructive text-destructive-foreground";
      case "Baixo": return "bg-warning text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
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
              {recentAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{alert.item}</p>
                    <p className="text-sm text-muted-foreground">{alert.location}</p>
                  </div>
                  <Badge className={getAlertColor(alert.level)}>
                    {alert.level}
                  </Badge>
                </div>
              ))}
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