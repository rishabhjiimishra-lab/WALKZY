declare module "next/dist/lib/metadata/types/metadata-interface.js" {
  export type ResolvingMetadata = unknown;
  export type ResolvingViewport = unknown;
}

declare module "next/server.js" {
  export class NextResponse extends Response {
    static json(body: unknown, init?: ResponseInit): NextResponse;
    static redirect(url: string | URL, status?: number): NextResponse;
    cookies: { set(name: string, value: string, options?: Record<string, unknown>): void };
  }
  export class NextRequest extends Request {}
}

declare module "next/server" {
  export class NextResponse extends Response {
    static json(body: unknown, init?: ResponseInit): NextResponse;
    static redirect(url: string | URL, status?: number): NextResponse;
    cookies: { set(name: string, value: string, options?: Record<string, unknown>): void };
  }
}

declare module "next/link" {
  import type { AnchorHTMLAttributes, ReactNode } from "react";
  export default function Link(props: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children?: ReactNode }): JSX.Element;
}

declare module "next/link.js" {
  import type { AnchorHTMLAttributes, ReactNode } from "react";
  export default function Link(props: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children?: ReactNode }): JSX.Element;
}

declare module "next/headers" {
  export function cookies(): Promise<{ get(name: string): { value: string } | undefined }>;
}

declare module "next/navigation" {
  export function redirect(url: string): never;
  export function useSearchParams(): { get(name: string): string | null };
}
