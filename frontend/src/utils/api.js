const BASE = "/api";

async function request(method, path, body) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) opts.body = JSON.stringify(body);

  const res  = await fetch(`${BASE}${path}`, opts);
  const data = await res.json();

  if (!res.ok) {
    const msg = data.details
      ? data.details.map((d) => `${d.field}: ${d.message}`).join("; ")
      : data.error || "Request failed";
    throw new Error(msg);
  }

  return data;
}

export const api = {
  createReport:     (body)  => request("POST",   "/reports",              body),
  listReports:      ()      => request("GET",    "/reports"),
  getReport:        (id)    => request("GET",    `/reports/${id}`),
  updateReport:     (id, b) => request("PUT",    `/reports/${id}`,        b),
  regenerateReport: (id)    => request("POST",   `/reports/${id}/regenerate`),
  deleteReport:     (id)    => request("DELETE", `/reports/${id}`),
};
