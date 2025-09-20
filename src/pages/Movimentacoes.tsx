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

import { TrendingUp, ArrowUp, ArrowDown, Search, Plus, FileText } from "lucide-react";
import { useAlmoxarifado } from "@/contexts/AlmoxarifadoContext";
import { MovimentacaoModal } from "@/components/modals/MovimentacaoModal";

export default function Movimentacoes() {
  const { movimentacoes } = useAlmoxarifado();
  const [searchTerm, setSearchTerm] = useState("");
  const [movimentacaoModalOpen, setMovimentacaoModalOpen] = useState(false);
  const [tipoMovimentacao, setTipoMovimentacao] = useState<'Entrada' | 'Saída'>('Entrada');

  const handleNovaMovimentacao = (tipo: 'Entrada' | 'Saída' = 'Entrada') => {
    setTipoMovimentacao(tipo);
    setMovimentacaoModalOpen(true);
  };

  const mockMovimentacoes = movimentacoes;

  const getTipoColor = (tipo: string) => {
    return tipo === "Entrada" 
      ? "bg-success text-success-foreground" 
      : "bg-warning text-warning-foreground";
  };

  const getTipoIcon = (tipo: string) => {
    return tipo === "Entrada" 
      ? <ArrowUp className="h-4 w-4" />
      : <ArrowDown className="h-4 w-4" />;
  };

  const filteredMovimentacoes = mockMovimentacoes.filter(mov =>
    mov.itemNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mov.itemCodigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mov.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const entradas = filteredMovimentacoes.filter(m => m.tipo === "Entrada");
  const saidas = filteredMovimentacoes.filter(m => m.tipo === "Saída");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Movimentações</h1>
          <p className="text-muted-foreground">
            Controle de entradas e saídas do almoxarifado
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Relatório
          </Button>
          <Button className="bg-success hover:bg-success/90" onClick={() => handleNovaMovimentacao('Entrada')}>
            <ArrowUp className="mr-2 h-4 w-4" />
            Entrada
          </Button>
          <Button className="bg-warning hover:bg-warning/90" onClick={() => handleNovaMovimentacao('Saída')}>
            <ArrowDown className="mr-2 h-4 w-4" />
            Saída
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hoje</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredMovimentacoes.length}</div>
            <p className="text-xs text-muted-foreground">Movimentações registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entradas</CardTitle>
            <ArrowUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{entradas.length}</div>
            <p className="text-xs text-muted-foreground">Itens recebidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saídas</CardTitle>
            <ArrowDown className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{saidas.length}</div>
            <p className="text-xs text-muted-foreground">Itens retirados</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros e Busca</CardTitle>
          <CardDescription>
            Encontre movimentações por item, código ou responsável
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por item, código ou responsável..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todas ({filteredMovimentacoes.length})</TabsTrigger>
          <TabsTrigger value="entradas">Entradas ({entradas.length})</TabsTrigger>
          <TabsTrigger value="saidas">Saídas ({saidas.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Histórico de Movimentações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Setor/Fornecedor</TableHead>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Observação</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMovimentacoes.map((mov) => (
                      <TableRow key={mov.id}>
                        <TableCell className="font-mono font-medium">{mov.id}</TableCell>
                        <TableCell>
                          <Badge className={getTipoColor(mov.tipo)}>
                            <span className="flex items-center gap-1">
                              {getTipoIcon(mov.tipo)}
                              {mov.tipo}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{mov.itemNome}</p>
                            <p className="text-sm text-muted-foreground font-mono">{mov.itemCodigo}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{mov.quantidade}</span>
                          <span className="text-muted-foreground ml-1">{mov.unidade}</span>
                        </TableCell>
                        <TableCell className="font-medium">{mov.responsavel}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium">{mov.setor}</p>
                            {mov.fornecedor && (
                              <p className="text-muted-foreground">{mov.fornecedor}</p>
                            )}
                            {mov.notaFiscal && (
                              <p className="text-muted-foreground font-mono">{mov.notaFiscal}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium">{mov.data}</p>
                            <p className="text-muted-foreground">{mov.hora}</p>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="text-sm text-muted-foreground truncate">
                            {mov.observacao}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entradas">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <ArrowUp className="h-5 w-5" />
                Entradas no Almoxarifado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Lista filtrada das entradas de materiais...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saidas">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <ArrowDown className="h-5 w-5" />
                Saídas do Almoxarifado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Lista filtrada das saídas de materiais...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <MovimentacaoModal 
        open={movimentacaoModalOpen} 
        onOpenChange={setMovimentacaoModalOpen}
        tipo={tipoMovimentacao}
      />
    </div>
  );
}