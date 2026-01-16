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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Settings, MapPin, Clock, Wrench, Search, Plus, AlertCircle, Edit, Trash2 } from "lucide-react";
import { useAlmoxarifado } from "@/contexts/AlmoxarifadoContext";
import { BombaModal } from "@/components/modals/BombaModal";

export default function Bombas() {
  const { bombas, removerBomba } = useAlmoxarifado();
  const [searchTerm, setSearchTerm] = useState("");
  const [bombaModalOpen, setBombaModalOpen] = useState(false);
  const [editingBomba, setEditingBomba] = useState(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const handleNovaBomba = () => {
    setEditingBomba(null);
    setModalMode('create');
    setBombaModalOpen(true);
  };

  const handleEditarBomba = (bomba: any) => {
    setEditingBomba(bomba);
    setModalMode('edit');
    setBombaModalOpen(true);
  };

  const handleRemoverBomba = (id: string) => {
    removerBomba(id);
  };

  const mockPumps = bombas;

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
        <Button className="bg-primary hover:bg-primary-hover" onClick={handleNovaBomba}>
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
                            <Button variant="outline" size="sm" onClick={() => handleEditarBomba(pump)}>
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => {
                              alert(`Localização: ${pump.localizacao}\n${pump.endereco ? `Endereço: ${pump.endereco}` : ''}\nResponsável: ${pump.responsavel || 'N/A'}`);
                            }}>
                              <MapPin className="h-4 w-4 mr-1" />
                              Localizar
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Remover
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja remover a bomba "{pump.id}"? Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleRemoverBomba(pump.id)} className="bg-destructive hover:bg-destructive/90">
                                    Remover
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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

        <TabsContent value="operando" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <Settings className="h-5 w-5" />
                Bombas em Operação ({pumpsByStatus.operando.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pumpsByStatus.operando.map((pump) => (
                  <div key={pump.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{pump.id} - {pump.modelo}</h3>
                        <p className="text-sm text-muted-foreground">{pump.fabricante}</p>
                        <p className="text-sm mt-2"><strong>Local:</strong> {pump.localizacao}</p>
                        <p className="text-sm"><strong>Responsável:</strong> {pump.responsavel}</p>
                        <p className="text-sm"><strong>Horas de uso:</strong> {pump.horasUso}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditarBomba(pump)}>
                          <Edit className="h-4 w-4 mr-1" />Editar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {pumpsByStatus.operando.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Nenhuma bomba em operação</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manutencao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <Wrench className="h-5 w-5" />
                Bombas em Manutenção ({pumpsByStatus.manutencao.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pumpsByStatus.manutencao.map((pump) => (
                  <div key={pump.id} className="p-4 border border-warning/50 bg-warning/5 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{pump.id} - {pump.modelo}</h3>
                        <p className="text-sm text-muted-foreground">{pump.fabricante}</p>
                        <p className="text-sm mt-2"><strong>Local:</strong> {pump.localizacao}</p>
                        <p className="text-sm"><strong>Responsável:</strong> {pump.responsavel || 'N/A'}</p>
                        <p className="text-sm"><strong>Horas de uso:</strong> {pump.horasUso}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditarBomba(pump)}>
                          <Edit className="h-4 w-4 mr-1" />Editar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {pumpsByStatus.manutencao.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Nenhuma bomba em manutenção</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estoque" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Bombas no Estoque ({pumpsByStatus.estoque.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pumpsByStatus.estoque.map((pump) => (
                  <div key={pump.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{pump.id} - {pump.modelo}</h3>
                        <p className="text-sm text-muted-foreground">{pump.fabricante}</p>
                        <p className="text-sm mt-2"><strong>Local:</strong> {pump.localizacao}</p>
                        {pump.endereco && <p className="text-sm font-mono"><strong>Endereço:</strong> {pump.endereco}</p>}
                        <p className="text-sm"><strong>Potência:</strong> {pump.potencia} | <strong>Capacidade:</strong> {pump.capacidade}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditarBomba(pump)}>
                          <Edit className="h-4 w-4 mr-1" />Editar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {pumpsByStatus.estoque.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Nenhuma bomba no estoque</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <BombaModal 
        open={bombaModalOpen} 
        onOpenChange={setBombaModalOpen}
        bomba={editingBomba}
        mode={modalMode}
      />
    </div>
  );
}