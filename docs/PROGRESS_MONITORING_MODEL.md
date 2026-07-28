# Progress Monitoring Model

Progress monitoring stores a session row plus one or more raw evidence data-point rows.

Session fields include student, goal, optional objective, date, collector, setting, activity,
intervention phase, measurement type, status, and finalization metadata.

Data-point fields preserve raw evidence:

1. Correct/total opportunities and calculated percentages.
2. Counts, duration seconds, and calculated rates.
3. Duration and latency values.
4. Rubric score/level.
5. Prompt level and independence values.
6. Reading fluency and accuracy evidence.
7. Task-analysis step counts and optional step responses.
8. Custom numeric value/unit and direction.

Draft sessions are saved but excluded from analytics. Finalization is permission-controlled.
