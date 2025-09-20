import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Search, Plus, Package, AlertTriangle, CheckCircle } from "lucide-react";

export default function Itens() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const mockItems = [
    {
      codigo: "HID001",
      nome: "Bomba Centrífuga 3HP",
      categoria: "Bombas",
      unidade: "unidade",
      fornecedor: "Bomba Tech",
      qtdAtual: 2,
      qtdMinima: 5,
      endereco: "A2-P1-N3-001",
      status: "baixo"
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
      status: "ok"
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
      status: "ok"
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
      status: "baixo"
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
      status: "ok"
    }
  ];

  const getStatusBadge = (status: string, qtdAtual: number, qtdMinima: number) => {
    if (qtdAtual === 0) {
      return <Badge className="bg-destructive text-destructive-foreground">Esgotado</Badge>;
    } else if (qtdAtual <= qtdMinima) {
      return <Badge className="bg-warning text-warning-foreground">Estoque Baixo</Badge>;
    } else {
      return <Badge className="bg-success text-success-foreground">Disponível</Badge>;
    }
  };

  const getCategoryColor = (categoria: string) => {
    const colors = {
      "Bombas": "bg-primary text-primary-foreground",
      "Hidráulica": "bg-blue-500 text-white",
      "Elétrica": "bg-yellow-500 text-white",
      "Ferramentas": "bg-gray-500 text-white",
      "EPI": "bg-green-500 text-white",
    };
    return colors[categoria as keyof typeof colors] || "bg-muted text-muted-foreground";
  };

  const filteredItems = mockItems.filter(item => {
    const matchesSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.categoria === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Itens</h1>
          <p className="text-muted-foreground">
            Controle total do estoque de materiais e equipamentos
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary-hover">
          <Plus className="mr-2 h-4 w-4" />
          Novo Item
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros e Busca</CardTitle>
          <CardDescription>
            Encontre itens por código, nome ou categoria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por código ou nome do item..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                <SelectItem value="Bombas">Bombas</SelectItem>
                <SelectItem value="Hidráulica">Hidráulica</SelectItem>
                <SelectItem value="Elétrica">Elétrica</SelectItem>
                <SelectItem value="Ferramentas">Ferramentas</SelectItem>
                <SelectItem value="EPI">EPI</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Lista de Itens ({filteredItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome do Item</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.codigo}>
                    <TableCell className="font-mono font-medium">
                      {item.codigo}
                    </TableCell>
                    <TableCell className="font-medium">{item.nome}</TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(item.categoria)}>
                        {item.categoria}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.fornecedor}</TableCell>
                    <TableCell>
                      <span className="font-medium">{item.qtdAtual}</span>
                      <span className="text-muted-foreground">/{item.qtdMinima} {item.unidade}</span>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {item.endereco}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(item.status, item.qtdAtual, item.qtdMinima)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Editar
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
    </div>
  );
}