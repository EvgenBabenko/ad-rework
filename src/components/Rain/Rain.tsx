import React from "react";
import { RainDrop } from "modules/rain-drop";
import s from "./index.module.css";

export const Rain = ({ drops }: { drops: RainDrop[] }) => (
  <div className={s["rain"]}>
    {drops.map((drop) => (
      <div
        key={drop.id}
        className={s[drop.className]}
        style={drop.getStyle()}
      />
    ))}
  </div>
);
