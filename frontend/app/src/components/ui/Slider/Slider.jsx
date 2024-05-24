import React, { useState } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

import PropTypes from "prop-types";

const Slider = React.forwardRef(({ className, ...props }, ref) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="your-slider-classes" // Replace with your actual classes
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className,
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-theme-gray">
          <SliderPrimitive.Range
            className={`absolute h-full ${isHovered ? "bg-theme-orange" : "bg-white"}`}
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className={`${isHovered ? "block" : "hidden"} h-5 w-5 rounded-full border-2 bg-background ring-offset-background transition-colors focus-visible:outline-none`}
        />
      </SliderPrimitive.Root>
    </div>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

Slider.propTypes = {
  className: PropTypes.string,
};

export { Slider };
