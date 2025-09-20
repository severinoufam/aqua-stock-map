import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Settings, MapPin, Clock, Wrench, Search, Plus, AlertCircle } from "lucide-react";

export default function Bombas() {
  const [searchTerm, setSearchTerm] = useState("");

  const mockPumps = [
    {
      id: "B001",
      serie: "BC-3HP-2024-001",
      fabricante: "Bomba Tech",
      modelo: "Centrífuga CT-3000",
      potencia: "3 HP",
      capacidade: "500 L/min",
      status: "Operando",
      localizacao: "ETA Central - Bomba Principal",
      endereco: null,
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
      endereco: null,
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
      endereco: null,
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
      responsavel: null,
      dataInstalacao: null,
      horasUso: "0h",
      proximaManutencao: "N/A"
    },
    {
      id: "B005",
      serie: "BC-1HP-2024-003",
      fabricante: "MicroPump",
      modelo: "Residencial MR-1000",
      potencia: "1 HP",
      capacidade: "150 L/min",
      status: "Estoque",
      localizacao: "Almoxarifado",
      endereco: "A2-P2-N1-005",
      responsavel: null,
      dataInstalacao: null,
      horasUso: "0h",
      proximaManutencao: "N/A"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Operando": return "bg-success text-success-foreground";
      case "Manutenção": return "bg-warning text-warning-foreground";
      case "Estoque": return "bg-secondary text-secondary-foreground";
      case "Descartada": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Operando": return <Settings className="h-4 w-4" />;
      case "Manutenção": return <Wrench className="h-4 w-4" />;
      case "Estoque": return <MapPin className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredPumps = mockPumps.filter(pump => 
    pump.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pump.serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pump.fabricante.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pumpsByStatus = {
    operando: filteredPumps.filter(p => p.status === "Operando"),
    manutencao: filteredPumps.filter(p => p.status === "Manutenção"),
    estoque: filteredPumps.filter(p => p.status === "Estoque"),
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Bombas</h1>
          <p className="text-muted-foreground">
            Controle e rastreamento de bombas de água
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary-hover">
          <Plus className="mr-2 h-4 w-4" />
          Nova Bomba
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Bombas</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPumps.length}</div>
            <p className="text-xs text-muted-foreground">Cadastradas no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Operação</CardTitle>
            <Settings className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{pumpsByStatus.operando.length}</div>
            <p className="text-xs text-muted-foreground">Funcionando normalmente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Manutenção</CardTitle>
            <Wrench className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{pumpsByStatus.manutencao.length}</div>
            <p className="text-xs text-muted-foreground">Requer manutenção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No Estoque</CardTitle>
            <MapPin className="h-4 w-4 text-secondary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pumpsByStatus.estoque.length}</div>
            <p className="text-xs text-muted-foreground">Disponíveis para uso</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros e Busca</CardTitle>
          <CardDescription>
            Encontre bombas por ID, série ou fabricante
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID, série ou fabricante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todas ({filteredPumps.length})</TabsTrigger>
          <TabsTrigger value="operando">Em Operação ({pumpsByStatus.operando.length})</TabsTrigger>
          <TabsTrigger value="manutencao">Manutenção ({pumpsByStatus.manutencao.length})</TabsTrigger>
          <TabsTrigger value="estoque">Estoque ({pumpsByStatus.estoque.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Todas as Bombas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Série</TableHead>
                      <TableHead>Modelo/Fabricante</TableHead>
                      <TableHead>Especificações</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Horas de Uso</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPumps.map((pump) => (
                      <TableRow key={pump.id}>
                        <TableCell className="font-mono font-medium">{pump.id}</TableCell>
                        <TableCell className="font-mono text-sm">{pump.serie}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{pump.modelo}</p>
                            <p className="text-sm text-muted-foreground">{pump.fabricante}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{pump.potencia}</p>
                            <p className="text-muted-foreground">{pump.capacidade}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(pump.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(pump.status)}
                              {pump.status}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium">{pump.localizacao}</p>
                            {pump.endereco && (
                              <p className="text-muted-foreground font-mono">{pump.endereco}</p>
                            )}
                            {pump.responsavel && (
                              <p className="text-muted-foreground">Resp: {pump.responsavel}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">{pump.horasUso}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Detalhes
                            </Button>
                            <Button variant="outline" size="sm">
                              Localizar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Outros tabs teriam conteúdo similar, filtrado por status */}
        <TabsContent value="operando">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <Settings className="h-5 w-5" />
                Bombas em Operação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Lista filtrada das bombas atualmente em operação...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manutencao">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <Wrench className="h-5 w-5" />
                Bombas em Manutenção
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Lista filtrada das bombas em manutenção...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estoque">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Bombas no Estoque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Lista filtrada das bombas no almoxarifado...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}