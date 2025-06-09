import React, { lazy, useEffect, useRef, useState, Suspense } from "react";
import s from "./App.module.css";
import text_1 from "assets/img-webp/text_1.webp?url";
import text_2 from "assets/img-webp/text_2.webp?url";
import text_3 from "assets/img-webp/text_3.webp?url";
import text_4 from "assets/img-webp/text_4.webp?url";
import closeImage from "assets/img-webp/close_black.webp?url";
import logo from "assets/img-webp/logo.webp?url";
import loading from "assets/img-webp/loading.webp?url";
import slider_text from "assets/img-webp/slider_text.webp?url";
import cta from "assets/img-webp/cta.webp?url";
import flash from "assets/img-webp/flash.webp?url";
import { RainDrop } from "modules/rain-drop";
import { delay } from "utils/delay";
import { preload } from "react-dom";
import classNames from "classnames";

const Rain = lazy(() =>
  import("./components/Rain/Rain").then((module) => ({ default: module.Rain }))
);
const Internals = lazy(() =>
  import("./components/Internals/Internals").then((module) => ({
    default: module.Internals,
  }))
);
const Phone = lazy(() =>
  import("./components/Phone/Phone").then((module) => ({
    default: module.Phone,
  }))
);

const animationProgress = (start: number, end: number, duration: number) => {
  let startTime = 0;

  return (time: number) => {
    if (!startTime) {
      startTime = time;
    }

    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const current = start + (end - start) * progress;

    return { current, progress };
  };
};

const BANNER_WIDTH = 970;
const BANNER_HEIGHT = 250;

const FRAMES = 58;
const FRAME_HEIGHT = 221;
const MAX_DROPS = 25;

export const App = () => {
  preload(loading, { as: "image", fetchPriority: "high" });
  preload(logo, { as: "image", fetchPriority: "high" });

  preload(flash, { as: "image" });
  preload(text_1, { as: "image" });
  preload(text_2, { as: "image" });
  preload(text_3, { as: "image" });
  preload(text_4, { as: "image" });

  const mainRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const phoneSpriteRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const [isVisibleInternalsContainer, setIsVisibleInternalsContainer] =
    useState(false);
  const cardHighlightRef = useRef<HTMLDivElement>(null);
  const phoneContainerRef = useRef<HTMLDivElement>(null);
  const [isVisibleCta, setIsVisibleCta] = useState(false);
  const [isVisibleSliderText, setIsVisibleSliderText] = useState(false);
  const [isVisibleHighlights_970x250, setIsVisibleHighlights_970x250] =
    useState(false);
  const sliderRef = useRef<HTMLInputElement>(null);
  const [sliderValue, setSliderValue] = useState(0);
  const [hasFlash, setHasFlash] = useState(false);
  const cardHighlighID = useRef(0);
  const [drops, setDrops] = useState<RainDrop[]>([]);
  const dropsRef = useRef<RainDrop[]>([]);
  const lastSpawnTime = useRef(0);
  const [isRaining, setIsRaining] = useState(false);
  const rainTimeoutRef = useRef(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (cardHighlighID.current) {
        clearTimeout(cardHighlighID.current);
      }

      if (rainTimeoutRef.current) {
        clearTimeout(rainTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let animationFrameID: number = 0;

    const animate = (time: number) => {
      if (isRaining && dropsRef.current.length < MAX_DROPS) {
        const drop = new RainDrop();
        dropsRef.current.push(drop);
        lastSpawnTime.current = time;
      }

      dropsRef.current.forEach((drop) => drop.update());
      dropsRef.current = dropsRef.current.filter((drop) => drop.active);

      setDrops([...dropsRef.current]);

      if (!dropsRef.current.length) {
        cancelAnimationFrame(animationFrameID);

        return;
      }

      animationFrameID = requestAnimationFrame(animate);
    };

    animationFrameID = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameID);
    };
  }, [isRaining]);

  const animationSelector = (value: number) => {
    if (textRef.current) {
      textRef.current.style.backgroundImage = `url(${text_1})`;
    }
    setIsVisibleInternalsContainer(false);
    setIsVisibleHighlights_970x250(false);
    setIsRaining(false);
    setPlaying(false);

    if (value === 0) {
      setPlaying(true);
      setIsVisibleHighlights_970x250(true);
    }

    if (value >= 3 && value < 22) {
      if (textRef.current) {
        textRef.current.style.backgroundImage = `url(${text_2})`;
      }

      setIsRaining(true);

      if (rainTimeoutRef.current) {
        clearTimeout(rainTimeoutRef.current);
      }

      rainTimeoutRef.current = setTimeout(() => {
        setIsRaining(false);
      }, 5_000);
    }

    if (value >= 22 && value < 45) {
      if (textRef.current) {
        textRef.current.style.backgroundImage = `url(${text_3})`;
      }
    }

    if (value === 30) {
      turnFlash();
    }

    if (value >= 45) {
      if (textRef.current) {
        textRef.current.style.backgroundImage = `url(${text_4})`;
      }
    }

    if (value === FRAMES) {
      setIsVisibleInternalsContainer(true);
      cardHighlighID.current = setTimeout(highlightCard, 700);
    }
  };

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    console.log("handleSlider", value);

    setSliderValue(value);

    const position = `-${value * FRAME_HEIGHT}px`;

    if (phoneSpriteRef.current) {
      phoneSpriteRef.current.style.backgroundPositionY = position;
    }

    animationSelector(value);
  };

  const close = () => {
    mainRef.current?.remove();
  };

  function highlightCard() {
    const getProgress = animationProgress(0, 250, 600);

    function animate(time: number) {
      const { current: x, progress } = getProgress(time);

      if (cardHighlightRef.current) {
        cardHighlightRef.current.style.transform = `rotate(-15deg) translateX(${x}px)`;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }

  function turnFlash() {
    if (hasFlash) {
      return;
    }

    setHasFlash(true);

    const getProgress = animationProgress(0.3, 2.5, 200);

    function animate(time: number) {
      const { current: scale, progress } = getProgress(time);

      if (flashRef.current) {
        flashRef.current.style.transform = `scale(${scale})`;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setHasFlash(false);
      }
    }

    requestAnimationFrame(animate);
  }

  const slidingPhone = (): Promise<void> => {
    return new Promise((resolve) => {
      const getProgress = animationProgress(250, 0, 500);

      function animate(time: number) {
        const { current: y, progress } = getProgress(time);

        if (phoneContainerRef.current) {
          phoneContainerRef.current.style.transform = `translateY(${y}px)`;
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      }

      requestAnimationFrame(animate);
    });
  };

  const slidingSlider = (): Promise<void> => {
    return new Promise((resolve) => {
      const getProgress = animationProgress(250, 0, 600);

      function animate(time: number) {
        const { current: x, progress } = getProgress(time);

        if (sliderRef.current) {
          sliderRef.current.style.transform = `rotate(90deg) translateX(${x}px)`;
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      }

      requestAnimationFrame(animate);
    });
  };

  const onPlayerReady = () => {
    setIsVisibleHighlights_970x250(true);

    slidingPhone()
      .then(async () => {
        setPlaying(true);

        if (textRef.current) {
          textRef.current.style.opacity = "1";
          textRef.current.style.backgroundImage = `url(${text_1})`;
          textRef.current.style.transition = "1s ease-in-out";
        }
      })
      .then(() => delay(900))
      .then(() => slidingSlider())
      .then(async () => {
        if (textRef.current) {
          textRef.current.style.transition = "0.3s ease";
        }
        setIsVisibleSliderText(true);
        await delay(1000);
        setIsVisibleCta(true);
      });
  };

  const followTo = () => {
    window.open("", "_blank");
  };

  return (
    <div className={s["main"]} ref={mainRef}>
      <img
        src={loading}
        alt="loading"
        width={970}
        height={250}
        className={s["loading"]}
      />
      <div className={s["close"]} onClick={close}>
        <span>Close Ad</span>
        <img src={closeImage} alt="close" width={25} height={25} />
      </div>
      <div className={s["followTo"]} onClick={followTo} />
      <img
        src={logo}
        alt="logo"
        width={970}
        height={250}
        className={s["logo"]}
      />
      <div className={s["text"]} ref={textRef} />
      <img
        src={cta}
        alt="cta"
        width={970}
        height={250}
        className={s["cta"]}
        style={{ opacity: isVisibleCta ? 1 : 0 }}
      />

      <Suspense fallback={null}>
        <Phone
          playing={playing}
          onPlayerReady={onPlayerReady}
          isVisibleHighlights_970x250={isVisibleHighlights_970x250}
          phoneContainerRef={phoneContainerRef}
          phoneSpriteRef={phoneSpriteRef}
        />
      </Suspense>

      <Suspense fallback={null}>
        <Rain drops={drops} />
      </Suspense>

      <div ref={flashRef} className={classNames({ [s["flash"]]: hasFlash })} />

      <Suspense>
        <Internals
          isVisible={isVisibleInternalsContainer}
          cardHighlightRef={cardHighlightRef}
        />
      </Suspense>

      <img
        src={slider_text}
        alt="slider_text"
        width={970}
        height={250}
        className={s["slider_text"]}
        style={{ opacity: isVisibleSliderText ? 1 : 0 }}
      />
      <input
        ref={sliderRef}
        className={s["slider"]}
        aria-label="slider"
        type="range"
        min="0"
        max={FRAMES}
        value={sliderValue}
        onChange={handleSlider}
      />
    </div>
  );
};
