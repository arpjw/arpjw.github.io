"""Reproduce the coverage figures in the accompanying article.

Only the Python standard library is needed. Run from any directory:

    python3 writing/credible-intervals-under-misspecification/simulate.py
"""

from __future__ import annotations

import math
import random
from pathlib import Path
from statistics import NormalDist


SEED = 20261011
REPLICATIONS = 50_000
SAMPLE_SIZE = 100
PRIOR_SD = 10.0
TRUE_SDS = (0.5, 1.0, 1.5, 2.0)
STANDARD_NORMAL = NormalDist()
Z_975 = STANDARD_NORMAL.inv_cdf(0.975)


def theoretical_coverage(true_sd: float) -> float:
    precision = SAMPLE_SIZE + 1 / PRIOR_SD**2
    ratio = Z_975 * math.sqrt(precision / SAMPLE_SIZE) / true_sd
    return 2 * STANDARD_NORMAL.cdf(ratio) - 1


def simulate(true_sd: float, seed: int) -> tuple[float, float]:
    rng = random.Random(seed)
    posterior_hits = 0
    sandwich_hits = 0
    precision = SAMPLE_SIZE + 1 / PRIOR_SD**2
    posterior_radius = Z_975 / math.sqrt(precision)

    for _ in range(REPLICATIONS):
        sample = [rng.gauss(0, true_sd) for _ in range(SAMPLE_SIZE)]
        mean = sum(sample) / SAMPLE_SIZE
        posterior_mean = SAMPLE_SIZE * mean / precision
        if abs(posterior_mean) <= posterior_radius:
            posterior_hits += 1

        sample_variance = sum((value - mean) ** 2 for value in sample) / (
            SAMPLE_SIZE - 1
        )
        sandwich_radius = Z_975 * math.sqrt(sample_variance / SAMPLE_SIZE)
        if abs(mean) <= sandwich_radius:
            sandwich_hits += 1

    return posterior_hits / REPLICATIONS, sandwich_hits / REPLICATIONS


def write_figure(results: list[tuple[float, float, float]]) -> None:
    """Plot exact posterior coverage and Monte Carlo interval coverage."""
    left, right, top, bottom = 78, 680, 100, 318

    def x(value: float) -> float:
        return left + (value - 0.5) / 1.5 * (right - left)

    def y(value: float) -> float:
        return bottom - (value - 0.5) / 0.52 * (bottom - top)

    curve = " ".join(
        f"{x(0.5 + step * 0.01):.1f},{y(theoretical_coverage(0.5 + step * 0.01)):.1f}"
        for step in range(151)
    )
    parts = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 400" role="img" '
        'aria-labelledby="title desc">',
        '<title id="title">Coverage falls as the true standard deviation rises</title>',
        '<desc id="desc">The nominal 95 percent posterior interval covers about 100, 95, '
        '81, and 67 percent of the time at true standard deviations 0.5, 1, 1.5, '
        'and 2. Sandwich intervals remain near 95 percent.</desc>',
        '<rect width="720" height="400" fill="#ffffff"/>',
        '<text x="78" y="23" fill="#202020" font-family="Arial,sans-serif" '
        'font-size="16">Actual coverage of nominal 95% intervals</text>',
    ]
    for tick in (0.6, 0.8, 0.95, 1.0):
        yy = y(tick)
        parts.append(
            f'<line x1="{left}" y1="{yy:.1f}" x2="{right}" y2="{yy:.1f}" '
            'stroke="#dedede" stroke-width="1"/>'
        )
        parts.append(
            f'<text x="{left - 13}" y="{yy + 4:.1f}" text-anchor="end" '
            f'fill="#555" font-family="Arial,sans-serif" font-size="12">{tick:.0%}</text>'
        )
    parts.append(
        f'<line x1="{left}" y1="{bottom}" x2="{right}" y2="{bottom}" '
        'stroke="#555"/>'
    )
    for tick in TRUE_SDS:
        xx = x(tick)
        parts.append(
            f'<text x="{xx:.1f}" y="{bottom + 20}" text-anchor="middle" '
            f'fill="#555" font-family="Arial,sans-serif" font-size="12">{tick:.1f}</text>'
        )
    parts.append(
        '<text x="379" y="374" text-anchor="middle" fill="#555" '
        'font-family="Arial,sans-serif" font-size="13">True standard deviation</text>'
    )
    parts.append(
        f'<polyline points="{curve}" fill="none" stroke="#365f9a" '
        'stroke-width="3" stroke-linejoin="round"/>'
    )
    for true_sd, posterior, sandwich in results:
        parts.append(
            f'<circle cx="{x(true_sd):.1f}" cy="{y(posterior):.1f}" r="5" '
            'fill="#365f9a" stroke="#fff" stroke-width="1"/>'
        )
        parts.append(
            f'<rect x="{x(true_sd) - 5:.1f}" y="{y(sandwich) - 5:.1f}" '
            'width="10" height="10" fill="#a4523e"/>'
        )
    parts.extend(
        [
            '<line x1="328" y1="55" x2="360" y2="55" stroke="#365f9a" '
            'stroke-width="3"/>',
            '<text x="369" y="59" fill="#333" font-family="Arial,sans-serif" '
            'font-size="12">Posterior: exact curve, simulated dots</text>',
            '<rect x="328" y="69" width="10" height="10" fill="#a4523e"/>',
            '<text x="369" y="79" fill="#333" font-family="Arial,sans-serif" '
            'font-size="12">Sandwich: simulated squares</text>',
            '</svg>',
        ]
    )
    Path(__file__).with_name("coverage.svg").write_text("\n".join(parts) + "\n")


def main() -> None:
    print(f"seed={SEED} n={SAMPLE_SIZE} replications={REPLICATIONS} prior_sd={PRIOR_SD}")
    print("true_sd,posterior_coverage,theoretical_coverage,sandwich_coverage")
    results = []
    for index, true_sd in enumerate(TRUE_SDS):
        posterior, sandwich = simulate(true_sd, SEED + index)
        results.append((true_sd, posterior, sandwich))
        print(
            f"{true_sd:.1f},{posterior:.5f},"
            f"{theoretical_coverage(true_sd):.5f},{sandwich:.5f}"
        )
    write_figure(results)


if __name__ == "__main__":
    main()
