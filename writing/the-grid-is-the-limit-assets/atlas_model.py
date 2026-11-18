"""Validate the source-backed atlas and reproduce the standardized campus cases.

No regional feasibility, price, connection date or reliability score is inferred.
"""

from __future__ import annotations

import csv
from pathlib import Path


BASE = Path(__file__).resolve().parent
REGIONS = ("PJM", "ERCOT", "CAISO", "MISO", "SPP_East", "NYISO", "ISO_NE")
YEARS = (2027, 2030, 2035)


def validate_atlas() -> list[dict[str, str]]:
    with (BASE / "source-log.csv").open(newline="") as file:
        sources = {row["id"] for row in csv.DictReader(file)}
    with (BASE / "atlas-data.csv").open(newline="") as file:
        rows = list(csv.DictReader(file))
    keys: set[tuple[str, str, str, str]] = set()
    for row in rows:
        assert row["region"] in REGIONS
        assert row["source_id"] in sources, row
        assert row["source_date"] and row["caveat"]
        assert row["value"] or row["evidence_class"] == "missing", row
        assert not row["value"] or row["evidence_class"] != "missing", row
        key = (row["region"], row["metric"], row["target_year"], row["source_id"])
        assert key not in keys, key
        keys.add(key)
    return rows


def campus_cases() -> list[dict[str, str | int | float]]:
    result: list[dict[str, str | int | float]] = []
    for region in REGIONS:
        for year in YEARS:
            for service, constrained_hours, peak_import, annual_twh in (
                ("firm", 0, 1.0, 8.76),
                ("verified_flexible", 4, 0.7, 8.322),
            ):
                result.append({
                    "region": region,
                    "year": year,
                    "service": service,
                    "requested_connection_gw": 1.0,
                    "assumed_peak_import_gw": peak_import,
                    "assumed_annual_energy_twh": annual_twh,
                    "constrained_hours_per_day": constrained_hours,
                    "regional_feasibility": "unassessed",
                })
    return result


def main() -> None:
    rows = validate_atlas()
    cases = campus_cases()
    with (BASE / "atlas-campus-cases.csv").open("w", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=list(cases[0]))
        writer.writeheader()
        writer.writerows(cases)
    assert len(cases) == 42 and len(rows) >= 30
    print(f"Validated {len(rows)} atlas records and wrote {len(cases)} campus cases")


if __name__ == "__main__":
    main()
