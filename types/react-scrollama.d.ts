declare module "react-scrollama" {
  import type { ReactNode } from "react";

  export type CallbackResponse<T = unknown> = {
    data: T;
    direction: "up" | "down";
    element: HTMLElement;
    entry: IntersectionObserverEntry;
  };

  export type ScrollamaProps = {
    offset?: number;
    threshold?: number;
    debug?: boolean;
    onStepEnter?: (response: CallbackResponse) => void;
    onStepExit?: (response: CallbackResponse) => void;
    onStepProgress?: (
      response: CallbackResponse & { progress: number },
    ) => void;
    children?: ReactNode;
  };

  export const Scrollama: (props: ScrollamaProps) => JSX.Element;

  export type StepProps<T = unknown> = {
    data?: T;
    children?: ReactNode;
  };

  export const Step: <T = unknown>(props: StepProps<T>) => JSX.Element;
}
