import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import PropTypes from "prop-types";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef(
  ({ className, checked, onChange, ...props }, ref) => (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        {
          "bg-primary": checked, // checked 状態での背景色
          "bg-input": !checked, // unchecked 状態での背景色
        },
        className,
      )}
      onClick={() => onChange(!checked)} // onClick イベントで onChange 関数を呼び出す
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-theme-black shadow-lg ring-0 transition-transform",
          {
            "translate-x-5": checked, // checked 状態での Thumb の位置
            "translate-x-0": !checked, // unchecked 状態での Thumb の位置
          },
        )}
      />
    </SwitchPrimitives.Root>
  ),
);
Switch.displayName = SwitchPrimitives.Root.displayName;
Switch.propTypes = {
  className: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  // other prop validations...
};

export { Switch };
