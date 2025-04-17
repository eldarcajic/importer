import { Check } from "lucide-react";
import React from "react";
import clsx from "clsx";
import { Step } from "@/types";

type StepperProps = {
  activeStep: number;
  completedSteps: number[];
  steps: Step[];
};
export const Stepper = ({
  activeStep,
  completedSteps,
  steps,
}: StepperProps) => {
  return (
    <div className="mb-10 flex w-7xl items-center justify-between">
      {steps.map((item, index) => {
        const { step, label } = item;

        const isCompleted = completedSteps.includes(step);
        const isActive = step === activeStep;

        const wrapperClass = clsx(
          "z-10 flex items-center gap-4 px-4 bg-background ",
          isCompleted ? "text-green-600" : "text-white",
        );

        const circleClass = clsx(
          "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold ",
          {
            "border-green-600 text-green-600": isCompleted,
            "bg-green-600 text-white border-green-600": isActive,
            "border-border text-muted-foreground": !isCompleted && !isActive,
          },
        );
        return (
          <div
            key={index}
            className="relative flex w-full flex-1 items-center justify-center"
          >
            <div className={wrapperClass}>
              <div className={circleClass}>
                {isCompleted ? <Check size={20} strokeWidth={4} /> : index + 1}
              </div>
              <p>{label}</p>
            </div>

            {index < steps.length - 1 && (
              <div className="bg-border absolute left-1/2 h-px w-full">
                <div
                  className={clsx(
                    "h-full bg-green-600",
                    isCompleted ? "w-full" : "w-0",
                  )}
                  style={{
                    animation: isCompleted
                      ? "progressFill 1.2s forwards"
                      : "none",
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
