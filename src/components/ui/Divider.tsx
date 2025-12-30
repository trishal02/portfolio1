interface DividerProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export default function Divider({
  className = "",
  orientation = "horizontal",
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        className={`w-px h-full bg-gradient-to-b from-transparent via-racing-red/50 to-transparent ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={`h-px w-full bg-gradient-to-r from-transparent via-racing-red/50 to-transparent ${className}`}
      aria-hidden="true"
    />
  );
}
