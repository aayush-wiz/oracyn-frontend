/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // It's good practice to use cn for combining classes

export const StreamingTextMessage = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText(""); // Reset on new text
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20); // Adjust speed of typing here (lower is faster)

    return () => clearInterval(interval);
  }, [text]);

  return (
    // --- START OF THE FIX ---
    // The `prose` classes have been moved here, to the parent element.
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "max-w-xl p-4 bg-zinc-800 rounded-lg",
        "prose prose-invert prose-p:before:content-none prose-p:after:content-none"
      )}
    >
      {/* The invalid `className` prop has been removed from this component. */}
      <ReactMarkdown
        components={{
          // Your custom paragraph component is still perfectly valid.
          p: ({ node, ...props }) => <p className="text-white" {...props} />,
          // You can add more custom components for h1, h2, code, etc. here
          // For example, to style lists:
          ul: ({ node, ...props }) => (
            <ul className="list-disc ml-4" {...props} />
          ),
        }}
      >
        {displayedText}
      </ReactMarkdown>
    </motion.div>
    // --- END OF THE FIX ---
  );
};
