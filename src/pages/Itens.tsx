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

import { Search, Plus, Package, AlertTriangle, CheckCircle, Edit, MapPin, Trash2 } from "lucide-react";
import { useAlmoxarifado } from "@/contexts/AlmoxarifadoContext";
import { ItemModal } from "@/components/modals/ItemModal";

export default function Itens() {
  const { itens, removerItem } = useAlmoxarifado();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const handleNovoItem = () => {
    setEditingItem(null);
    setModalMode('create');
    setItemModalOpen(true);
  };

  const handleEditarItem = (item: any) => {
    setEditingItem(item);
    setModalMode('edit');
    setItemModalOpen(true);
  };

  const handleRemoverItem = (codigo: string) => {
    removerItem(codigo);
  };

  const mockItems = itens;

  const getStatusBadge = (qtdAtual: number, qtdMinima: number) => {
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
        <Button className="bg-primary hover:bg-primary-hover" onClick={handleNovoItem}>
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
                      {getStatusBadge(item.qtdAtual, item.qtdMinima)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditarItem(item)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button variant="outline" size="sm">
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
                                Tem certeza que deseja remover o item "{item.nome}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleRemoverItem(item.codigo)} className="bg-destructive hover:bg-destructive/90">
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

      <ItemModal 
        open={itemModalOpen} 
        onOpenChange={setItemModalOpen}
        item={editingItem}
        mode={modalMode}
      />
    </div>
  );
}