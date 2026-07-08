import type { ImgHTMLAttributes } from "react";

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "width" | "height"> & {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  width?: number | string;
  height?: number | string;
};

export function Image({
  src,
  alt,
  fill,
  priority: _priority,
  sizes: _sizes,
  width,
  height,
  className,
  ...rest
}: ImageProps) {
  if (fill) {
    return (
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 h-full w-full ${className ?? ""}`.trim()}
        {...rest}
      />
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      {...rest}
    />
  );
}

export default Image;
