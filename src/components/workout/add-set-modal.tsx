import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Minus } from "lucide-react";

interface AddSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseName: string;
  onAddSet: (data: { weight: number; reps: number }) => void;
}

export function AddSetModal({ isOpen, onClose, exerciseName, onAddSet }: AddSetModalProps) {
  const [weight, setWeight] = useState(0);
  const [reps, setReps] = useState(8);

  const handleSubmit = () => {
    onAddSet({ weight, reps });
    onClose();
    setWeight(0);
    setReps(8);
  };

  const adjustValue = (value: number, setter: (value: number) => void, increment: number) => {
    const newValue = Math.max(0, value + increment);
    setter(newValue);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-spotify-card border-border max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg">{exerciseName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="weight" className="text-sm font-medium">Peso (kg)</Label>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustValue(weight, setWeight, -0.5)}
                className="h-10 w-10 rounded-full border-border hover:bg-spotify-surface"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                id="weight"
                type="number"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="text-center text-lg font-semibold bg-spotify-surface border-border"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustValue(weight, setWeight, 0.5)}
                className="h-10 w-10 rounded-full border-border hover:bg-spotify-surface"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reps" className="text-sm font-medium">Repetições</Label>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustValue(reps, setReps, -1)}
                className="h-10 w-10 rounded-full border-border hover:bg-spotify-surface"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                id="reps"
                type="number"
                value={reps}
                onChange={(e) => setReps(Number(e.target.value))}
                className="text-center text-lg font-semibold bg-spotify-surface border-border"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustValue(reps, setReps, 1)}
                className="h-10 w-10 rounded-full border-border hover:bg-spotify-surface"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-border hover:bg-spotify-surface"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-primary hover:bg-spotify-green-hover shadow-spotify"
            >
              Adicionar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}