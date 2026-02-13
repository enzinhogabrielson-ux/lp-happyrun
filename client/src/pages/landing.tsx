import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useInscriptionStore } from "@/lib/storage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Shirt } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  telefone: z.string().min(10, "Telefone inválido"),
  tamanho: z.string().min(1, "Selecione um tamanho"),
  pagamentoConfirmado: z.boolean().refine((val) => val === true, {
    message: "Você deve confirmar o pagamento para prosseguir",
  }),
});

export default function LandingPage() {
  const { addInscription } = useInscriptionStore();
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      telefone: "",
      tamanho: "",
      pagamentoConfirmado: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Add artificial delay for "processing" feel
    setTimeout(() => {
      addInscription({
        nome: values.nome,
        telefone: values.telefone,
        tamanho: values.tamanho,
      });
      setIsSuccess(true);
      form.reset();
      
      // Auto hide success after 5s
      setTimeout(() => setIsSuccess(false), 5000);
    }, 800);
  }

  // Format phone number
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length > 9) {
      value = `${value.slice(0, 9)}-${value.slice(9)}`;
    }
    
    form.setValue("telefone", value);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground flex items-center justify-center p-4">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -right-[20%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-[20%] -left-[20%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[80px]"
        />
        <div className="absolute top-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="container max-w-6xl relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* Left Column: Hero Text */}
        <div className="space-y-8 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-primary font-bold tracking-widest uppercase mb-4 text-xl">
              Humani Treinamentos
            </h2>
            <h1 className="text-6xl lg:text-8xl font-display leading-[0.9] mb-6 text-white drop-shadow-2xl">
              Corrida <br />
              <span className="text-primary glow-text">Bandeiras</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground font-light max-w-md mx-auto lg:mx-0">
              Vista sua camisa e participe do maior evento de corrida do Bandeiras Empresarial em Votorantim!
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap gap-4 justify-center lg:justify-start"
          >
            <div className="flex items-center gap-3 bg-card/50 px-5 py-3 rounded-xl border border-primary/20 backdrop-blur-sm">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <MapPin size={24} />
              </div>
              <div className="text-left">
                <div className="text-xs text-primary font-bold uppercase tracking-wider">Local</div>
                <div className="text-sm font-semibold">Bandeiras Empresarial<br/>Votorantim</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-card/50 px-5 py-3 rounded-xl border border-primary/20 backdrop-blur-sm">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Shirt size={24} />
              </div>
              <div className="text-left">
                <div className="text-xs text-primary font-bold uppercase tracking-wider">Inclui</div>
                <div className="text-sm font-semibold">Camisa Oficial<br/>do Evento</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full"
        >
          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-10 rounded-3xl text-center space-y-6"
            >
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              </div>
              <h3 className="text-3xl font-display text-primary">Inscrição Confirmada!</h3>
              <p className="text-muted-foreground">Sua vaga está garantida. Prepare-se para o desafio!</p>
              <Button 
                variant="outline" 
                className="mt-6 border-primary/30 hover:bg-primary/10 text-primary"
                onClick={() => setIsSuccess(false)}
              >
                Nova Inscrição
              </Button>
            </motion.div>
          ) : (
            <div className="glass-panel p-8 md:p-10 rounded-3xl relative overflow-hidden">
               {/* Shine effect */}
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
               
              <div className="mb-8 text-center">
                <h3 className="text-3xl font-display text-white mb-2">Garanta sua Vaga</h3>
                <p className="text-sm text-muted-foreground">Preencha seus dados abaixo</p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-bold uppercase text-xs tracking-wider">Nome Completo</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Digite seu nome completo" 
                            {...field} 
                            className="bg-background/50 border-primary/20 focus-visible:ring-primary/50 h-12 rounded-xl"
                            data-testid="input-nome"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="telefone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-bold uppercase text-xs tracking-wider">Telefone</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="(00) 00000-0000" 
                              {...field} 
                              onChange={(e) => {
                                handlePhoneChange(e);
                                field.onChange(e);
                              }}
                              className="bg-background/50 border-primary/20 focus-visible:ring-primary/50 h-12 rounded-xl"
                              data-testid="input-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tamanho"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-bold uppercase text-xs tracking-wider">Camisa</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-background/50 border-primary/20 focus:ring-primary/50 h-12 rounded-xl" data-testid="select-size">
                                <SelectValue placeholder="Tamanho" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-card border-primary/20">
                              {["PP", "P", "M", "G", "GG", "XG"].map((size) => (
                                <SelectItem key={size} value={size} className="focus:bg-primary/20 focus:text-primary cursor-pointer">
                                  {size}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="pagamentoConfirmado"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-primary/20 bg-primary/5 p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary border-primary/50 w-5 h-5 mt-0.5"
                            data-testid="checkbox-payment"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal cursor-pointer">
                            Confirmo que realizei o pagamento da taxa de inscrição e concordo com os termos.
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg font-display tracking-widest bg-gradient-to-r from-primary to-secondary hover:brightness-110 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 text-background rounded-xl"
                    data-testid="button-submit"
                  >
                    CONFIRMAR INSCRIÇÃO
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
