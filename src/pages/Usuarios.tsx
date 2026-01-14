import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAlmoxarifado, Usuario } from "@/contexts/AlmoxarifadoContext";
import { Users, Plus, Search, Edit, Trash2, UserCheck, UserX } from "lucide-react";
import { setores, perfisUsuario } from "@/data/mockData";

export default function Usuarios() {
  const { usuarios, adicionarUsuario, atualizarUsuario, removerUsuario } = useAlmoxarifado();
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [form, setForm] = useState({ nome: "", email: "", perfil: "Técnico" as Usuario['perfil'], setor: "", status: "Ativo" as Usuario['status'] });

  const usuariosFiltrados = usuarios.filter(u => 
    u.nome.toLowerCase().includes(busca.toLowerCase()) || 
    u.email.toLowerCase().includes(busca.toLowerCase())
  );

  const handleSalvar = () => {
    if (usuarioEditando) {
      atualizarUsuario({ ...usuarioEditando, ...form });
    } else {
      adicionarUsuario(form);
    }
    setModalAberto(false);
    setUsuarioEditando(null);
    setForm({ nome: "", email: "", perfil: "Técnico", setor: "", status: "Ativo" });
  };

  const handleEditar = (usuario: Usuario) => {
    setUsuarioEditando(usuario);
    setForm({ nome: usuario.nome, email: usuario.email, perfil: usuario.perfil, setor: usuario.setor, status: usuario.status });
    setModalAberto(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Usuários
          </h1>
          <p className="text-muted-foreground">Gerenciamento de usuários do sistema</p>
        </div>
        <Dialog open={modalAberto} onOpenChange={setModalAberto}>
          <DialogTrigger asChild>
            <Button onClick={() => { setUsuarioEditando(null); setForm({ nome: "", email: "", perfil: "Técnico", setor: "", status: "Ativo" }); }}>
              <Plus className="h-4 w-4 mr-2" /> Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{usuarioEditando ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div><Label>Nome</Label><Input value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} /></div>
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
              <div><Label>Perfil</Label>
                <Select value={form.perfil} onValueChange={v => setForm({...form, perfil: v as Usuario['perfil']})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{perfisUsuario.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Setor</Label>
                <Select value={form.setor} onValueChange={v => setForm({...form, setor: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{setores.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm({...form, status: v as Usuario['status']})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Ativo">Ativo</SelectItem><SelectItem value="Inativo">Inativo</SelectItem></SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleSalvar}>Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input placeholder="Buscar usuários..." className="pl-10" value={busca} onChange={e => setBusca(e.target.value)} /></div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {usuariosFiltrados.map(usuario => (
          <Card key={usuario.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{usuario.nome}</CardTitle>
                <Badge variant={usuario.status === 'Ativo' ? 'default' : 'secondary'}>{usuario.status === 'Ativo' ? <UserCheck className="h-3 w-3 mr-1" /> : <UserX className="h-3 w-3 mr-1" />}{usuario.status}</Badge>
              </div>
              <CardDescription>{usuario.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Perfil:</strong> {usuario.perfil}</p>
                <p><strong>Setor:</strong> {usuario.setor}</p>
                <p><strong>Último Acesso:</strong> {usuario.ultimoAcesso}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => handleEditar(usuario)}><Edit className="h-4 w-4" /></Button>
                <Button variant="destructive" size="sm" onClick={() => removerUsuario(usuario.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
