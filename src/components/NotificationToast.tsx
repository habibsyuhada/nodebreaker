import { useGameStore } from "../store/gameStore";

/** Small self-dismissing toast stack — surfaces clue saves and newly-unlocked actions. */
export function NotificationToast() {
  const notifications = useGameStore((s) => s.notifications);
  const dismissNotification = useGameStore((s) => s.dismissNotification);

  if (notifications.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-14 z-40 flex flex-col items-center gap-2 px-3">
      {notifications.map((n) => (
        <button
          key={n.id}
          type="button"
          onClick={() => dismissNotification(n.id)}
          className="pointer-events-auto max-w-[92%] rounded border border-accent/40 bg-panel px-3 py-2 text-center text-[11px] text-accent shadow-lg active:bg-accent-dim"
        >
          {n.text}
        </button>
      ))}
    </div>
  );
}
