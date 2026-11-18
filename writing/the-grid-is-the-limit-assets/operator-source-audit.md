# Operator table extraction record

*Evidence cutoff: November 17, 2026. This record supports the New York and New England entries in the [Grid Stress Atlas](grid-stress-atlas.md) and [atlas-data.csv](atlas-data.csv). It identifies the source table and exact cells or rows so the values can be rechecked without relying on a search snippet.*

## NYISO 2026 Gold Book

**Source:** [NYISO, 2026 Load & Capacity Data Report](https://www.nyiso.com/documents/20142/2226333/2026-Gold-Book-Public.pdf/a8fd42fe-5a8c-88cb-5052-f93dfd6423b8), released April 2026, printed page 17, Table I-1a. The report says it is generally current as of March 15, 2026. The extraction used the operator-hosted PDF with its versioned path. The PDF was also read using layout-preserving text extraction to keep the summer and winter columns aligned.

| Forecast year | Baseline summer peak, MW | Winter year | Baseline winter peak, MW |
|---|---:|---|---:|
| 2027 | 31,880 | 2027/28 | 25,110 |
| 2030 | 32,250 | 2030/31 | 26,310 |
| 2035 | 33,140 | 2035/36 | 28,480 |

Table I-1a labels these *expected-weather* baseline forecasts. They include energy-saving programs, behind-the-meter generation, electrification, large loads, and transmission and distribution losses. The lower and higher demand columns are scenarios under expected weather, **not** weather-percentile intervals. The atlas uses only the baseline summer values and the 2035/36 baseline winter value. NYISO's separate [2027/28 IRM presentation](https://www.nysrc.org/wp-content/uploads/2026/05/2026-Gold-Book-Load-Forecast-Update-06032026-ICS.pdf) reports 32,024.4 MW for a preliminary base case with behind-the-meter net-generation additions; it has a different planning definition and is excluded from the atlas's baseline series.

## ISO New England 2026 CELT

**Source:** [ISO New England, 2026 CELT Report](https://www.iso-ne.com/static-assets/documents/100035/2026_celt.xlsx), published May 1, 2026. The workbook path was identified from the operator's [CELT document library](https://www.iso-ne.com/system-planning/system-plans-studies/celt). In worksheet `1.5.1 Peak Loads`, row 26 gives forecast years, row 28 gives *net summer peak*, and row 31 gives *net winter peak*. Cells G28, J28 and O28 contain the 2027, 2030 and 2035 summer values; O31 contains the 2035/36 winter value. The operator's [electricity-use page](https://www.iso-ne.com/about/key-stats/electricity-use) independently repeats the 2035 summer and 2035/36 winter endpoints.

| Forecast year | Net summer 50/50 peak, MW | Normal winter year | Net winter peak, MW |
|---|---:|---|---:|
| 2027 | 25,290 | 2027/28 | 20,839 |
| 2030 | 25,738 | 2030/31 | 22,296 |
| 2035 | 26,849 | 2035/36 | 26,411 |

The CELT sheet labels these values *net*, reduced for behind-the-meter distributed energy resources. Summer is a 50/50 weather case; winter is a normal-weather seasonal forecast. Neither is a generator accreditation number or a site-specific delivery limit. The 2035/36 winter value is below the 2035 summer value in this table even though the operator expects the region to return to winter peaking sometime in the 2030s. A later crossover, weather differences and newer forecast vintages remain possible. The atlas does not infer a precise crossover year.

## Comparison rule

The two regions' MW values should not be read as a normalized ranking. NYISO's Table I-1a includes transmission and distribution losses, while ISO New England's published net series incorporates behind-the-meter reductions and has its own weather conventions. A local 1 GW project requires a utility and operator study at its point of interconnection. Keep the source-year and scenario labels attached when reusing these values.
