import data from "./data/leaderboard.json";

interface Entry {
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

type SortKey = "label" | "agent" | "modelOrg" | "passAt1" | "avgCostPerTask" | "date" | "benchmarkVersion";

const entries: Entry[] = data.entries;
let sortKey: SortKey = "passAt1";
let sortAsc = false;
let filterOrg = "";
let filterVersion = "";
let filterVariation = "zeroDay";

const tbody = document.querySelector("tbody")!;
const orgFilter = document.getElementById("org-filter") as HTMLSelectElement;
const versionFilter = document.getElementById("version-filter") as HTMLSelectElement;
const variationFilter = document.getElementById("variation-filter") as HTMLSelectElement;

function populateOrgFilter() {
  const orgs = [...new Set(entries.map((e) => e.modelOrg))].sort();
  for (const org of orgs) {
    const opt = document.createElement("option");
    opt.value = org;
    opt.textContent = org;
    orgFilter.appendChild(opt);
  }
}

function populateVersionFilter() {
  const versions = [...new Set(entries.map((e) => e.benchmarkVersion))].sort();
  for (const version of versions) {
    const opt = document.createElement("option");
    opt.value = version;
    opt.textContent = version;
    versionFilter.appendChild(opt);
  }
}

function compare(a: Entry, b: Entry): number {
  const av = a[sortKey];
  const bv = b[sortKey];
  if (typeof av === "number" && typeof bv === "number") {
    return sortAsc ? av - bv : bv - av;
  }
  const sa = String(av);
  const sb = String(bv);
  return sortAsc ? sa.localeCompare(sb) : sb.localeCompare(sa);
}

function linkify(text: string, url: string): string {
  if (url) {
    return `<a href="${url}" target="_blank" rel="noopener">${text}</a>`;
  }
  return text;
}

function renderTable() {
  let filtered = entries;
  if (filterOrg) filtered = filtered.filter((e) => e.modelOrg === filterOrg);
  if (filterVersion) filtered = filtered.filter((e) => e.benchmarkVersion === filterVersion);
  if (filterVariation) filtered = filtered.filter((e) => e.variation === filterVariation);
  const sorted = [...filtered].sort(compare);

  tbody.innerHTML = "";
  for (const e of sorted) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${e.label}</td>
      <td>${linkify(e.agent, e.agentUrl)}</td>
      <td>${linkify(e.modelOrg, e.modelOrgUrl)}</td>
      <td>${e.passAt1.toFixed(1)}%</td>
      <td>$${e.avgCostPerTask.toFixed(2)}</td>
      <td><a href="${e.trajUrl}" target="_blank" rel="noopener">logs</a></td>
      <td>${e.date}</td>
      <td>${linkify(e.benchmarkVersion, e.benchmarkVersionUrl)}</td>`;
    tbody.appendChild(tr);
  }
}

function updateSortIndicators() {
  for (const th of document.querySelectorAll("th[data-sort]")) {
    th.classList.remove("sort-asc", "sort-desc", "active");
    if (th.getAttribute("data-sort") === sortKey) {
      th.classList.add(sortAsc ? "sort-asc" : "sort-desc", "active");
    }
  }
}

document.querySelector("thead")!.addEventListener("click", (ev) => {
  const th = (ev.target as HTMLElement).closest("th[data-sort]");
  if (!th) return;
  const key = th.getAttribute("data-sort") as SortKey;
  if (key === sortKey) {
    sortAsc = !sortAsc;
  } else {
    sortKey = key;
    sortAsc = key === "label" || key === "agent" || key === "modelOrg" || key === "date" || key === "benchmarkVersion";
  }
  updateSortIndicators();
  renderTable();
});

orgFilter.addEventListener("change", () => {
  filterOrg = orgFilter.value;
  renderTable();
});

versionFilter.addEventListener("change", () => {
  filterVersion = versionFilter.value;
  renderTable();
});

variationFilter.addEventListener("change", () => {
  filterVariation = variationFilter.value;
  renderTable();
});

populateOrgFilter();
populateVersionFilter();
updateSortIndicators();
renderTable();
