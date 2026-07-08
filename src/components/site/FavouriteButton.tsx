import { Heart } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { listFavouriteIds, toggleFavourite } from "@/lib/favourites.functions";
import { useAuth } from "@/hooks/useAuth";

export function FavouriteButton({
  propertyId,
  className = "",
  size = 18,
}: {
  propertyId: string;
  className?: string;
  size?: number;
}) {
  const { signedIn } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchIds = useServerFn(listFavouriteIds);
  const toggle = useServerFn(toggleFavourite);

  const { data: ids } = useQuery({
    queryKey: ["favourite-ids"],
    queryFn: () => fetchIds(),
    enabled: signedIn,
    staleTime: 30_000,
  });

  const isSaved = !!ids?.includes(propertyId);

  const mutate = useMutation({
    mutationFn: async () => toggle({ data: { propertyId } }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["favourite-ids"] });
      qc.invalidateQueries({ queryKey: ["favourites"] });
      toast.success(res.saved ? "Saved to favourites" : "Removed from favourites");
    },
    onError: (e: any) => toast.error(e.message ?? "Something went wrong"),
  });

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!signedIn) {
          toast.message("Sign in to save properties");
          navigate({ to: "/auth" });
          return;
        }
        mutate.mutate();
      }}
      aria-pressed={isSaved}
      aria-label={isSaved ? "Remove from favourites" : "Save to favourites"}
      className={
        "inline-flex size-10 items-center justify-center rounded-full bg-white/95 shadow-sm transition hover:bg-white " +
        (isSaved ? "text-primary" : "text-ink/70") +
        " " +
        className
      }
    >
      <Heart size={size} fill={isSaved ? "currentColor" : "none"} strokeWidth={2} />
    </button>
  );
}
