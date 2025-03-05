
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { testEmailIntegration } from "@/lib/email";
import { toast } from "@/hooks/use-toast";

const EmailTester = () => {
  const [email, setEmail] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const handleTestEmail = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um endereço de email válido.",
        variant: "destructive"
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await testEmailIntegration(email);
      setTestResult(result);
      
      if (result.success) {
        toast({
          title: "Teste realizado com sucesso",
          description: result.isDevelopment 
            ? "Email simulado no ambiente de desenvolvimento" 
            : "Email enviado com sucesso"
        });
      } else {
        toast({
          title: "Erro no teste",
          description: result.message || "Não foi possível testar o envio de email",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro ao testar integração de email:", error);
      setTestResult({
        success: false,
        message: "Erro ao processar o teste",
        error
      });
      
      toast({
        title: "Erro no teste",
        description: "Ocorreu um erro inesperado ao testar o envio de email",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Testar Integração com Resend</CardTitle>
        <CardDescription>
          Envie um email de teste para verificar se a integração com o Resend está funcionando corretamente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="test-email" className="text-sm font-medium">
            Email para teste
          </label>
          <Input
            id="test-email"
            type="email"
            placeholder="exemplo@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {testResult && (
          <div className={`p-3 text-sm rounded-md ${testResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className={testResult.success ? 'text-green-700' : 'text-red-700'}>
              <strong>Status:</strong> {testResult.success ? 'Sucesso' : 'Falha'}
            </p>
            <p className="text-gray-700"><strong>Mensagem:</strong> {testResult.message}</p>
            <p className="text-gray-700"><strong>API Key (parcial):</strong> {testResult.resendApiKey}</p>
            <p className="text-gray-700">
              <strong>Ambiente:</strong> {testResult.isDevelopment ? 'Desenvolvimento (simulação)' : 'Produção'}
            </p>
            {testResult.messageId && (
              <p className="text-gray-700"><strong>ID da mensagem:</strong> {testResult.messageId}</p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleTestEmail} 
          disabled={isTesting || !email}
          className="w-full"
        >
          {isTesting ? "Testando..." : "Enviar Email de Teste"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmailTester;
