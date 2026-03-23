import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { BarChart3 } from "lucide-react";

export default function HistoricoPage() {
  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Histórico</h1>
          <p className="text-(--text-secondary) mt-1">
            Veja suas sessões de treino passadas
          </p>
        </div>

        <Card className="p-6 flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
            <BarChart3 size={24} className="text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Em breve</h2>
            <p className="text-sm text-(--text-secondary) mt-1">
              O histórico de treinos será exibido aqui
            </p>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
