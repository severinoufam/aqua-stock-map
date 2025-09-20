import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAlmoxarifado, type Item } from '@/contexts/AlmoxarifadoContext';

interface ItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: Item;
  mode: 'create' | 'edit';
}

export function ItemModal({ open, onOpenChange, item, mode }: ItemModalProps) {
  const { adicionarItem, atualizarItem } = useAlmoxarifado();
  
  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    categoria: '',
    unidade: '',
    fornecedor: '',
    qtdAtual: 0,
    qtdMinima: 0,
    endereco: ''
  });

  useEffect(() => {
    if (item && mode === 'edit') {
      setFormData({
        codigo: item.codigo,
        nome: item.nome,
        categoria: item.categoria,
        unidade: item.unidade,
        fornecedor: item.fornecedor,
        qtdAtual: item.qtdAtual,
        qtdMinima: item.qtdMinima,
        endereco: item.endereco
      });
    } else {
      setFormData({
        codigo: '',
        nome: '',
        categoria: '',
        unidade: '',
        fornecedor: '',
        qtdAtual: 0,
        qtdMinima: 0,
        endereco: ''
      });
    }
  }, [item, mode, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'edit' && item) {
      atualizarItem({
        ...formData,
        dataUltimaMovimentacao: item.dataUltimaMovimentacao
      });
    } else {
      adicionarItem(formData);
    }
    
    onOpenChange(false);
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: field.includes('qtd') ? parseInt(e.target.value) || 0 : e.target.value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Editar Item' : 'Novo Item'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'edit' 
              ? 'Atualize as informações do item.'
              : 'Adicione um novo item ao almoxarifado.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={handleInputChange('codigo')}
                placeholder="Ex: HID001"
                required
                disabled={mode === 'edit'}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select value={formData.categoria} onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bombas">Bombas</SelectItem>
                  <SelectItem value="Hidráulica">Hidráulica</SelectItem>
                  <SelectItem value="Elétrica">Elétrica</SelectItem>
                  <SelectItem value="Ferramentas">Ferramentas</SelectItem>
                  <SelectItem value="EPI">EPI</SelectItem>
                  <SelectItem value="Filtros">Filtros</SelectItem>
                  <SelectItem value="Produtos Químicos">Produtos Químicos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Item</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={handleInputChange('nome')}
              placeholder="Ex: Bomba Centrífuga 3HP"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unidade">Unidade</Label>
              <Select value={formData.unidade} onValueChange={(value) => setFormData(prev => ({ ...prev, unidade: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unidade">Unidade</SelectItem>
                  <SelectItem value="metro">Metro</SelectItem>
                  <SelectItem value="litro">Litro</SelectItem>
                  <SelectItem value="kg">Quilograma</SelectItem>
                  <SelectItem value="caixa">Caixa</SelectItem>
                  <SelectItem value="rolo">Rolo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fornecedor">Fornecedor</Label>
              <Input
                id="fornecedor"
                value={formData.fornecedor}
                onChange={handleInputChange('fornecedor')}
                placeholder="Ex: Bomba Tech"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="qtdAtual">Quantidade Atual</Label>
              <Input
                id="qtdAtual"
                type="number"
                value={formData.qtdAtual}
                onChange={handleInputChange('qtdAtual')}
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qtdMinima">Quantidade Mínima</Label>
              <Input
                id="qtdMinima"
                type="number"
                value={formData.qtdMinima}
                onChange={handleInputChange('qtdMinima')}
                min="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço no Almoxarifado</Label>
            <Input
              id="endereco"
              value={formData.endereco}
              onChange={handleInputChange('endereco')}
              placeholder="Ex: A2-P1-N3-001 (Corredor-Prateleira-Nível-Posição)"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary-hover">
              {mode === 'edit' ? 'Atualizar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}