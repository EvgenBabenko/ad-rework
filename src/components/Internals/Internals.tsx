// components/Internals.tsx
import React, { forwardRef } from "react";
import internals from "assets/img-webp/internals.webp?url";
import internals_frame from "assets/img-webp/internals_frame.webp?url";
import classNames from "classnames";
import s from "./index.module.css";

type Props = {
  isVisible: boolean;
  cardHighlightRef: React.RefObject<HTMLDivElement>;
};

export const Internals = ({ isVisible, cardHighlightRef }: Props) => {
  return (
    <div
      className={classNames(s["internals-container"], {
        [s["visible"]]: isVisible,
      })}
    >
      <img
        src={internals}
        alt="internals"
        width={970}
        height={250}
        className={s["internals"]}
      />
      <img
        src={internals_frame}
        alt="internals_frame"
        width={970}
        height={250}
        className={s["internals_frame"]}
      />
      <div className={s["card-highlight-container"]}>
        <div className={s["card_highlight"]} ref={cardHighlightRef} />
      </div>
    </div>
  );
};
