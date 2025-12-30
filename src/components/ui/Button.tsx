import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses =
    "px-6 py-3 font-display font-semibold uppercase tracking-wider transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantStyles = {
    primary: {
      backgroundColor: "#DC2626",
      color: "#FFFFFF",
    },
    secondary: {
      backgroundColor: "#1A1A1A",
      color: "#DC2626",
      border: "2px solid #DC2626",
    },
    outline: {
      backgroundColor: "transparent",
      color: "#DC2626",
      border: "2px solid #DC2626",
    },
  };

  const variantClasses = {
    primary: "hover:opacity-90",
    secondary: "hover:opacity-90",
    outline: "hover:opacity-90",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={variantStyles[variant]}
      {...props}
    >
      {children}
    </button>
  );
}
