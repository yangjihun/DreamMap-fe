import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white aria-invalid:ring-red-400 aria-invalid:border-red-400 transform hover:scale-105 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-blue-500 text-white shadow-lg hover:shadow-xl hover:bg-blue-600 border-0",
        destructive:
          "bg-red-500 text-white shadow-lg hover:shadow-xl hover:bg-red-600 border-0",
        outline:
          "border-2 border-blue-200 bg-white/90 backdrop-blur-sm text-blue-700 shadow-md hover:shadow-lg hover:bg-blue-50 hover:border-blue-300 hover:text-blue-800",
        secondary:
          "bg-gray-100 text-gray-800 shadow-md hover:shadow-lg hover:bg-gray-200 border-0",
        ghost:
          "text-blue-600 hover:bg-blue-50 hover:text-blue-700 shadow-sm hover:shadow-md",
        link: "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700",
      },
      size: {
        default: "h-10 px-5 py-2.5 has-[>svg]:px-4",
        sm: "h-9 rounded-md gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-12 rounded-xl px-8 has-[>svg]:px-6 text-base font-semibold",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {

  if (asChild) {
    return (
      <Slot
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }

  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
