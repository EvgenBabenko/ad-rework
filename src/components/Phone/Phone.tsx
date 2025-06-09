import React from "react";
import ReactPlayer from "react-player/youtube";
import highlights_970x250 from "assets/img-webp/970x250_highlights.webp?url";
import s from "./index.module.css";

interface Props {
  isVisibleHighlights_970x250: boolean;
  playing: boolean;
  onPlayerReady: () => void;
  phoneContainerRef: React.RefObject<HTMLDivElement>;
  phoneSpriteRef: React.RefObject<HTMLDivElement>;
}

export const Phone = ({
  playing,
  phoneContainerRef,
  phoneSpriteRef,
  isVisibleHighlights_970x250,
  onPlayerReady,
}: Props) => {
  return (
    <div className={s["phone-container"]} ref={phoneContainerRef}>
      <div className={s["phone_sprite"]} ref={phoneSpriteRef} />
      <img
        src={highlights_970x250}
        alt="highlights_970x250"
        width={970}
        height={250}
        className={s["highlights_970x250"]}
        style={{ opacity: isVisibleHighlights_970x250 ? 1 : 0 }}
      />
      <ReactPlayer
        url="https://www.youtube.com/watch?v=v4mckcfr4c0&ab_channel=SamsungPhilippines"
        className={s["yt-player"]}
        style={{ opacity: playing ? "1" : "0" }}
        width={363}
        height={202}
        muted
        playing={playing}
        loop
        onReady={onPlayerReady}
      />
    </div>
  );
};
