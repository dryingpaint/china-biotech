import { promises as fs } from "node:fs";
import path from "node:path";
import type { NextRequest } from "next/server";

const ALLOWED = new Set(["chapters", "site"]);

const dataDir = path.join(process.cwd(), "data");

function devOnly(): Response | null {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not found", { status: 404 });
  }
  return null;
}

function fileFor(name: string): string | null {
  if (!ALLOWED.has(name)) return null;
  return path.join(dataDir, `${name}.json`);
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ file: string }> },
) {
  const block = devOnly();
  if (block) return block;
  const { file } = await ctx.params;
  const target = fileFor(file);
  if (!target) return new Response("Unknown file", { status: 404 });
  const raw = await fs.readFile(target, "utf8");
  return new Response(raw, {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ file: string }> },
) {
  const block = devOnly();
  if (block) return block;
  const { file } = await ctx.params;
  const target = fileFor(file);
  if (!target) return new Response("Unknown file", { status: 404 });

  const body = await req.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch (err) {
    return Response.json(
      { error: "Invalid JSON", detail: String(err) },
      { status: 400 },
    );
  }

  const serialized = JSON.stringify(parsed, null, 2) + "\n";
  const tmp = `${target}.tmp-${process.pid}-${Date.now()}`;
  await fs.writeFile(tmp, serialized, "utf8");
  await fs.rename(tmp, target);

  return Response.json({ ok: true, bytes: serialized.length });
}
