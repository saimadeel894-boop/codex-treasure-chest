import { Heart } from "lucide-react";
import type { MouseEvent } from "react";
import { useFavorites } from "@/hooks/use-favorites";

type SaveButtonProps = {
  propertyId: string;
  label: string;
  className?: string;
  withText?: boolean;
};

export function SaveButton({ propertyId, label, className = "", withText = false }: SaveButtonProps) {
  const { isFavorite, toggle } = useFavorites();
  const saved = isFavorite(propertyId);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(propertyId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      aria-label={saved ? `Remove ${label} from saved properties` : `Save ${label}`}
      aria-pressed={saved}
      title={saved ? "Saved" : "Save property"}
    >
      <Heart
        size={18}
        className={saved ? "fill-rose-500 text-rose-500" : ""}
        aria-hidden="true"
      />
      {withText ? <span>{saved ? "Saved" : "Save"}</span> : null}
    </button>
  );
}
