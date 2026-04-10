"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function NavLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  console.log("hello durgesh-> ",pathname);
  const isActive = (pathname == href) ||(href!=='/' && pathname.startsWith(href));
  return (
    <Link
      href={href}
      className={cn(
        className,
        "transition-colors text-sm duration-200 text-gray-600 hover:text-rose-500",
        isActive && "text-rose-500",
      )}
    >
      {children}
    </Link>
  );
}
