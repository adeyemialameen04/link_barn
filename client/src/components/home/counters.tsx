"use client";

import { useInView } from "framer-motion";
import React, { useRef, useState } from "react";
import { AnimatedNumber } from "@/components/ui/animated-number";

interface CounterData {
  id: string;
  finalValue: number;
  duration: number;
  value: number;
}

export default function Counters({ users }: { users: number }) {
  const counterData: CounterData[] = [
    { id: "Sign up", finalValue: users, duration: 10000, value: 0 },
    { id: "Links Created", finalValue: 150, duration: 8000, value: 0 },
    { id: "Visited", finalValue: 200, duration: 12000, value: 0 },
    { id: "Active Users", finalValue: users - 5, duration: 6000, value: 0 },
  ];

  const [counters, setCounters] = useState<CounterData[]>(
    counterData.map((counter) => ({ ...counter, value: 0 })),
  );
  const ref = useRef(null);
  const isInView = useInView(ref);

  React.useEffect(() => {
    if (isInView) {
      setCounters((prevCounters) =>
        prevCounters.map((counter) =>
          counter.value === 0
            ? { ...counter, value: counter.finalValue }
            : counter,
        ),
      );
    }
  }, [isInView]);

  return (
    <div
      className="flex w-full flex-wrap items-center justify-center gap-8 border-b border-b-gray max-w-[1280px] mx-auto pb-5"
      ref={ref}
    >
      {counters.map((counter) => (
        <div key={counter.id} className="text-center">
          <AnimatedNumber
            className="inline-flex items-center font-mono text-4xl font-light text-zinc-800 dark:text-zinc-50"
            springOptions={{
              bounce: 0,
              duration: counter.duration,
            }}
            value={counter.value}
          />
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {counter.id}
          </p>
        </div>
      ))}
    </div>
  );
}
