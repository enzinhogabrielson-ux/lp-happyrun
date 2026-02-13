import { useState } from "react";
import { useInscriptionStore } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Trash2, Settings, Users, LogOut, RefreshCcw, Search, RefreshCw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type Inscription } from "@shared/schema";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function AdminPage() {
  const queryClient = useQueryClient();
  const { config, updatePixKey } = useInscriptionStore();
  
  const { data: inscriptions = [], isLoading } = useQuery<Inscription[]>({
    queryKey: ["/api/inscriptions"]
  });

  const togglePaymentMutation = useMutation({
    mutationFn: async ({ id, confirmed }: { id: number, confirmed: boolean }) => {
      await apiRequest("PATCH", `/api/inscriptions/${id}/payment`, { confirmed });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/inscriptions"] })
  });

  const removeInscriptionMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/inscriptions/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/inscriptions"] })
  });

  const clearInscriptionsMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/inscriptions/clear");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inscriptions"] });
      toast({
        title: "Sucesso",
        description: "Painel de inscrições zerado.",
      });
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pixKey, setPixKey] = useState(config.pixKey);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "paid" | "pending">("all");
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      setIsLoggedIn(true);
    } else {
      toast({
        title: "Erro de login",
        description: "Usuário ou senha inválidos",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePix = (e: React.FormEvent) => {
    e.preventDefault();
    updatePixKey(pixKey);
    toast({
      title: "Sucesso",
      description: "Chave PIX atualizada",
    });
  };

  const filteredInscriptions = inscriptions.filter(ins => {
    const matchesFilter = 
      filter === "all" ? true :
      filter === "paid" ? ins.pagamentoConfirmado :
      !ins.pagamentoConfirmado;
      
    const matchesSearch = 
      ins.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ins.telefone.includes(searchTerm);
      
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: inscriptions.length,
    paid: inscriptions.filter(i => i.pagamentoConfirmado).length,
    pending: inscriptions.filter(i => !i.pagamentoConfirmado).length
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/40 border-primary/20 backdrop-blur-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-display text-primary">Painel Admin</CardTitle>
            <CardDescription>Acesse para gerenciar as inscrições</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-primary">Usuário</label>
                <Input 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-background/50 border-primary/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-primary">Senha</label>
                <Input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/50 border-primary/20"
                />
              </div>
              <Button type="submit" className="w-full h-12 bg-primary text-background font-bold tracking-widest hover:brightness-110">
                ENTRAR
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-4xl font-display text-primary">Gestão Happy Run</h1>
            <p className="text-muted-foreground">Bem-vindo ao centro de controle</p>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="destructive" 
              className="font-bold tracking-widest h-12"
              onClick={() => {
                if (window.confirm("Deseja realmente ZERAR todas as inscrições? Esta ação não pode ser desfeita.")) {
                  clearInscriptionsMutation.mutate();
                }
              }}
            >
              <RefreshCcw className="mr-2 w-4 h-4" /> ZERAR PAINEL
            </Button>
            <Button variant="outline" className="border-primary/20 text-primary h-12" onClick={() => setIsLoggedIn(false)}>
              <LogOut className="mr-2 w-4 h-4" /> SAIR
            </Button>
          </div>
        </header>

        <Tabs defaultValue="inscriptions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-8">
            <TabsTrigger value="inscriptions">Inscrições</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="inscriptions" className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-8">
                <Card className="bg-black/40 border-primary/20 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Users className="text-primary" /> Estatísticas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-primary/5 rounded-xl border border-primary/10">
                      <span className="text-muted-foreground">Inscrições Totais</span>
                      <span className="text-2xl font-display text-primary">{stats.total}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-green-500/5 rounded-xl border border-green-500/10">
                      <span className="text-muted-foreground">Confirmadas</span>
                      <span className="text-2xl font-display text-green-500">{stats.paid}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="lg:col-span-2 bg-black/40 border-primary/20 backdrop-blur-md overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl">Lista de Participantes</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Buscar..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 bg-background/50 border-primary/20"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border border-primary/10 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-primary/5">
                        <TableRow className="border-primary/10 hover:bg-transparent">
                          <TableHead className="text-primary font-bold">NOME</TableHead>
                          <TableHead className="text-primary font-bold">TAMANHO</TableHead>
                          <TableHead className="text-primary font-bold">STATUS</TableHead>
                          <TableHead className="text-right text-primary font-bold">AÇÕES</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInscriptions.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                              Nenhuma inscrição encontrada.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredInscriptions.map((ins) => (
                            <TableRow key={ins.id} className="border-primary/5 hover:bg-primary/5 transition-colors">
                              <TableCell className="font-medium">
                                <div>{ins.nome}</div>
                                <div className="text-xs text-muted-foreground font-mono">{ins.telefone}</div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="border-primary/30 text-primary uppercase">{ins.tamanho}</Badge>
                              </TableCell>
                              <TableCell>
                                {ins.pagamentoConfirmado ? (
                                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30 gap-1 px-2">
                                    <CheckCircle2 size={12} /> PAGO
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-amber-500 border-amber-500/30 gap-1 px-2">
                                    <XCircle size={12} /> PENDENTE
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className={cn(
                                      "h-8 px-2 transition-all",
                                      ins.pagamentoConfirmado ? "text-amber-500" : "text-green-500"
                                    )}
                                    onClick={() => togglePaymentMutation.mutate({ id: ins.id, confirmed: !ins.pagamentoConfirmado })}
                                  >
                                    <RefreshCw className="w-4 h-4 mr-1" />
                                    {ins.pagamentoConfirmado ? "Pendente" : "Pago"}
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-8 px-2 text-destructive"
                                    onClick={() => {
                                      if (window.confirm("Excluir esta inscrição?")) {
                                        removeInscriptionMutation.mutate(ins.id);
                                      }
                                    }}
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="max-w-2xl mx-auto bg-black/40 border-primary/20 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Settings className="text-primary" /> Configuração PIX
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdatePix} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Chave PIX Atual</label>
                    <Input 
                      value={pixKey}
                      onChange={(e) => setPixKey(e.target.value)}
                      className="bg-background/50 border-primary/20 font-mono text-xs"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30">
                    ATUALIZAR CHAVE
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
