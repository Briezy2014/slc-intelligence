# Analytics Formulas

Implemented analytics are descriptive and tables-first. They do not generate automated progress
reports, eligibility recommendations, placement recommendations, or high-stakes alerts.

Formulas:

1. Percentage: `correct / total * 100`.
2. Rate: `count / seconds * 60` or `count / seconds * 3600`.
3. WCPM: `max(words read - errors, 0) / seconds * 60`.
4. Reading accuracy: same as percentage.
5. Mean, median, range, sample standard deviation.
6. Trend/ROI: ordinary least squares over finalized/corrected observation order.
7. Aim line: linear interpolation between baseline and target dates/values.
8. Moving average: trailing window mean.
9. Phase comparison: count and mean for two named phases.
10. Prompt distribution: finalized/corrected count by prompt level.
11. Generalization/maintenance summaries: group finalized/corrected values by setting or phase label.

Draft and archived sessions are excluded from calculations. Incompatible measurement types return an
unavailable sufficiency state instead of combining values.
