import { Glob } from "bun";
import yaml from "js-yaml";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";

interface Variation {
  passAt1: number;
  avgCostPerTask: number;
  trajUrl: string;
}

interface RunMetadata {
  label: string;
  agent: string;
  agentUrl: string;
  model: string;
  modelOrg: string;
  modelOrgUrl: string;
  date: string;
  benchmarkVersion: string;
  benchmarkVersionUrl: string;
  variations: Record<string, Variation>;
}

interface LeaderboardEntry {
  label: string;
  agent: string;
  agentUrl: string;
  model: string;
  modelOrg: string;
  modelOrgUrl: string;
  passAt1: number;
  avgCostPerTask: number;
  trajUrl: string;
  date: string;
  benchmarkVersion: string;
  benchmarkVersionUrl: string;
  variation: string;
}

const runsDir = path.join(import.meta.dir, "..", "runs");
const outPath = path.join(import.meta.dir, "..", "src", "data", "leaderboard.json");

const glob = new Glob("*/metadata.yml");
const entries: LeaderboardEntry[] = [];

for (const file of glob.scanSync(runsDir)) {
  const filePath = path.join(runsDir, file);
  const content = readFileSync(filePath, "utf-8");
  const meta = yaml.load(content) as RunMetadata;

  for (const [variation, data] of Object.entries(meta.variations)) {
    entries.push({
      label: meta.label,
      agent: meta.agent,
      agentUrl: meta.agentUrl,
      model: meta.model,
      modelOrg: meta.modelOrg,
      modelOrgUrl: meta.modelOrgUrl,
      passAt1: data.passAt1,
      avgCostPerTask: data.avgCostPerTask,
      trajUrl: data.trajUrl,
      date: meta.date,
      benchmarkVersion: meta.benchmarkVersion,
      benchmarkVersionUrl: meta.benchmarkVersionUrl,
      variation,
    });
  }
}

mkdirSync(path.dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify({ entries }, null, 2) + "\n");
console.log(`Generated ${outPath} with ${entries.length} entries`);
