import { useState, useEffect } from "react";
import { useInscriptionStore } from "@/lib/storage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, LogOut, RefreshCw, Search, Users, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check session storage on mount
  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth");
    if (auth === "true") setIsAuthenticated(true);
  }, []);

  const handleLogin = () => {
    sessionStorage.setItem("admin_auth", "true");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}

function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "humani2025") {
      onLogin();
    } else {
      setError(true);
      toast({
        variant: "destructive",
        title: "Acesso Negado",
        description: "Usuário ou senha incorretos.",
      });
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Pulse */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[20%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8"
      >
        <motion.div
          animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="glass-panel p-8 rounded-2xl"
        >
          <div className="text-center mb-8">
            <div className="text-primary font-bold tracking-widest uppercase mb-2 text-sm">Painel Administrativo</div>
            <h1 className="text-3xl font-display text-white">Login Seguro</h1>
            <p className="text-muted-foreground text-sm mt-2">Entre com suas credenciais</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-primary uppercase tracking-wider">Usuário</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-background/50 border-primary/20 h-12"
                placeholder="admin"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-primary uppercase tracking-wider">Senha</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50 border-primary/20 h-12"
                placeholder="••••••••"
              />
            </div>
            <Button className="w-full h-12 mt-4 bg-primary hover:bg-primary/90 text-background font-bold tracking-wider uppercase">
              <Lock className="w-4 h-4 mr-2" />
              Entrar
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted/20 rounded-lg border border-primary/10 text-center">
             <p className="text-xs text-muted-foreground">Credenciais de Teste:</p>
             <p className="text-xs font-mono text-primary mt-1">admin / humani2025</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { inscriptions, togglePayment } = useInscriptionStore();
  const [filter, setFilter] = useState<"all" | "paid" | "pending">("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  const stats = {
    total: inscriptions.length,
    paid: inscriptions.filter(i => i.pagamentoConfirmado).length,
    pending: inscriptions.filter(i => !i.pagamentoConfirmado).length
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-background font-bold">H</div>
             <span className="font-display text-xl tracking-wide">Painel Admin</span>
          </div>
          <Button variant="ghost" onClick={onLogout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-panel border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Total Inscritos</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-display font-bold text-white">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="glass-panel border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Confirmados</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-display font-bold text-green-500">{stats.paid}</div>
            </CardContent>
          </Card>
          <Card className="glass-panel border-amber-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-display font-bold text-amber-500">{stats.pending}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-col md:flex-row justify-between gap-4 items-center bg-card/50 p-4 rounded-xl border border-border/40">
          <div className="flex gap-2 w-full md:w-auto">
            <Button 
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className="flex-1"
            >
              Todos
            </Button>
            <Button 
              variant={filter === "paid" ? "default" : "outline"}
              onClick={() => setFilter("paid")}
              className={filter === "paid" ? "bg-green-600 hover:bg-green-700" : "text-green-500 border-green-500/30 hover:bg-green-500/10"}
            >
              Pagos
            </Button>
            <Button 
              variant={filter === "pending" ? "default" : "outline"}
              onClick={() => setFilter("pending")}
              className={filter === "pending" ? "bg-amber-600 hover:bg-amber-700" : "text-amber-500 border-amber-500/30 hover:bg-amber-500/10"}
            >
              Pendentes
            </Button>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por nome ou telefone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background/50 border-primary/20"
            />
          </div>
        </div>

        {/* Table */}
        <div className="glass-panel rounded-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-primary/10">
                <TableHead className="text-primary font-bold uppercase text-xs">Nome</TableHead>
                <TableHead className="text-primary font-bold uppercase text-xs">Contato</TableHead>
                <TableHead className="text-primary font-bold uppercase text-xs">Camisa</TableHead>
                <TableHead className="text-primary font-bold uppercase text-xs">Data</TableHead>
                <TableHead className="text-primary font-bold uppercase text-xs">Status</TableHead>
                <TableHead className="text-right text-primary font-bold uppercase text-xs">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    Nenhuma inscrição encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredInscriptions.map((ins) => (
                  <TableRow key={ins.id} className="hover:bg-primary/5 border-primary/10 transition-colors">
                    <TableCell className="font-medium text-white">{ins.nome}</TableCell>
                    <TableCell>{ins.telefone}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-primary/30 text-primary">{ins.tamanho}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(ins.dataInscricao), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          ins.pagamentoConfirmado 
                            ? "bg-green-500/20 text-green-500 hover:bg-green-500/30 border-green-500/50" 
                            : "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 border-amber-500/50"
                        }
                      >
                        {ins.pagamentoConfirmado ? "CONFIRMADO" : "PENDENTE"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => togglePayment(ins.id)}
                        className="hover:bg-primary/10 hover:text-primary"
                        title="Alternar Status de Pagamento"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
