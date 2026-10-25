import React from 'react';
import { GameItem } from '../types';
import { Check } from 'lucide-react';

interface GameListProps {
  games: GameItem[];
  selectedGameId: string;
  onSelectGame: (game: GameItem) => void;
}

export const GameList: React.FC<GameListProps> = ({
  games,
  selectedGameId,
  onSelectGame
}) => {
  return (
    <div className="game-list" data-testid="list-games">
      {games.map((game) => {
        const isSelected = game.id === selectedGameId;

        return (
          <button
            key={game.id}
            type="button"
            className={`game-row ${isSelected ? 'is-selected' : ''}`}
            onClick={() => onSelectGame(game)}
            aria-pressed={isSelected}
            data-testid={`button-select-game-${game.id}`}
          >
            {/* Game Mark / Thumbnail */}
            <div className={`game-mark ${game.palette}`} aria-hidden="true">
              {game.image ? (
                <img
                  className="game-mark-image"
                  src={game.image}
                  alt={game.name}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    // Fallback to stylized letter if image fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : null}
              <span className="game-mark-letter font-display">{game.mark}</span>
            </div>

            {/* Game Info */}
            <div className="game-info">
              <span className="game-kicker font-mono">
                {game.index} / <span>{game.short}</span>
              </span>
              <strong>{game.name}</strong>
              <small>{game.subtitle}</small>
            </div>

            {/* Radio Indicator */}
            <div className={`game-radio ${isSelected ? 'checked' : ''}`}>
              {isSelected && <Check size={12} strokeWidth={3} />}
            </div>
          </button>
        );
      })}
    </div>
  );
};
