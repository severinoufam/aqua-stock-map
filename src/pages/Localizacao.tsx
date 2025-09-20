import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { MapPin, Search, Package, Settings, Navigation } from "lucide-react";

export default function Localizacao() {
  const [searchTerm, setSearchTerm] = useState("");

  const mockLocalizacoes = [
    {
      endereco: "A1-P1-N1",
      corredor: "A",
      prateleira: "1",
      nivel: "1",
      posicoes: ["001", "002", "003", "004", "005"],
      itensArmazenados: [
        { codigo: "HID003", nome: "Válvula Esfera 25mm", quantidade: 12 },
        { codigo: "HID004", nome: "Registro Gaveta 50mm", quantidade: 8 }
      ]
    },
    {
      endereco: "A2-P1-N3",
      corredor: "A",
      prateleira: "2",
      nivel: "1",
      posicoes: ["001", "002", "003"],
      itensArmazenados: [
        { codigo: "HID001", nome: "Bomba Centrífuga 3HP", quantidade: 2 },
        { codigo: "B004", nome: "Bomba CT-3000 (Nova)", quantidade: 1 }
      ]
    },
    {
      endereco: "B1-P2-N1",
      corredor: "B",
      prateleira: "1",
      nivel: "2",
      posicoes: ["001", "002", "003", "004", "005"],
      itensArmazenados: [
        { codigo: "HID002", nome: "Conexão PVC 50mm", quantidade: 45 }
      ]
    },
    {
      endereco: "C3-P1-N2",
      corredor: "C",
      prateleira: "3",
      nivel: "1",
      posicoes: ["010", "011", "012"],
      itensArmazenados: [
        { codigo: "ELE001", nome: "Cabo Flexível 4mm", quantidade: 180 }
      ]
    }
  ];

  const bombasEmCampo = [
    {
      id: "B001",
      nome: "Bomba Centrífuga BC-3HP-001",
      localizacao: "ETA Central - Setor de Captação",
      coordenadas: "23°32'15.2\"S 46°38'08.1\"W",
      responsavel: "João Silva",
      status: "Operando",
      instalacao: "2024-01-15"
    },
    {
      id: "B002", 
      nome: "Bomba Submersível AS-2HP-015",
      localizacao: "Poço Artesiano Norte - Rua das Flores, 123",
      coordenadas: "23°31'42.8\"S 46°37'55.3\"W",
      responsavel: "Maria Santos",
      status: "Operando", 
      instalacao: "2023-08-20"
    },
    {
      id: "B003",
      nome: "Bomba Industrial HI-5HP-008",
      localizacao: "Oficina de Manutenção - SAAE",
      coordenadas: "23°32'05.7\"S 46°38'12.4\"W",
      responsavel: "Carlos Tech",
      status: "Manutenção",
      instalacao: "2022-03-10"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Operando": return "bg-success text-success-foreground";  
      case "Manutenção": return "bg-warning text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sistema de Localização</h1>
          <p className="text-muted-foreground">
            Mapeamento de itens no almoxarifado e bombas em campo
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary-hover">
          <Navigation className="mr-2 h-4 w-4" />
          Mapa Geral
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Endereços Ativos</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockLocalizacoes.length}</div>
            <p className="text-xs text-muted-foreground">Posições com itens</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bombas em Campo</CardTitle>
            <Settings className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{bombasEmCampo.length}</div>
            <p className="text-xs text-muted-foreground">Instaladas e rastreadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Corredores</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Setores organizados</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Busca por Localização</CardTitle>
          <CardDescription>
            Encontre itens por endereço ou código
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por código do item, endereço (ex: A2-P1-N3) ou nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="almoxarifado" className="space-y-4">
        <TabsList>
          <TabsTrigger value="almoxarifado">Almoxarifado</TabsTrigger>
          <TabsTrigger value="campo">Bombas em Campo</TabsTrigger>
          <TabsTrigger value="mapa">Mapa Visual</TabsTrigger>
        </TabsList>

        <TabsContent value="almoxarifado" className="space-y-4">
          <div className="grid gap-4">
            {mockLocalizacoes.map((local) => (
              <Card key={local.endereco}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Endereço: {local.endereco}
                  </CardTitle>
                  <CardDescription>
                    Corredor {local.corredor} → Prateleira {local.prateleira} → Nível {local.nivel}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Posições Disponíveis:</h4>
                      <div className="flex gap-2 flex-wrap">
                        {local.posicoes.map((pos) => (
                          <Badge key={pos} variant="outline" className="font-mono">
                            {local.endereco}-{pos}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Itens Armazenados:</h4>
                      <div className="space-y-2">
                        {local.itensArmazenados.map((item) => (
                          <div key={item.codigo} className="flex items-center justify-between p-2 border border-border rounded-lg">
                            <div>
                              <p className="font-medium">{item.nome}</p>
                              <p className="text-sm text-muted-foreground font-mono">{item.codigo}</p>
                            </div>
                            <Badge className="bg-primary text-primary-foreground">
                              {item.quantidade} un
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="campo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Bombas Instaladas em Campo
              </CardTitle>
              <CardDescription>
                Localização atual das bombas em operação no sistema de abastecimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bombasEmCampo.map((bomba) => (
                  <div key={bomba.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{bomba.nome}</h3>
                          <Badge className={getStatusColor(bomba.status)}>
                            {bomba.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p><strong>Local:</strong> {bomba.localizacao}</p>
                          <p><strong>Coordenadas:</strong> <span className="font-mono">{bomba.coordenadas}</span></p>
                          <p><strong>Responsável:</strong> {bomba.responsavel}</p>
                          <p><strong>Instalada em:</strong> {bomba.instalacao}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Navigation className="h-4 w-4 mr-1" />
                          Ver no Mapa
                        </Button>
                        <Button variant="outline" size="sm">
                          Detalhes
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mapa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-primary" />
                Mapa Visual do Almoxarifado
              </CardTitle>
              <CardDescription>
                Layout visual das prateleiras e localização dos itens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-8 rounded-lg text-center">
                <div className="mb-4">
                  <Navigation className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <h3 className="font-medium">Mapa Visual Interativo</h3>
                  <p className="text-sm text-muted-foreground">
                    Layout 3D do almoxarifado será implementado aqui
                  </p>
                </div>
                
                <div className="grid grid-cols-5 gap-4 max-w-md mx-auto">
                  {["A", "B", "C", "D", "E"].map((corredor) => (
                    <div key={corredor} className="p-4 bg-background border border-border rounded text-center">
                      <p className="font-medium">Corredor {corredor}</p>
                      <p className="text-xs text-muted-foreground">3 prateleiras</p>
                    </div>
                  ))}
                </div>
                
                <Button className="mt-4 bg-primary hover:bg-primary-hover">
                  Abrir Mapa Completo
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}