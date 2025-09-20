import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAlmoxarifado, type Movimentacao } from '@/contexts/AlmoxarifadoContext';

interface MovimentacaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipo?: 'Entrada' | 'Saída';
}

export function MovimentacaoModal({ open, onOpenChange, tipo = 'Entrada' }: MovimentacaoModalProps) {
  const { registrarMovimentacao, itens } = useAlmoxarifado();
  
  const [formData, setFormData] = useState({
    tipo: tipo,
    itemCodigo: '',
    itemNome: '',
    quantidade: 0,
    unidade: '',
    responsavel: '',
    setor: '',
    notaFiscal: '',
    fornecedor: '',
    observacao: ''
  });

  const [selectedItem, setSelectedItem] = useState<typeof itens[0] | null>(null);

  useEffect(() => {
    setFormData(prev => ({ ...prev, tipo }));
  }, [tipo]);

  useEffect(() => {
    if (formData.itemCodigo) {
      const item = itens.find(i => i.codigo === formData.itemCodigo);
      if (item) {
        setSelectedItem(item);
        setFormData(prev => ({
          ...prev,
          itemNome: item.nome,
          unidade: item.unidade
        }));
      }
    }
  }, [formData.itemCodigo, itens]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedItem) return;

    if (formData.tipo === 'Saída' && formData.quantidade > selectedItem.qtdAtual) {
      alert(`Quantidade insuficiente em estoque. Disponível: ${selectedItem.qtdAtual} ${selectedItem.unidade}`);
      return;
    }

    registrarMovimentacao({
      tipo: formData.tipo,
      itemCodigo: formData.itemCodigo,
      itemNome: formData.itemNome,
      quantidade: formData.quantidade,
      unidade: formData.unidade,
      responsavel: formData.responsavel,
      setor: formData.setor,
      notaFiscal: formData.notaFiscal || undefined,
      fornecedor: formData.fornecedor || undefined,
      observacao: formData.observacao
    });
    
    // Reset form
    setFormData({
      tipo: tipo,
      itemCodigo: '',
      itemNome: '',
      quantidade: 0,
      unidade: '',
      responsavel: '',
      setor: '',
      notaFiscal: '',
      fornecedor: '',
      observacao: ''
    });
    setSelectedItem(null);
    
    onOpenChange(false);
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'quantidade' ? parseInt(e.target.value) || 0 : e.target.value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Nova {formData.tipo}
          </DialogTitle>
          <DialogDescription>
            Registre uma {formData.tipo.toLowerCase()} de material no almoxarifado.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Movimentação</Label>
            <Select value={formData.tipo} onValueChange={(value: 'Entrada' | 'Saída') => setFormData(prev => ({ ...prev, tipo: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Entrada">Entrada</SelectItem>
                <SelectItem value="Saída">Saída</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="itemCodigo">Item</Label>
            <Select value={formData.itemCodigo} onValueChange={(value) => setFormData(prev => ({ ...prev, itemCodigo: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o item..." />
              </SelectTrigger>
              <SelectContent>
                {itens.map((item) => (
                  <SelectItem key={item.codigo} value={item.codigo}>
                    {item.codigo} - {item.nome}
                    {formData.tipo === 'Saída' && (
                      <span className="text-muted-foreground ml-2">
                        (Disponível: {item.qtdAtual} {item.unidade})
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedItem && (
            <div className="p-3 bg-muted rounded-lg text-sm">
              <p><strong>Item:</strong> {selectedItem.nome}</p>
              <p><strong>Estoque Atual:</strong> {selectedItem.qtdAtual} {selectedItem.unidade}</p>
              <p><strong>Localização:</strong> {selectedItem.endereco}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="quantidade">Quantidade</Label>
            <Input
              id="quantidade"
              type="number"
              value={formData.quantidade}
              onChange={handleInputChange('quantidade')}
              min="1"
              max={formData.tipo === 'Saída' ? selectedItem?.qtdAtual : undefined}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsavel">Responsável</Label>
            <Input
              id="responsavel"
              value={formData.responsavel}
              onChange={handleInputChange('responsavel')}
              placeholder="Nome do responsável pela movimentação"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="setor">
              {formData.tipo === 'Entrada' ? 'Fornecedor/Origem' : 'Setor de Destino'}
            </Label>
            <Input
              id="setor"
              value={formData.setor}
              onChange={handleInputChange('setor')}
              placeholder={formData.tipo === 'Entrada' ? 'Ex: Bomba Tech' : 'Ex: Manutenção ETA'}
              required
            />
          </div>

          {formData.tipo === 'Entrada' && (
            <div className="space-y-2">
              <Label htmlFor="notaFiscal">Nota Fiscal (opcional)</Label>
              <Input
                id="notaFiscal"
                value={formData.notaFiscal}
                onChange={handleInputChange('notaFiscal')}
                placeholder="Ex: NF-2024-001"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="observacao">Observação</Label>
            <Textarea
              id="observacao"
              value={formData.observacao}
              onChange={handleInputChange('observacao')}
              placeholder="Detalhes adicionais sobre a movimentação..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary-hover">
              Registrar {formData.tipo}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}