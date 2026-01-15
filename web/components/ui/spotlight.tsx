"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils/utils";

type SpotlightProps = {
  className?: string;
  fill?: string;
};

export const Spotlight = ({ className, fill }: SpotlightProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [parentElement, setParentElement] = useState<HTMLElement | null>(null);

  const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 100 });

  const onMouseMove = useCallback(
    ({ clientX, clientY }: MouseEvent) => {
      if (!parentElement) return;
      const { left, top } = parentElement.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    },
    [mouseX, mouseY, parentElement],
  );

  useEffect(() => {
    if (!containerRef.current) return;
    const parent = containerRef.current.parentElement;
    if (parent) {
      parent.style.position = "relative";
      parent.style.overflow = "hidden";
      setParentElement(parent);
      parent.addEventListener("mousemove", onMouseMove);
      parent.addEventListener("mouseenter", () => setIsHovered(true));
      parent.addEventListener("mouseleave", () => setIsHovered(false));
    }
    return () => {
      parent?.removeEventListener("mousemove", onMouseMove);
    };
  }, [containerRef, onMouseMove]);

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute -inset-px z-30 rounded-xl opacity-0 transition duration-300",
        isHovered && "opacity-100",
        className,
      )}
      style={{
        background: useTransform(
          [mouseX, mouseY],
          ([x, y]) =>
            `radial-gradient(600px circle at ${x}px ${y}px, ${fill || "rgba(255,255,255,0.1)"}, transparent 40%)`,
        ),
      }}
    />
  );
};
