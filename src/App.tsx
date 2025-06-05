import React, { use, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import "./App.css";
import text_1 from "assets/img/text_1.png?url";
import text_2 from "assets/img/text_2.png?url";
import text_3 from "assets/img/text_3.png?url";
import text_4 from "assets/img/text_4.png?url";
import closeImage from "assets/img/close_black.png";
import { Rain } from "modules/rain";
import { RainDrop } from "modules/rain-drop";
import { delay } from "utils/delay";

const FRAMES = 58;
const FRAME_HEIGHT = 221;
const MAX_DROPS = 15;
const SPAWN_DELAY = 80;

export const App = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const internalsRef = useRef<HTMLDivElement>(null);
  const cardHighlightRef = useRef<HTMLDivElement>(null);
  const rainRef = useRef<HTMLDivElement>(null);
  const phoneContainerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const sliderTextRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const [sliderValue, setSliderValue] = useState(0);
  const raining = useRef(false);
  const hasFlash = useRef(false);
  const cardHighlighID = useRef(0);
  const [drops, setDrops] = useState<RainDrop[]>([]);
  const dropsRef = useRef<RainDrop[]>([]);
  const lastSpawnTime = useRef(0);
  const animationFrameId = useRef(0);
  const [isRaining, setIsRaining] = useState(false);
  const isRainingRef = useRef(isRaining);
  const [playing, setPlaying] = useState(false);

  console.log(drops);

  useEffect(() => {
    return () => {
      clearInterval(cardHighlighID.current);
    };
  }, []);

  useEffect(() => {
    animationSelector(sliderValue);
  }, [sliderValue]);

  // useEffect(() => {
  //   isRainingRef.current = isRaining;
  // }, [isRaining]);

  // useEffect(() => {
  //   const animate = (time: number) => {
  //     if (
  //       isRainingRef.current &&
  //       dropsRef.current.length < MAX_DROPS &&
  //       time - lastSpawnTime.current > SPAWN_DELAY
  //     ) {
  //       const drop = RainDrop.getInstance();
  //       dropsRef.current.push(drop);
  //       lastSpawnTime.current = time;
  //     }

  //     dropsRef.current.forEach((drop) => drop.update());
  //     dropsRef.current = dropsRef.current.filter((drop) => drop.active);

  //     setDrops([...dropsRef.current]);

  //     animationFrameId.current = requestAnimationFrame(animate);
  //   };

  //   animationFrameId.current = requestAnimationFrame(animate);

  //   return () => {
  //     cancelAnimationFrame(animationFrameId.current);
  //   };
  // }, []);

  const animationSelector = (value: number) => {
    const rain = new Rain(rainRef, 100, 50);

    textRef.current!.style.backgroundImage = `url(${text_1})`;
    // internalsFrameRef.current!.style.opacity = "0";
    internalsRef.current!.style.opacity = "0";
    internalsRef.current!.style.transition = "0s";

    if (value === 0) {
      setPlaying(true);
    }

    if (value >= 1) {
      setPlaying(false);
    }

    if (value >= 3 && value < 26) {
      textRef.current!.style.backgroundImage = `url(${text_2})`;

      // rain.start();
      // setIsRaining(true);
      // setInterval(() => setIsRaining(false), 10_000);
    }

    if (value >= 26 && value < 43) {
      textRef.current!.style.backgroundImage = `url(${text_3})`;
      // setIsRaining(false);
    }

    // TODO: add range and check for at least 1 flash in range
    if (value === 30) {
      turnFlash();
    }

    if (value >= 43) {
      textRef.current!.style.backgroundImage = `url(${text_4})`;
    }

    if (value === FRAMES) {
      // internalsFrameRef.current!.style.opacity = "1";
      internalsRef.current!.style.opacity = "1";
      internalsRef.current!.style.transition = "1s ease";

      cardHighlighID.current = setTimeout(highlightCard, 700);
    }
  };

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    console.log("handleSlider", value);

    setSliderValue(value);

    const positionY = `-${value * FRAME_HEIGHT}px`;

    spriteRef.current!.style.backgroundPositionY = positionY;
  };

  const close = () => {
    if (mainRef.current) {
      mainRef.current.remove();
    }
  };

  function highlightCard() {
    const startX = 0;
    const endX = 250;
    const duration = 600;

    let startTime = 0;

    function animate(timestamp: number) {
      if (!startTime) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentX = startX + (endX - startX) * progress;

      cardHighlightRef.current!.style.transform = `rotate(-15deg) translateX(${currentX}px)`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }

  function turnFlash() {
    if (hasFlash.current) {
      return;
    }

    hasFlash.current = true;
    flashRef.current!.classList.add("flash");

    const startScale = 0.3;
    const endScale = 2.5;
    const duration = 200;

    let startTime = 0;

    function animate(timestamp: number) {
      if (!startTime) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentScale = startScale + (endScale - startScale) * progress;

      flashRef.current!.style.transform = `scale(${currentScale})`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        hasFlash.current = false;
        flashRef.current!.classList.remove("flash");
      }
    }

    requestAnimationFrame(animate);
  }

  const slidingPhone = (): Promise<void> => {
    return new Promise((resolve) => {
      const startY = 250;
      const endY = 0;
      const duration = 500;

      let startTime = 0;

      function animate(timestamp: number) {
        if (!startTime) {
          startTime = timestamp;
        }

        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentY = startY + (endY - startY) * progress;

        phoneContainerRef.current!.style.transform = `translatey(${currentY}px)`;

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
      const startX = 250;
      const endX = 0;
      const duration = 600;

      let startTime = 0;

      function animate(timestamp: number) {
        if (!startTime) {
          startTime = timestamp;
        }

        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentX = startX + (endX - startX) * progress;

        sliderRef.current!.style.transform = `rotate(90deg) translateX(${currentX}px)`;

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
    slidingPhone()
      .then(() => {
        setPlaying(true);
        textRef.current!.style.backgroundImage = `url(${text_1})`;
      })
      .then(() => delay(900))
      .then(() => slidingSlider())
      .then(async () => {
        sliderTextRef.current!.style.opacity = "1";
        await delay(1000);
        ctaRef.current!.style.opacity = "1";
      });
  };

  return (
    <div className="main" ref={mainRef}>
      <div className="close" onClick={close}>
        <span>Close Ad</span>
        <img src={closeImage} alt="close" />
      </div>
      <div className="followTo" onClick={() => window.open()} />
      <div className="logo" />
      <div className="text" ref={textRef} />
      <div className="cta" ref={ctaRef} />

      <div className="phone-container" ref={phoneContainerRef}>
        <div className="sprite" ref={spriteRef} />
        <div className="highlights" />
        <ReactPlayer
          url="https://www.youtube.com/watch?v=v4mckcfr4c0&ab_channel=SamsungPhilippines"
          className="yt-player"
          style={{ opacity: playing ? "1" : "0" }}
          width={363}
          height={202}
          muted
          playing={playing}
          controls
          loop
          onReady={onPlayerReady}
        />
      </div>

      <div className="rain" ref={rainRef}>
        {drops.map((drop) => (
          <div
            key={drop.id}
            className={drop.className}
            style={drop.getStyle()}
          />
        ))}
      </div>
      <div ref={flashRef} />

      <div className="internals" ref={internalsRef}>
        <div className="internals_frame" />
        <div className="card-highlight-wrapper">
          <div className="card-highlight" ref={cardHighlightRef} />
        </div>
      </div>

      <div className="slider-text" ref={sliderTextRef} />
      <input
        ref={sliderRef}
        className="slider"
        type="range"
        min="0"
        max={FRAMES}
        value={sliderValue}
        onChange={handleSlider}
      />
    </div>
  );
};
