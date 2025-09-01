import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Play, TrendingUp, Users, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/gym-hero.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Gym equipment" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Gym Groove Buddy
          </h1>
          <p className="text-muted-foreground">
            Seu companheiro de treino definitivo
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6">
        {/* Quick Start */}
        <Card className="bg-gradient-primary border-0 p-6 shadow-spotify">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                Pronto para treinar?
              </h2>
              <p className="text-white/80 text-sm">
                Comece seu treino agora mesmo
              </p>
            </div>
            <Button
              onClick={() => navigate("/workout")}
              size="lg"
              className="bg-white text-spotify-green hover:bg-white/90 shadow-lg"
            >
              <Play className="h-5 w-5 mr-2" />
              Iniciar
            </Button>
          </div>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-card border-border p-4 hover:shadow-card transition-all duration-300">
            <div className="text-center">
              <div className="w-12 h-12 bg-spotify-green/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-spotify-green" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Progresso</h3>
              <p className="text-xs text-muted-foreground">
                Acompanhe sua evolução
              </p>
            </div>
          </Card>

          <Card className="bg-gradient-card border-border p-4 hover:shadow-card transition-all duration-300">
            <div className="text-center">
              <div className="w-12 h-12 bg-spotify-green/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Play className="h-6 w-6 text-spotify-green" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Vídeos</h3>
              <p className="text-xs text-muted-foreground">
                Técnica perfeita
              </p>
            </div>
          </Card>
        </div>

        {/* Tips */}
        <Card className="bg-gradient-card border-border p-4">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Star className="h-5 w-5 text-spotify-green" />
            Dica do Dia
          </h3>
          <p className="text-sm text-muted-foreground">
            Mantenha sempre uma boa postura durante os exercícios. A técnica correta é mais importante que a carga utilizada.
          </p>
        </Card>

        {/* Quick Stats */}
        <div className="bg-spotify-surface rounded-lg p-4">
          <h3 className="font-medium text-foreground mb-3">Estatísticas Rápidas</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-spotify-green">0</div>
              <div className="text-xs text-muted-foreground">Treinos</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-spotify-green">0</div>
              <div className="text-xs text-muted-foreground">Séries</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-spotify-green">0</div>
              <div className="text-xs text-muted-foreground">Esta semana</div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Index;
