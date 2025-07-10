"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function PlaceholdersAndVanishInput({
  placeholders,
  onChange,
  onSubmit,
}: {
  placeholders: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [value, setValue] = useState("");
  const [animating, setAnimating] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  type PixelData = { x: number; y: number; r: number; color: string };
  const newDataRef = useRef<PixelData[]>([]);

  // ⏳ Start placeholder cycling
  const startPlaceholderAnimation = () => {
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
  };

  useEffect(() => {
    startPlaceholderAnimation();
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState !== "visible") {
        if (intervalRef.current) clearInterval(intervalRef.current);
      } else {
        startPlaceholderAnimation();
      }
    });
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [placeholders]);

  // 🧠 Extract pixel data from canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const input = inputRef.current;
    if (!canvas || !input) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Set canvas size to match text
    const computedStyles = getComputedStyle(input);
    const fontSize = parseFloat(computedStyles.fontSize);
    ctx.font = `${fontSize * 2}px ${computedStyles.fontFamily}`;

    const textWidth = ctx.measureText(value).width;
    canvas.width = textWidth + 50;
    canvas.height = fontSize * 3;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FFF";
    ctx.fillText(value, 16, fontSize * 2);

    const {
      data: pixelData,
      width,
      height,
    } = ctx.getImageData(0, 0, canvas.width, canvas.height);

    type PixelData = { x: number; y: number; r: number; color: string };
    const newData: PixelData[] = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const [r, g, b, a] = [
          pixelData[i],
          pixelData[i + 1],
          pixelData[i + 2],
          pixelData[i + 3],
        ];
        if (a !== 0 && (r !== 0 || g !== 0 || b !== 0)) {
          newData.push({
            x,
            y,
            r: 1,
            color: `rgba(${r}, ${g}, ${b}, ${a / 255})`,
          });
        }
      }
    }

    newDataRef.current = newData;
  }, [value]);

  useEffect(() => {
    if (!animating) draw();
  }, [value, draw, animating]);

  const animate = (start: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!ctx || !canvas) return;

    const animateFrame = (pos: number = 0) => {
      requestAnimationFrame(() => {
        const newArr = [];
        for (let i = 0; i < newDataRef.current.length; i++) {
          const p = newDataRef.current[i];
          if (p.x < pos) {
            newArr.push(p);
          } else {
            if (p.r <= 0) continue;
            p.x += Math.random() > 0.5 ? 1 : -1;
            p.y += Math.random() > 0.5 ? 1 : -1;
            p.r -= 0.05 * Math.random();
            newArr.push(p);
          }
        }
        newDataRef.current = newArr;

        ctx.clearRect(pos, 0, canvas.width, canvas.height);
        for (const p of newDataRef.current) {
          if (p.x > pos) {
            ctx.beginPath();
            ctx.rect(p.x, p.y, p.r, p.r);
            ctx.fillStyle = p.color;
            ctx.fill();
          }
        }

        if (newDataRef.current.length > 0) {
          animateFrame(pos - 8);
        } else {
          setValue("");
          setAnimating(false);
        }
      });
    };

    animateFrame(start);
  };

  const vanishAndSubmit = () => {
    if (!inputRef.current) return;
    const val = inputRef.current.value;
    if (!val) return;

    setAnimating(true);
    draw();
    const maxX = newDataRef.current.reduce(
      (prev, curr) => (curr.x > prev ? curr.x : prev),
      0
    );
    animate(maxX);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    vanishAndSubmit();
    onSubmit?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !animating) {
      vanishAndSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "w-full relative max-w-xl mx-auto bg-white dark:bg-zinc-800 h-12 rounded-full overflow-hidden shadow transition duration-200",
        value && "bg-gray-50"
      )}
    >
      <canvas
        ref={canvasRef}
        className={cn(
          "absolute pointer-events-none top-[20%] left-2 sm:left-8 scale-50 origin-top-left filter invert dark:invert-0 pr-20",
          animating ? "opacity-100" : "opacity-0"
        )}
      />

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          if (!animating) {
            setValue(e.target.value);
            onChange?.(e);
          }
        }}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full z-50 border-none dark:text-white bg-transparent text-black h-full rounded-full focus:outline-none focus:ring-0 pl-4 sm:pl-10 pr-20 text-sm sm:text-base",
          animating && "text-transparent dark:text-transparent"
        )}
      />

      <button
        disabled={!value}
        type="submit"
        className="absolute right-2 top-1/2 z-50 -translate-y-1/2 h-8 w-8 rounded-full disabled:bg-gray-100 bg-black dark:bg-zinc-900 dark:disabled:bg-zinc-800 transition duration-200 flex items-center justify-center"
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-300 h-4 w-4"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <motion.path
            d="M5 12l14 0"
            initial={{ strokeDasharray: "50%", strokeDashoffset: "50%" }}
            animate={{ strokeDashoffset: value ? 0 : "50%" }}
            transition={{ duration: 0.3, ease: "linear" }}
          />
          <path d="M13 18l6 -6" />
          <path d="M13 6l6 6" />
        </motion.svg>
      </button>

      <div className="absolute inset-0 flex items-center rounded-full pointer-events-none">
        <AnimatePresence mode="wait">
          {!value && (
            <motion.p
              key={`placeholder-${currentPlaceholder}`}
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.3, ease: "linear" }}
              className="dark:text-zinc-500 text-sm sm:text-base font-normal text-neutral-500 pl-4 sm:pl-12 truncate w-[calc(100%-2rem)]"
            >
              {placeholders[currentPlaceholder]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
