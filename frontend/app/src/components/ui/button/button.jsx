import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

import PropTypes from "prop-types";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ",
  {
    variants: {
      variant: {
        default: "bg-primary hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-white font-thin underline-offset-4 hover:underline",
        theme: "bg-orange-600 hover:bg-orange-500",
      },
      size: {
        default: "h-12 px-8 py-2 text-lg",
        sm: "h-9 rounded-full px-3 text-xs",
        lg: "h-11 rounded-full px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      label,
      backgroundColor,
      onClick,
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        style={backgroundColor && { backgroundColor }}
        ref={ref}
        onClick={onClick}
      >
        {label}
      </Comp>
    );
  },
);
Button.displayName = "Button";

Button.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.string,
  size: PropTypes.string,
  asChild: PropTypes.bool,
  label: PropTypes.string,
  backgroundColor: PropTypes.string,
  onClick: PropTypes.func,
};

export { Button, buttonVariants };
