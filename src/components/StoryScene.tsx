import { useEffect, useRef, useState } from "react";
import { ALERT_SPRITE, BASE_PALETTE, MEGAPHONE_SPRITE, PERSON_SPRITE, SUIT_SPRITE } from "../art/sprites";
import { Sprite } from "../art/spriteEngine";
import type { SpriteGrid } from "../art/spriteEngine";
import { playCombineSuccess, playGlitch, playTypeTick } from "../audio/synth";
import { t } from "../i18n";
import type { SceneCard, SceneSourceKind } from "../levels/types";
import { useGameStore } from "../store/gameStore";

const TYPE_MS_PER_CHAR = 12;

const KIND_SPRITE: Record<SceneSourceKind, SpriteGrid> = {
  victim: PERSON_SPRITE,
  bystander: PERSON_SPRITE,
  perp: SUIT_SPRITE,
  system: ALERT_SPRITE,
  public: MEGAPHONE_SPRITE,
};

const KIND_CARD_CLASS: Record<SceneSourceKind, string> = {
  victim: "border-accent/40",
  bystander: "border-border",
  perp: "border-warn/40 glitch-shift",
  system: "border-border",
  public: "border-border",
};

const KIND_AUTHOR_CLASS: Record<SceneSourceKind, string> = {
  victim: "text-accent",
  bystander: "text-text-dim",
  perp: "text-warn",
  system: "text-text-dim",
  public: "text-text-bright",
};

/** For an outro card's `answers`, finds the referenced intro card's opening line to render struck-through. */
function findAnsweredLine(
  introCards: SceneCard[] | undefined,
  answers: string | undefined,
  lang: "en" | "id",
): string | null {
  if (!answers || !introCards) return null;
  const card = introCards.find((c) => c.id === answers);
  if (!card || card.body.length === 0) return null;
  return t(card.body[0], lang);
}

/**
 * Full-bleed before/after victim scene — an intercepted-comms feed the player taps through card
 * by card. Reads `introActive`/`outroActive` directly from the store (self-contained, same
 * pattern as BriefingDialog/NetworkMap) rather than taking props, since it's a singleton overlay
 * mounted once in App.tsx. Renders above BriefingDialog's z-layer so the sequence on a level with
 * both is: intro scene -> briefing -> play -> outro scene -> BreachedScreen.
 */
export function StoryScene() {
  const introActive = useGameStore((s) => s.introActive);
  const outroActive = useGameStore((s) => s.outroActive);
  const level = useGameStore((s) => s.level);
  const lang = useGameStore((s) => s.lang);
  const discovered = useGameStore((s) => s.discovered);
  const dismissIntro = useGameStore((s) => s.dismissIntro);
  const dismissOutro = useGameStore((s) => s.dismissOutro);

  const tone: "intro" | "outro" | null = introActive ? "intro" : outroActive ? "outro" : null;
  const scene = tone === "intro" ? level.intro : tone === "outro" ? level.outro : undefined;
  const cards = (scene?.cards ?? []).filter(
    (c) => !c.requiresFacts || c.requiresFacts.every((f) => discovered[f]),
  );
  const closerText = scene?.closer ? t(scene.closer, lang) : "";

  const [revealedCount, setRevealedCount] = useState(1);
  const [closerCharIndex, setCloserCharIndex] = useState(0);
  const sceneKeyRef = useRef<string | null>(null);

  const sceneKey = `${level.id}-${tone ?? "none"}`;
  useEffect(() => {
    if (sceneKeyRef.current === sceneKey) return;
    sceneKeyRef.current = sceneKey;
    setRevealedCount(1);
    setCloserCharIndex(0);
  }, [sceneKey]);

  const allCardsShown = revealedCount >= cards.length;

  useEffect(() => {
    if (!scene?.closer || !allCardsShown) return;
    if (closerCharIndex >= closerText.length) return;
    const timer = window.setTimeout(() => {
      if (closerCharIndex % 2 === 0) playTypeTick();
      setCloserCharIndex((c) => c + 1);
    }, TYPE_MS_PER_CHAR);
    return () => window.clearTimeout(timer);
  }, [scene, allCardsShown, closerCharIndex, closerText]);

  if (!tone || !scene) return null;

  const hasCloser = Boolean(scene.closer);
  const closerDone = !hasCloser || closerCharIndex >= closerText.length;
  const buttonVisible = allCardsShown && closerDone;

  function dismiss() {
    if (tone === "intro") dismissIntro();
    else dismissOutro();
  }

  function advance() {
    if (!allCardsShown) {
      const next = cards[revealedCount];
      setRevealedCount((c) => c + 1);
      if (next.kind === "perp") {
        playGlitch();
        navigator.vibrate?.([15, 40, 15]);
      } else if (tone === "outro" && next.answers) {
        playCombineSuccess();
      } else {
        playTypeTick();
      }
      return;
    }
    if (hasCloser && closerCharIndex < closerText.length) {
      setCloserCharIndex(closerText.length);
    }
  }

  return (
    <div className="absolute inset-0 z-[60] flex flex-col bg-bg" onClick={advance}>
      <div className="flex shrink-0 items-center justify-between px-4 pt-4">
        <p className="text-[10px] tracking-widest text-text-dim">{t(scene.kicker, lang)}</p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            dismiss();
          }}
          className="min-h-[32px] px-2 text-[10px] tracking-wide text-text-dim active:text-accent"
        >
          Skip
        </button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-end gap-3 overflow-y-auto p-4">
        {cards.slice(0, revealedCount).map((card) => {
          const answeredLine =
            tone === "outro" ? findAnsweredLine(level.intro?.cards, card.answers, lang) : null;
          return (
            <div
              key={card.id}
              className={`card-in flex flex-col gap-2 rounded border p-3 ${KIND_CARD_CLASS[card.kind]}`}
            >
              <div className="flex items-center gap-2">
                <Sprite grid={KIND_SPRITE[card.kind]} palette={BASE_PALETTE} size={24} />
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-xs font-semibold ${KIND_AUTHOR_CLASS[card.kind]}`}>
                    {t(card.author, lang)}
                  </p>
                  <p className="truncate text-[10px] text-text-dim">
                    {t(card.channel, lang)}
                    {card.meta ? ` · ${t(card.meta, lang)}` : ""}
                  </p>
                </div>
              </div>
              {answeredLine && (
                <p className="text-[11px] leading-relaxed text-text-dim line-through opacity-40">
                  {answeredLine}
                </p>
              )}
              <div className="flex flex-col gap-1 text-xs leading-relaxed text-text">
                {card.body.map((line, li) => (
                  <p key={li}>{t(line, lang)}</p>
                ))}
              </div>
            </div>
          );
        })}
        {allCardsShown && scene.closer && (
          <p className="text-center text-xs font-semibold tracking-wide text-text-bright">
            {closerText.slice(0, closerCharIndex)}
            {closerCharIndex < closerText.length && <span className="cursor-blink">_</span>}
          </p>
        )}
      </div>
      <div className="shrink-0 p-4">
        {buttonVisible ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              dismiss();
            }}
            className="min-h-[44px] w-full rounded border border-accent/40 text-xs font-medium tracking-wide text-accent active:bg-accent-dim"
          >
            Continue
          </button>
        ) : (
          <p className="text-center text-[10px] text-text-dim">Tap to continue</p>
        )}
      </div>
    </div>
  );
}
