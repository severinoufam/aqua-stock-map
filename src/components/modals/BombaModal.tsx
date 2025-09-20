import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAlmoxarifado, type Bomba } from '@/contexts/AlmoxarifadoContext';

interface BombaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bomba?: Bomba;
  mode: 'create' | 'edit';
}

export function BombaModal({ open, onOpenChange, bomba, mode }: BombaModalProps) {
  const { adicionarBomba, atualizarBomba } = useAlmoxarifado();
  
  const [formData, setFormData] = useState({
    id: '',
    serie: '',
    fabricante: '',
    modelo: '',
    potencia: '',
    capacidade: '',
    status: 'Estoque' as Bomba['status'],
    localizacao: '',
    endereco: '',
    responsavel: '',
    dataInstalacao: '',
    horasUso: '0h',
    proximaManutencao: 'N/A'
  });

  useEffect(() => {
    if (bomba && mode === 'edit') {
      setFormData({
        id: bomba.id,
        serie: bomba.serie,
        fabricante: bomba.fabricante,
        modelo: bomba.modelo,
        potencia: bomba.potencia,
        capacidade: bomba.capacidade,
        status: bomba.status,
        localizacao: bomba.localizacao,
        endereco: bomba.endereco || '',
        responsavel: bomba.responsavel || '',
        dataInstalacao: bomba.dataInstalacao || '',
        horasUso: bomba.horasUso,
        proximaManutencao: bomba.proximaManutencao
      });
    } else {
      setFormData({
        id: '',
        serie: '',
        fabricante: '',
        modelo: '',
        potencia: '',
        capacidade: '',
        status: 'Estoque',
        localizacao: 'Almoxarifado',
        endereco: '',
        responsavel: '',
        dataInstalacao: '',
        horasUso: '0h',
        proximaManutencao: 'N/A'
      });
    }
  }, [bomba, mode, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const bombaData: Bomba = {
      ...formData,
      endereco: formData.status === 'Estoque' ? formData.endereco : undefined,
      responsavel: formData.status !== 'Estoque' ? formData.responsavel : undefined,
      dataInstalacao: formData.status !== 'Estoque' ? formData.dataInstalacao : null
    };
    
    if (mode === 'edit') {
      atualizarBomba(bombaData);
    } else {
      // Generate ID for new bomba
      const lastId = Date.now().toString().slice(-3);
      bombaData.id = `B${lastId.padStart(3, '0')}`;
      adicionarBomba(bombaData);
    }
    
    onOpenChange(false);
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Editar Bomba' : 'Nova Bomba'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'edit' 
              ? 'Atualize as informações da bomba.'
              : 'Adicione uma nova bomba ao sistema.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serie">Número de Série</Label>
              <Input
                id="serie"
                value={formData.serie}
                onChange={handleInputChange('serie')}
                placeholder="Ex: BC-3HP-2024-001"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fabricante">Fabricante</Label>
              <Input
                id="fabricante"
                value={formData.fabricante}
                onChange={handleInputChange('fabricante')}
                placeholder="Ex: Bomba Tech"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="modelo">Modelo</Label>
            <Input
              id="modelo"
              value={formData.modelo}
              onChange={handleInputChange('modelo')}
              placeholder="Ex: Centrífuga CT-3000"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="potencia">Potência</Label>
              <Input
                id="potencia"
                value={formData.potencia}
                onChange={handleInputChange('potencia')}
                placeholder="Ex: 3 HP"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacidade">Capacidade</Label>
              <Input
                id="capacidade"
                value={formData.capacidade}
                onChange={handleInputChange('capacidade')}
                placeholder="Ex: 500 L/min"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: Bomba['status']) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Estoque">Estoque</SelectItem>
                <SelectItem value="Operando">Operando</SelectItem>
                <SelectItem value="Manutenção">Manutenção</SelectItem>
                <SelectItem value="Descartada">Descartada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="localizacao">Localização</Label>
            <Input
              id="localizacao"
              value={formData.localizacao}
              onChange={handleInputChange('localizacao')}
              placeholder={formData.status === 'Estoque' ? 'Almoxarifado' : 'Ex: ETA Central - Setor de Captação'}
              required
            />
          </div>

          {formData.status === 'Estoque' && (
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço no Almoxarifado</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={handleInputChange('endereco')}
                placeholder="Ex: A2-P1-N3-001"
              />
            </div>
          )}

          {formData.status !== 'Estoque' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="responsavel">Responsável</Label>
                <Input
                  id="responsavel"
                  value={formData.responsavel}
                  onChange={handleInputChange('responsavel')}
                  placeholder="Ex: João Silva"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataInstalacao">Data de Instalação</Label>
                <Input
                  id="dataInstalacao"
                  type="date"
                  value={formData.dataInstalacao}
                  onChange={handleInputChange('dataInstalacao')}
                />
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="horasUso">Horas de Uso</Label>
              <Input
                id="horasUso"
                value={formData.horasUso}
                onChange={handleInputChange('horasUso')}
                placeholder="Ex: 2.340h"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proximaManutencao">Próxima Manutenção</Label>
              <Input
                id="proximaManutencao"
                value={formData.proximaManutencao}
                onChange={handleInputChange('proximaManutencao')}
                placeholder="Ex: 2024-12-15 ou Em manutenção"
              />
            </div>
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