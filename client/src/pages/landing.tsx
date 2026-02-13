import { motion, AnimatePresence } from "framer-motion";
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
import { MapPin, Shirt, CreditCard, QrCode, ArrowRight, ArrowLeft, Check, Copy, Loader2, Lock, Users } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Schema for Step 1
const personalDataSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  telefone: z.string().min(10, "Telefone inválido"),
  tamanho: z.string().min(1, "Selecione um tamanho"),
});

// Schema for Step 2 (Payment)
const paymentSchema = z.object({
  paymentMethod: z.enum(["pix", "credit_card"]),
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
}).refine((data) => {
  if (data.paymentMethod === "credit_card") {
    return !!data.cardNumber && !!data.cardName && !!data.cardExpiry && !!data.cardCvv;
  }
  return true;
}, {
  message: "Preencha todos os dados do cartão",
  path: ["cardNumber"], // Focus error on card number field
});

type PersonalData = z.infer<typeof personalDataSchema>;
type PaymentData = z.infer<typeof paymentSchema>;

import logoHumani from '@assets/Logo_Humani_Branco_1770990681867.png';

export default function LandingPage() {
  const { addInscription, config } = useInscriptionStore();
  const { toast } = useToast();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form 1: Personal Data
  const formPersonal = useForm<PersonalData>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: {
      nome: "",
      telefone: "",
      tamanho: "",
    },
  });

  // Form 2: Payment
  const formPayment = useForm<PaymentData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: "pix",
      cardNumber: "",
      cardName: "",
      cardExpiry: "",
      cardCvv: "",
    },
  });

  const paymentMethod = formPayment.watch("paymentMethod");

  // Handle Step 1 Submit
  const onPersonalSubmit = (data: PersonalData) => {
    setPersonalData(data);
    setStep(2);
  };

  // Handle Step 2 Submit (Final)
  const onPaymentSubmit = (paymentData: PaymentData) => {
    if (!personalData) return;

    setIsProcessing(true);

    // Simulate Payment Processing
    setTimeout(() => {
      addInscription({
        nome: personalData.nome,
        telefone: personalData.telefone,
        tamanho: personalData.tamanho,
        pagamentoConfirmado: true
      });
      
      setIsProcessing(false);
      setStep(3);

      if (paymentData.paymentMethod === "credit_card") {
        const message = encodeURIComponent(`Olá! Acabei de realizar minha inscrição para a Happy Run pelo cartão e gostaria de confirmar os próximos passos.`);
        window.open(`https://api.whatsapp.com/send?phone=5515991232959&text=${message}`, '_blank');
      }
    }, 2000);
  };

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
    
    formPersonal.setValue("telefone", value);
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(config.pixKey);
    toast({
      title: "Código Copiado!",
      description: "Cole no seu app do banco para pagar.",
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground flex flex-col justify-between p-4">
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

      <div className="container max-w-6xl relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-24 items-center flex-grow pt-8 mx-auto">
        {/* Left Column: Hero Text */}
        <div className="space-y-8 text-center lg:text-left flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8 flex justify-center lg:justify-start">
              <img src={logoHumani} alt="Humani Treinamentos" className="h-16 md:h-20 object-contain" />
            </div>
            <h2 className="text-primary font-bold tracking-widest uppercase mb-2 text-xl">
              Corrida no Bandeiras
            </h2>
            <h1 className="text-6xl lg:text-9xl font-display leading-[0.9] mb-6 text-white drop-shadow-2xl whitespace-nowrap">
              Happy <span className="text-primary glow-text">Run</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground font-light max-w-2xl mx-auto lg:mx-0">
              Corrida com Happy Hour, aberta ao público. <br/>
              Homenagem ao dia internacional da mulher.
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
                <div className="text-sm font-semibold">Bandeiras - Votorantim<br/>19 de Março - 19h30</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-card/50 px-5 py-3 rounded-xl border border-primary/20 backdrop-blur-sm">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Shirt size={24} />
              </div>
              <div className="text-left">
                <div className="text-xs text-primary font-bold uppercase tracking-wider">Valor</div>
                <div className="text-sm font-semibold">Inscrição R$ 60,00<br/>Happy Hour Incluso</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Multi-step Form */}
        <div className="w-full min-h-[500px] flex items-center">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full glass-panel p-8 md:p-10 rounded-3xl relative overflow-hidden"
              >
                <div className="mb-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="flex items-center gap-2">
                       <span className="w-8 h-8 rounded-full bg-primary text-background font-bold flex items-center justify-center">1</span>
                       <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                         <div className="w-1/2 h-full bg-primary/50" />
                       </div>
                       <span className="w-8 h-8 rounded-full bg-muted text-muted-foreground font-bold flex items-center justify-center">2</span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-display text-white mb-2">Dados Pessoais</h3>
                  <p className="text-sm text-muted-foreground">Vamos começar sua inscrição</p>
                </div>

                <Form {...formPersonal}>
                  <form onSubmit={formPersonal.handleSubmit(onPersonalSubmit)} className="space-y-6">
                    <FormField
                      control={formPersonal.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-bold uppercase text-xs tracking-wider">Nome Completo</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Digite seu nome completo" 
                              {...field} 
                              className="bg-background/50 border-primary/20 focus-visible:ring-primary/50 h-12 rounded-xl"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={formPersonal.control}
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
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={formPersonal.control}
                        name="tamanho"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary font-bold uppercase text-xs tracking-wider">Camisa</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background/50 border-primary/20 focus:ring-primary/50 h-12 rounded-xl">
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

                    <Button 
                      type="submit" 
                      className="w-full h-14 text-lg font-display tracking-widest bg-primary hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 text-background rounded-xl mt-4"
                    >
                      CONTINUAR <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </form>
                </Form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full glass-panel p-8 md:p-10 rounded-3xl relative overflow-hidden"
              >
                <div className="mb-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="flex items-center gap-2">
                       <span className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center cursor-pointer" onClick={() => setStep(1)}><Check className="w-4 h-4"/></span>
                       <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                         <div className="w-full h-full bg-primary" />
                       </div>
                       <span className="w-8 h-8 rounded-full bg-primary text-background font-bold flex items-center justify-center">2</span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-display text-white mb-2">Pagamento</h3>
                  <p className="text-sm text-muted-foreground">Escolha a forma de pagamento</p>
                </div>

                <Form {...formPayment}>
                  <form onSubmit={formPayment.handleSubmit(onPaymentSubmit)} className="space-y-6">
                    <FormField
                      control={formPayment.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-2 gap-4 space-y-0">
                          <div 
                            className={`
                              flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all h-24
                              ${paymentMethod === 'pix' ? 'border-primary bg-primary/10 text-primary' : 'border-muted bg-background/50 text-muted-foreground hover:border-primary/50'}
                            `}
                            onClick={() => formPayment.setValue("paymentMethod", "pix")}
                          >
                             <QrCode className="w-8 h-8 mb-2" />
                             <span className="text-xs font-bold uppercase">Pix</span>
                          </div>
                          
                          <div 
                            className={`
                              flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all h-24
                              ${paymentMethod === 'credit_card' ? 'border-primary bg-primary/10 text-primary' : 'border-muted bg-background/50 text-muted-foreground hover:border-primary/50'}
                            `}
                            onClick={() => formPayment.setValue("paymentMethod", "credit_card")}
                          >
                             <CreditCard className="w-8 h-8 mb-2" />
                             <span className="text-xs font-bold uppercase">Cartão</span>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="mt-6 p-4 bg-background/30 rounded-xl border border-primary/10 min-h-[220px]">
                      {paymentMethod === 'pix' ? (
                        <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 py-4">
                           <div className="space-y-2">
                             <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Valor da Inscrição</p>
                             <div className="text-5xl font-display text-white">R$ 60,00</div>
                           </div>
                           
                           <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 space-y-4">
                             <p className="text-xs text-primary font-bold uppercase tracking-wider mb-2">Chave PIX (Copia e Cola)</p>
                             <div 
                               onClick={copyPixCode}
                               className="relative group cursor-pointer bg-background/50 border border-primary/30 rounded-xl p-4 transition-all hover:bg-primary/10 hover:border-primary/50"
                             >
                               <p className="font-mono text-sm break-all text-white/90 uppercase leading-relaxed select-all">
                                 {config.pixKey}
                               </p>
                               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm rounded-xl">
                                 <span className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm">
                                   <Copy className="w-4 h-4" /> Copiar Código
                                 </span>
                               </div>
                             </div>
                             <p className="text-xs text-muted-foreground">Clique no código acima para copiar</p>
                           </div>
                        </div>
                      ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                           <div className="flex items-center justify-between mb-4">
                             <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Dados do Cartão</p>
                             <div className="flex gap-2">
                               <div className="w-8 h-5 bg-white/10 rounded flex items-center justify-center text-[8px] font-bold">VISA</div>
                               <div className="w-8 h-5 bg-white/10 rounded flex items-center justify-center text-[8px] font-bold">MASTER</div>
                             </div>
                           </div>
                           
                          <FormField
                            control={formPayment.control}
                            name="cardNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs font-bold text-primary uppercase tracking-wider">Número do Cartão</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input 
                                      placeholder="0000 0000 0000 0000" 
                                      {...field} 
                                      maxLength={19}
                                      onChange={(e) => {
                                        // Mask card number
                                        let v = e.target.value.replace(/\D/g, '');
                                        if (v.length > 16) v = v.slice(0, 16);
                                        const parts = v.match(/[\s\S]{1,4}/g) || [];
                                        field.onChange(parts.join(' '));
                                      }}
                                      className="pl-11 bg-background/50 border-primary/20 h-12 font-mono" 
                                    />
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={formPayment.control}
                            name="cardName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs font-bold text-primary uppercase tracking-wider">Nome no Cartão</FormLabel>
                                <FormControl>
                                  <Input placeholder="COMO ESTÁ NO CARTÃO" {...field} className="bg-background/50 border-primary/20 h-12 uppercase" />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-4">
                             <FormField
                              control={formPayment.control}
                              name="cardExpiry"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs font-bold text-primary uppercase tracking-wider">Validade</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="MM/AA" 
                                      {...field} 
                                      maxLength={5}
                                      onChange={(e) => {
                                        // Mask expiry date
                                        let v = e.target.value.replace(/\D/g, '');
                                        if (v.length > 4) v = v.slice(0, 4);
                                        if (v.length > 2) v = `${v.slice(0, 2)}/${v.slice(2)}`;
                                        field.onChange(v);
                                      }}
                                      className="bg-background/50 border-primary/20 h-12 text-center" 
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={formPayment.control}
                              name="cardCvv"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs font-bold text-primary uppercase tracking-wider">CVV</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                                      <Input 
                                        placeholder="123" 
                                        {...field} 
                                        maxLength={4}
                                        className="pl-10 bg-background/50 border-primary/20 h-12" 
                                        type="password"
                                      />
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="pt-2">
                            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
                              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                              <span className="text-xs text-muted-foreground">Conexão segura com Gateway de Pagamento</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setStep(1)}
                        className="flex-1 h-14 border-primary/20 hover:bg-primary/10 text-primary"
                        disabled={isProcessing}
                      >
                        <ArrowLeft className="mr-2 w-5 h-5" /> VOLTAR
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-[2] h-14 text-lg font-display tracking-widest bg-gradient-to-r from-primary to-secondary hover:brightness-110 transition-all shadow-lg shadow-primary/20 text-background rounded-xl"
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> PROCESSANDO</>
                        ) : (
                          "PAGAR E FINALIZAR"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full glass-panel p-10 rounded-3xl text-center space-y-6"
              >
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                  >
                    <Check className="w-12 h-12 text-primary" strokeWidth={3} />
                  </motion.div>
                </div>
                <div>
                  <h3 className="text-4xl font-display text-primary mb-2">Sucesso!</h3>
                  <p className="text-lg text-white font-medium">Inscrição e Pagamento Confirmados</p>
                  <p className="text-muted-foreground mt-2 text-sm">Enviamos os detalhes para o seu WhatsApp.</p>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 text-left space-y-2 mt-6">
                   <div className="flex justify-between text-sm">
                     <span className="text-muted-foreground">Participante:</span>
                     <span className="font-bold text-white">{personalData?.nome}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                     <span className="text-muted-foreground">Camisa:</span>
                     <span className="font-bold text-white">{personalData?.tamanho}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                     <span className="text-muted-foreground">Status:</span>
                     <span className="font-bold text-green-400">PAGO</span>
                   </div>
                </div>

                <Button 
                  className="w-full mt-6 h-12 border border-primary/30 hover:bg-primary/10 text-primary bg-transparent"
                  onClick={() => {
                    formPersonal.reset();
                    formPayment.reset();
                    setStep(1);
                  }}
                >
                  Nova Inscrição
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Admin Link Footer */}
      <div className="relative z-10 w-full text-center py-4">
        <a href="#/admin" className="text-xs text-muted-foreground/30 hover:text-primary transition-colors uppercase tracking-widest">
          Acesso Administrativo
        </a>
      </div>
    </div>
  );
}
