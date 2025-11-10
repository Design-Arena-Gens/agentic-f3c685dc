"use client";

import { useCallback, useMemo, useRef, useState } from 'react';
import { createAudioContext, playDoubleKnock, playGlitch, playHeartbeat, playRumble, sleep } from '@/lib/audio';
import { speak } from '@/lib/tts';

export default function Experience() {
  const [started, setStarted] = useState(false);
  const [line, setLine] = useState<string>("");
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const finalRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  const ensureAudio = useCallback(async () => {
    if (!audioRef.current) {
      audioRef.current = createAudioContext();
    }
    if (audioRef.current.state !== 'running') {
      await audioRef.current.resume();
    }
    return audioRef.current;
  }, []);

  const setFlicker = useCallback((on: boolean) => {
    const el = sceneRef.current;
    if (!el) return;
    el.classList.toggle('flicker', on);
  }, []);

  const blackout = useCallback(() => {
    sceneRef.current?.classList.add('blackout');
  }, []);

  const revealFinal = useCallback(() => {
    const el = finalRef.current;
    if (el) el.style.display = 'grid';
  }, []);

  const run = useCallback(async () => {
    setStarted(true);
    const ctx = await ensureAudio();

    setLine('Raat ke do baje mere kamre ke darwaze pe kisi ne knock kiya?');
    await speak('Raat ke do baje mere kamre ke darwaze pe kisi ne knock kiya?', { rate: 0.85, pitch: 0.75 });
    await sleep(1000);

    setLine('Main akela tha ghar mein.');
    await speak('Main akela tha ghar mein.', { rate: 0.85, pitch: 0.75 });
    playDoubleKnock(ctx, false);
    await sleep(600);

    setLine('Pehle laga hawa hogi? lekin phir knock fir se hua ? is baar zyada zor se.');
    setFlicker(true);
    await speak('Pehle laga hawa hogi? lekin phir knock fir se hua ? is baar zyada zor se.', { rate: 0.86, pitch: 0.75 });
    playDoubleKnock(ctx, true);
    await sleep(700);
    setFlicker(false);

    setLine('Main ne flashlight uthayi, aur darwaze ke paas gaya.');
    playRumble(ctx, 2.6);
    await speak('Main ne flashlight uthayi, aur darwaze ke paas gaya.', { rate: 0.88, pitch: 0.78 });

    setLine('Andar se awaaz aayi? ek ladki ki halki si fusi hui aawaz ?');
    await speak('Andar se awaaz aayi? ek ladki ki halki si fusi hui aawaz ?', { rate: 0.86, pitch: 0.8 });
    setLine('?Please? madad karo??');
    await speak('Please? madad karo?', { rate: 0.9, pitch: 1.35, volume: 0.7 });
    await sleep(350);

    setLine('Darwaza kholte hi ek thandi hawa ka jhonka aaya? lekin koi nahi tha.');
    await speak('Darwaza kholte hi ek thandi hawa ka jhonka aaya? lekin koi nahi tha.', { rate: 0.84, pitch: 0.75 });

    setLine('Sirf floor pe ek purani polaroid photo padhi thi? meri.');
    playHeartbeat(ctx, 4, 64);
    await speak('Sirf floor pe ek purani polaroid photo padhi thi? meri.', { rate: 0.84, pitch: 0.72 });

    setLine('Lekin us photo mein main darwaze ke bahar khada tha.');
    await speak('Lekin us photo mein main darwaze ke bahar khada tha.', { rate: 0.84, pitch: 0.72 });
    await sleep(2000);

    setLine('Mujhe ab tak samajh nahi aaya? us raat knock kisne kiya tha ? main to andar tha.');
    await speak('Mujhe ab tak samajh nahi aaya? us raat knock kisne kiya tha ? main to andar tha.', { rate: 0.78, pitch: 0.62, volume: 0.9 });

    playGlitch(ctx, 0.5);
    blackout();
    await sleep(700);
    revealFinal();
  }, [blackout, ensureAudio, revealFinal, setFlicker]);

  const onStart = useCallback(async () => {
    await run();
  }, [run]);

  return (
    <div ref={sceneRef} className="scene">
      <div className="content">
        {!started && (
          <>
            <h1 className="title">Midnight Knock</h1>
            <p className="subtitle">Wear headphones. Click Start. Allow audio. Dim the lights.</p>
            <button className="startBtn" onClick={onStart}>Start</button>
          </>
        )}
        {started && (
          <>
            <p className="subtitle" aria-live="polite">{line}</p>
          </>
        )}
      </div>
      <div ref={finalRef} style={{ display: 'none' }} className="finalText">
        <div className="glitch" data-text="??? ?Sometimes? the one knocking isn?t outside.?">??? ?Sometimes? the one knocking isn?t outside.?</div>
      </div>
    </div>
  );
}
