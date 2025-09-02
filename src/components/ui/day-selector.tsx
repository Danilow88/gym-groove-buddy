import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Calendar, Check } from "lucide-react";

interface DaySelectorProps {
  selectedDays: string[];
  onDaysChange: (days: string[]) => void;
  className?: string;
  disabled?: boolean;
  multiple?: boolean;
  showBadges?: boolean;
}

const daysOfWeek = [
  { key: 'monday', short: 'Seg', full: 'Segunda' },
  { key: 'tuesday', short: 'Ter', full: 'Terça' },
  { key: 'wednesday', short: 'Qua', full: 'Quarta' },
  { key: 'thursday', short: 'Qui', full: 'Quinta' },
  { key: 'friday', short: 'Sex', full: 'Sexta' },
  { key: 'saturday', short: 'Sáb', full: 'Sábado' },
  { key: 'sunday', short: 'Dom', full: 'Domingo' }
];

export function DaySelector({ 
  selectedDays = [], 
  onDaysChange, 
  className = "",
  disabled = false,
  multiple = true,
  showBadges = true
}: DaySelectorProps) {
  
  const handleDayToggle = (dayKey: string) => {
    if (disabled) return;
    
    if (multiple) {
      // Modo múltiplo: adiciona/remove dias
      const newSelectedDays = selectedDays.includes(dayKey)
        ? selectedDays.filter(day => day !== dayKey)
        : [...selectedDays, dayKey];
      onDaysChange(newSelectedDays);
    } else {
      // Modo único: seleciona apenas um dia
      const newSelectedDays = selectedDays.includes(dayKey) ? [] : [dayKey];
      onDaysChange(newSelectedDays);
    }
  };

  const handleSelectAll = () => {
    if (disabled) return;
    const allDays = daysOfWeek.map(day => day.key);
    onDaysChange(selectedDays.length === allDays.length ? [] : allDays);
  };

  const getSelectedDaysText = () => {
    if (selectedDays.length === 0) return "Nenhum dia selecionado";
    if (selectedDays.length === 7) return "Todos os dias";
    if (selectedDays.length === 1) {
      const day = daysOfWeek.find(d => d.key === selectedDays[0]);
      return day?.full || selectedDays[0];
    }
    return `${selectedDays.length} dias selecionados`;
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Dias da Semana</span>
          {showBadges && (
            <Badge variant="secondary" className="text-xs">
              {getSelectedDaysText()}
            </Badge>
          )}
        </div>
        
        {multiple && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSelectAll}
            disabled={disabled}
            className="text-xs h-6 px-2"
          >
            {selectedDays.length === 7 ? "Limpar" : "Todos"}
          </Button>
        )}
      </div>

      {/* Grid de dias da semana */}
      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map((day) => {
          const isSelected = selectedDays.includes(day.key);
          
          return (
            <Button
              key={day.key}
              type="button"
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => handleDayToggle(day.key)}
              disabled={disabled}
              className={cn(
                "relative h-12 p-1 flex flex-col items-center justify-center",
                isSelected 
                  ? "bg-spotify-green hover:bg-spotify-green/90 text-white border-spotify-green" 
                  : "hover:bg-muted/50"
              )}
            >
              <span className="text-xs font-medium leading-tight">
                {day.short}
              </span>
              {isSelected && (
                <Check className="h-3 w-3 absolute top-1 right-1" />
              )}
            </Button>
          );
        })}
      </div>

      {/* Dias selecionados em texto (versão compacta) */}
      {showBadges && selectedDays.length > 0 && selectedDays.length < 7 && (
        <div className="flex flex-wrap gap-1">
          {selectedDays.map(dayKey => {
            const day = daysOfWeek.find(d => d.key === dayKey);
            return (
              <Badge key={dayKey} variant="outline" className="text-xs">
                {day?.full}
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
