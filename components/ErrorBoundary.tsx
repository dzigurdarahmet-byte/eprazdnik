// Classic React Error Boundary for component-tree failures inside Client subtrees.
// (Next.js App Router's app/error.tsx covers route-level errors; this one is a
// belt-and-suspenders fallback for the catalog filters.)
"use client";
import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { fallback: ReactNode; children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    // Client-side fallback: use console.error so the boundary still surfaces
    // the failure in browser devtools when pino is server-only.
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  override render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
