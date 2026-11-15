# Forge - onboarding + notification bar update

Upload to GitHub (replace the old ones): www/  native/  scripts/
Nothing else changes. Then: Actions > Build Android app > Run workflow (keep the native box ticked).

What is new
- 16-screen setup flow (welcome, name, gender, goal, focus areas, height, age, weight, target weight, level, 1RM, days + week start, equipment, location, challenge, coach loading, plan summary).
- Focus areas, equipment, days/week and week-start now shape the generated plan.
- Phone notification bar: shows in the main notification section (not Silent), no sound, updates on every step (step detector + hardware counter), shows steps, kcal, km, goal progress bar.

## Update 2 (fixes)
Upload (replace): www/  native/  scripts/   (native/ now also has res/ - notification layouts)
Then: Actions > Build Android app > Run workflow (keep the native box ticked).

## Update 3
Back button now handled natively (scripts/patch_android.py writes MainActivity). Upload www/ native/ scripts/ and rebuild.
