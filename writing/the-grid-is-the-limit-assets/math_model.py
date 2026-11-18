"""Reproduce the illustrative mathematics in the methods companion.

All inputs below are teaching assumptions, not operator forecasts. Run with
``python3 outputs/math_model.py`` from the project root.
"""

from __future__ import annotations

import csv
from pathlib import Path


OUT = Path(__file__).resolve().parent / "math-results.csv"


def two_node_dispatch(load_a_mw: float, load_b_mw: float, line_mw: float) -> dict[str, float]:
    """Lossless two-node dispatch with 2 GW of generation at each node."""
    cheap = min(2_000.0, load_a_mw + line_mw, load_a_mw + load_b_mw)
    expensive = load_a_mw + load_b_mw - cheap
    if not 0 <= expensive <= 2_000 or cheap < load_a_mw:
        raise ValueError("Illustrative system is infeasible")
    flow = cheap - load_a_mw
    assert 0 <= flow <= line_mw and abs(cheap + expensive - load_a_mw - load_b_mw) < 1e-9
    return {"cheap_mw": cheap, "expensive_mw": expensive,
            "flow_mw": flow, "hourly_cost_usd": 40 * cheap + 100 * expensive}


def shortfall_distribution(correlated: float) -> tuple[float, float]:
    """Two 1 GW units, 10% conditional independent outage each, 1.5 GW load."""
    if not 0 <= correlated <= 1:
        raise ValueError("Correlated-event probability must be in [0, 1]")
    independent_lolp = 1 - 0.9**2
    independent_eue_mwh = 2 * 0.1 * 0.9 * 500 + 0.1**2 * 1_500
    return (correlated + (1 - correlated) * independent_lolp,
            correlated * 1_500 + (1 - correlated) * independent_eue_mwh)


def rows() -> list[tuple[str, str, float, str, str]]:
    normal = two_node_dispatch(500, 1_000, 500)
    expanded = two_node_dispatch(500, 1_000, 1_000)
    firm = two_node_dispatch(500, 2_000, 500)
    p0, e0 = shortfall_distribution(0)
    p5, e5 = shortfall_distribution(0.05)
    capital_recovery = 0.07 / (1 - 1.07**-20)
    result = [
        ("annual_energy", "1 GW constant load", 8.76, "TWh/year", "1 GW * 8760 h"),
        ("annual_energy", "1 GW campus, 4 h/day at 0.7 GW", 8.322, "TWh/year", "(20*1+4*.7) GWh/day *365"),
        ("coincident_peak", "firm campus increment", 1, "GW", "Assumes full campus demand at system peak"),
        ("coincident_peak", "verified flexible campus increment", 0.7, "GW", "Assumes 0.3 GW curtailment coincides with peak"),
        ("dispatch", "baseline hourly cost", normal["hourly_cost_usd"], "USD/hour", "Two-node example"),
        ("dispatch", "expanded-line hourly cost", expanded["hourly_cost_usd"], "USD/hour", "Line limit 1000 MW"),
        ("dispatch", "firm-campus hourly cost", firm["hourly_cost_usd"], "USD/hour", "1 GW at node B"),
        ("dispatch", "congestion rent", normal["flow_mw"] * (100 - 40), "USD/hour", "500 MW * $60/MWh"),
        ("reliability", "independent LOLP per risk hour", p0, "probability", "Two 1 GW units, each 10% FOR"),
        ("reliability", "independent EUE per risk hour", e0, "MWh", "Demand 1.5 GW"),
        ("reliability", "5% common-event LOLP per risk hour", p5, "probability", "Common event disables both units"),
        ("reliability", "5% common-event EUE per risk hour", e5, "MWh", "Common event disables both units"),
        ("storage", "rated duration", 4, "hours", "1 GW / 4 GWh battery, no losses"),
        ("storage", "charge energy for 4 GWh discharge", 4 / 0.9, "GWh", "Assumed 90% round-trip efficiency"),
        ("rate", "20-year 7% capital-recovery factor", capital_recovery, "fraction/year", "r/(1-(1+r)^-n)"),
        ("rate", "$500m annual payment", 500e6 * capital_recovery / 1e6, "million USD/year", "Excludes O&M, tax and financing detail"),
        ("rate", "payment at 1 GW and 80% load factor", 500e6 * capital_recovery / (1e9 * .8 * 8.76) * 100, "cents/kWh", "Energy denominator only"),
        ("rate", "payment at 0.2 GW and 80% load factor", 500e6 * capital_recovery / (.2e9 * .8 * 8.76) * 100, "cents/kWh", "Energy denominator only"),
    ]
    assert normal["hourly_cost_usd"] == 90_000
    assert expanded["hourly_cost_usd"] == 60_000
    assert firm["hourly_cost_usd"] == 190_000
    assert abs(p5 - .2305) < 1e-10 and abs(e5 - 174.75) < 1e-10
    return result


def main() -> None:
    with OUT.open("w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(("topic", "case", "value", "unit", "assumption_or_formula"))
        writer.writerows(rows())
    print(f"Wrote {OUT.name}: {len(rows())} checked results")


if __name__ == "__main__":
    main()
