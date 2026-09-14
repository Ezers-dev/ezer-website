import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Server-only. Reports whether a /public path actually has a file behind it.
 * Sections render a designed placeholder when it doesn't, so dropping the real
 * asset in at the same path is the only step needed to swap it in.
 */
export function hasAsset(publicPath: string): boolean {
  if (!publicPath.startsWith("/")) return false;
  return existsSync(path.join(process.cwd(), "public", publicPath.slice(1)));
}
