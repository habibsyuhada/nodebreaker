import { useGameStore } from "../store/gameStore";

/** Small self-dismissing toast stack — surfaces newly-unlocked actions. */
export function NotificationToast() {
  const notifications = useGameStore((s) => s.notifications);
  const dismissNotification = useGameStore((s) => s.dismissNotification);

  if (notifications.length === 0) return null;

  return (
    // Right-aligned corner chip, not a full-width banner — a centered banner here used to sit
    // right at the top of the panel content and block the first lines of whatever the player was
    // reading. A small chip tucked in the corner stays visible without covering the page.
    <div className="pointer-events-none absolute right-2 top-14 z-40 flex flex-col items-end gap-1.5">
      {notifications.map((n) => (
        <button
          key={n.id}
          type="button"
          onClick={() => dismissNotification(n.id)}
          className="pointer-events-auto max-w-[220px] rounded border border-accent/40 bg-panel/95 px-2.5 py-1.5 text-left text-[10px] leading-snug text-accent shadow-lg active:bg-accent-dim"
        >
          {n.text}
        </button>
      ))}
    </div>
  );
}
