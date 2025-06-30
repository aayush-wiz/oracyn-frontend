"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { cn } from "@/lib/utils";
import { IconChartBar, IconX } from "@tabler/icons-react";
import { ChartView, ChartData } from "./ChartView"; // Import our ChartView component

// Type for a single chart card object, extending the base ChartData
export type ChartCardData = ChartData & {
  id: string; // Ensure each chart has a unique ID
};

// A sub-component for the card placeholder icon.
const ChartIconPlaceholder = () => (
  <div className="flex h-full w-full items-center justify-center bg-zinc-900 rounded-lg">
    <IconChartBar className="h-8 w-8 text-zinc-500" />
  </div>
);

export const ExpandableChartCard = ({
  charts,
}: {
  charts: ChartCardData[];
}) => {
  const [active, setActive] = useState<ChartCardData | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  // Handle closing the modal on Escape key press or outside click
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }
    if (active) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      {/* Dimmed overlay for the background */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm h-full w-full z-10"
          />
        )}
      </AnimatePresence>

      {/* The Expanded Card Modal */}
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.label}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-2 right-2 items-center justify-center bg-white rounded-full h-6 w-6 z-20"
              onClick={() => setActive(null)}
            >
              <IconX className="h-4 w-4 text-black" />
            </motion.button>

            <motion.div
              layoutId={`card-${active.label}-${id}`}
              ref={ref}
              className="w-full max-w-2xl h-fit flex flex-col bg-zinc-900 sm:rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* This is the content area of the expanded card */}
              <div className="p-4 md:p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <motion.h3
                      layoutId={`title-${active.label}-${id}`}
                      className="font-bold text-xl text-neutral-200"
                    >
                      {active.label}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.label}-${id}`}
                      className="text-neutral-400"
                    >
                      A &apos;{active.type}&apos; chart visualization
                    </motion.p>
                  </div>
                </div>
                {/* The ChartView component is rendered here */}
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-4"
                >
                  <ChartView chart={active} />
                </motion.div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {/* The List of Collapsed Cards */}
      <div className="w-full space-y-4">
        {charts.map((chart) => (
          <motion.div
            layoutId={`card-${chart.label}-${id}`}
            key={chart.id}
            onClick={() => setActive(chart)}
            className="p-4 flex flex-row justify-between items-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl cursor-pointer"
          >
            <div className="flex gap-4 items-center">
              {/* Using a placeholder div instead of an img tag */}
              <motion.div
                layoutId={`image-${chart.label}-${id}`}
                className="h-14 w-14 rounded-lg overflow-hidden flex-shrink-0"
              >
                <ChartIconPlaceholder />
              </motion.div>
              <div>
                <motion.h3
                  layoutId={`title-${chart.label}-${id}`}
                  className="font-medium text-neutral-200"
                >
                  {chart.label}
                </motion.h3>
                <motion.p
                  layoutId={`description-${chart.label}-${id}`}
                  className="text-neutral-400 text-sm capitalize"
                >
                  {chart.type} Chart
                </motion.p>
              </div>
            </div>
            <motion.button
              layoutId={`button-${chart.label}-${id}`}
              className="px-4 py-2 text-sm rounded-full font-bold bg-zinc-800 border border-zinc-700 hover:bg-blue-600 text-white transition-colors"
            >
              Expand
            </motion.button>
          </motion.div>
        ))}
      </div>
    </>
  );
};
