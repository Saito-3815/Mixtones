import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

import PropTypes from "prop-types";

const Progress = React.forwardRef(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-1 w-full overflow-hidden rounded-full bg-theme-gray",
      className,
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      // className="h-full w-[420px] flex-1 bg-white transition-all"
      className="h-full max-w-[420px] w-full flex-1 bg-white transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

Progress.propTypes = {
  className: PropTypes.string,
  value: PropTypes.number.isRequired,
};

export { Progress };
