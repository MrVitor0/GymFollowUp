import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Scale } from "lucide-react";

export default function CorpoPage() {
  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Composição Corporal
          </h1>
          <p className="text-(--text-secondary) mt-1">
            Importe dados e acompanhe sua evolução
          </p>
        </div>

        <Card className="p-6 flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
            <Scale size={24} className="text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Em breve</h2>
            <p className="text-sm text-(--text-secondary) mt-1">
              A composição corporal será exibida aqui
            </p>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
