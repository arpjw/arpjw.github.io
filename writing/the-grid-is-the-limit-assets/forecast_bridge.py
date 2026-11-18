"""Reproduce a limited accounting bridge between two 2030 U.S. forecasts.

Inputs are rounded values published in IEA Table A.4 and Berkeley Lab's
2025 Update. The script does not infer or attribute model parameter effects.
"""

from __future__ import annotations

import csv
from pathlib import Path


IEA_2024_TOTAL_TWH = 183.0
LBNL_2024_TOTAL_TWH = 192.0
IEA_2030_IT_TWH = 345.0
IEA_2030_TOTAL_TWH = 426.0
LBNL_2030_TOTAL_TWH = 649.0
LBNL_2030_PUE = 1.36


def main() -> None:
    iea_effective_pue = IEA_2030_TOTAL_TWH / IEA_2030_IT_TWH
    lbnl_implied_it = LBNL_2030_TOTAL_TWH / LBNL_2030_PUE
    gap = LBNL_2030_TOTAL_TWH - IEA_2030_TOTAL_TWH
    early_gap = LBNL_2024_TOTAL_TWH - IEA_2024_TOTAL_TWH
    additional_growth_gap = gap - early_gap

    # The endpoints match exactly with rounded published totals. The two
    # sequential bridges show why an attribution depends on accounting order.
    pue_first = IEA_2030_IT_TWH * LBNL_2030_PUE
    it_first = lbnl_implied_it * iea_effective_pue
    rows = [
        ("iea_2024_total_twh", IEA_2024_TOTAL_TWH),
        ("lbnl_2024_total_twh", LBNL_2024_TOTAL_TWH),
        ("iea_2030_it_twh", IEA_2030_IT_TWH),
        ("iea_2030_total_twh", IEA_2030_TOTAL_TWH),
        ("iea_effective_pue_from_rounded_tables", iea_effective_pue),
        ("lbnl_2030_total_twh", LBNL_2030_TOTAL_TWH),
        ("lbnl_published_aggregate_pue", LBNL_2030_PUE),
        ("lbnl_implied_it_twh", lbnl_implied_it),
        ("2030_total_gap_twh", gap),
        ("2024_total_gap_twh", early_gap),
        ("difference_in_2024_to_2030_growth_twh", additional_growth_gap),
        ("pue_first_intermediate_twh", pue_first),
        ("pue_first_pue_step_twh", pue_first - IEA_2030_TOTAL_TWH),
        ("pue_first_it_step_twh", LBNL_2030_TOTAL_TWH - pue_first),
        ("it_first_intermediate_twh", it_first),
        ("it_first_it_step_twh", it_first - IEA_2030_TOTAL_TWH),
        ("it_first_pue_step_twh", LBNL_2030_TOTAL_TWH - it_first),
    ]
    assert round(gap, 6) == 223
    assert round(early_gap, 6) == 9
    assert round(additional_growth_gap, 6) == 214
    assert abs((pue_first - IEA_2030_TOTAL_TWH) + (LBNL_2030_TOTAL_TWH - pue_first) - gap) < 1e-9
    assert abs((it_first - IEA_2030_TOTAL_TWH) + (LBNL_2030_TOTAL_TWH - it_first) - gap) < 1e-9

    destination = Path(__file__).with_name("forecast-bridge.csv")
    with destination.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(("metric", "value", "unit", "status"))
        for metric, value in rows:
            status = "published rounded input" if metric in {
                "iea_2024_total_twh", "lbnl_2024_total_twh", "iea_2030_it_twh",
                "iea_2030_total_twh", "lbnl_2030_total_twh", "lbnl_published_aggregate_pue",
            } else "derived accounting result"
            unit = "ratio" if metric in {
                "iea_effective_pue_from_rounded_tables", "lbnl_published_aggregate_pue",
            } else "TWh"
            writer.writerow((metric, f"{value:.8f}".rstrip("0").rstrip("."), unit, status))
    print(f"Wrote {destination.name}: {len(rows)} checked rows")


if __name__ == "__main__":
    main()
