

import { Heart } from "lucide-react";
import { useState } from "react";

type SaveButtonProps = {
  label: string;
  className?: string;
  withText?: boolean;
};

export function SaveButton({ label, className = "", withText = false }: SaveButtonProps) {
  const [saved, setSaved] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setSaved((current) => !current)}
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
