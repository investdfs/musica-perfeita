
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { MusicRequest, UserProfile } from "@/types/database.types";

interface AnalyticsDashboardProps {
  requests: MusicRequest[];
  users: UserProfile[];
}

const AnalyticsDashboard = ({ requests, users }: AnalyticsDashboardProps) => {
  const [timeFrame, setTimeFrame] = useState<"week" | "month" | "year">("month");
  
  // Calculate dashboard metrics
  const totalRequests = requests.length;
  const completedRequests = requests.filter(r => r.status === "completed").length;
  const pendingRequests = requests.filter(r => r.status === "pending").length;
  const inProductionRequests = requests.filter(r => r.status === "in_production").length;
  const paidRequests = requests.filter(r => r.payment_status === "completed").length;
  const completionRate = totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 0;
  const paymentRate = totalRequests > 0 ? Math.round((paidRequests / totalRequests) * 100) : 0;
  
  // Prepare data for charts
  const statusData = [
    { name: "Pendente", value: pendingRequests },
    { name: "Em Produção", value: inProductionRequests },
    { name: "Concluído", value: completedRequests },
  ];
  
  const COLORS = ["#FFBB28", "#0088FE", "#00C49F"];
  
  // Generate mock data for trends over time
  const generateTrendsData = () => {
    const periods = timeFrame === "week" ? 7 : timeFrame === "month" ? 4 : 12;
    const labels = timeFrame === "week" 
      ? ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"] 
      : timeFrame === "month" 
        ? ["Semana 1", "Semana 2", "Semana 3", "Semana 4"]
        : ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        
    return Array.from({ length: periods }, (_, i) => ({
      name: labels[i],
      requests: Math.floor(Math.random() * 10),
      revenue: Math.floor(Math.random() * 5000)
    }));
  };
  
  const trendsData = generateTrendsData();
  
  const handleTimeFrameChange = (timeFrame: "week" | "month" | "year") => {
    setTimeFrame(timeFrame);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Painel de Análises</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => handleTimeFrameChange("week")}
            className={`px-3 py-1 rounded ${timeFrame === "week" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Semana
          </button>
          <button 
            onClick={() => handleTimeFrameChange("month")}
            className={`px-3 py-1 rounded ${timeFrame === "month" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Mês
          </button>
          <button 
            onClick={() => handleTimeFrameChange("year")}
            className={`px-3 py-1 rounded ${timeFrame === "year" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Ano
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Totais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequests}</div>
            <p className="text-xs text-muted-foreground">
              {paidRequests} pagos ({paymentRate}%)
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {completedRequests} de {totalRequests} pedidos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Usuários Registrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((totalRequests / Math.max(users.length, 1)) * 100) / 100} pedidos por usuário
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Status dos Pedidos</CardTitle>
            <CardDescription>Distribuição dos pedidos por status</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Tendências de Pedidos</CardTitle>
            <CardDescription>
              Número de pedidos por {timeFrame === "week" ? "dia" : timeFrame === "month" ? "semana" : "mês"}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="requests" fill="#0088FE" name="Pedidos" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
