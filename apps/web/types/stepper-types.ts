export type Step = {
  step: number;
  label: string;
};

export type StepperProps = {
  steps: Step[];
  activeStep: number;
  completedSteps: number[];
};
