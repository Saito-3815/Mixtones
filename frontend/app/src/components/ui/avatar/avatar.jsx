import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import { cn } from "@/lib/utils";

import PropTypes from "prop-types";

const Avatar = React.forwardRef(({ className, size, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      `relative flex h-${size} w-${size} shrink-0 overflow-hidden rounded-full`,
      className,
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;
Avatar.propTypes = {
  size: PropTypes.string,
};

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

Avatar.propTypes = {
  className: PropTypes.string,
};

AvatarImage.propTypes = {
  className: PropTypes.string,
};

AvatarFallback.propTypes = {
  className: PropTypes.string,
};

AvatarSet.propTypes = {
  src: PropTypes.string.isRequired,
  size: PropTypes.string,
};

export { Avatar, AvatarImage, AvatarFallback };

export function AvatarSet({ src, size }) {
  return (
    <Avatar size={size}>
      <AvatarImage src={src} alt="avatar" />
      <AvatarFallback className="bg-gray-300">
        <FontAwesomeIcon
          icon={faUser}
          className={`text-gray-500 h-[${size}*3px] w-[${size}*3px] `}
        />
      </AvatarFallback>
    </Avatar>
  );
}
