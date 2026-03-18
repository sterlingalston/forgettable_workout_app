# Contributing Exercise Data

Anyone can contribute better videos, thumbnails, and instructions for exercises by submitting a pull request. Each exercise gets its own JSON file in `data/community/` — no merge conflicts between contributors.

## Adding or Improving an Exercise

### 1. Create the exercise file

Create `data/community/<slug>.json` where `<slug>` is the exercise name lowercased with non-alphanumeric runs replaced by a single hyphen:

```
"Barbell Bench Press"      → barbell-bench-press.json
"Push-Up (Close-Grip)"     → push-up-close-grip.json
"E-Z Curl Bar Curl"        → e-z-curl-bar-curl.json
"3/4 Sit-Up"               → 3-4-sit-up.json
```

**Slug rule (JavaScript):**
```js
name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
```

### 2. File schema

```json
{
  "exerciseName": "Barbell Bench Press",
  "slug": "barbell-bench-press",

  "videoId": "rT7DgCr-3pg",
  "thumbnailUrl": null,

  "timed": false,

  "instructions": [
    "Lie flat on the bench with your eyes directly under the bar.",
    "Grip the bar just outside shoulder-width with a full thumb-around grip.",
    "Unrack and lower the bar under control to mid-chest.",
    "Press back to full lockout without bouncing off the chest."
  ],

  "meta": {
    "contributor": "your-github-username",
    "source": "https://www.youtube.com/watch?v=rT7DgCr-3pg",
    "addedAt": "2026-03-18"
  }
}
```

| Field | Required | Notes |
|-------|----------|-------|
| `exerciseName` | Yes | Exact display name (for human reference only) |
| `slug` | Yes | Must match the filename exactly |
| `videoId` | No | YouTube video **ID only** (not a full URL). Use `null` to omit. |
| `thumbnailUrl` | No | Fallback image URL if no videoId. Use `null` to omit. |
| `timed` | No | `true` if this is a timed exercise (plank, hold, etc.). Defaults to `false`. |
| `instructions` | No | Array of step strings. Empty array = use built-in instructions. |
| `meta.contributor` | No | Your GitHub username |
| `meta.source` | No | URL of the video you're referencing |
| `meta.addedAt` | No | ISO date |

### 3. Add your slug to the index

Open `data/community/index.json` and add your slug to the `slugs` array (keep it alphabetically sorted):

```json
{
  "version": 1,
  "slugs": [
    "barbell-bench-press"
  ]
}
```

### 4. Submit a pull request

Open a PR with your new file and the updated `index.json`. That's it.

## Priority Chain

The app uses exercise data in this order (highest wins):

1. **User's own custom override** — set via the ✏️ button in the exercise detail
2. **Community file** ← your contribution lands here
3. **Animated GIF fallback** (fitnessprogramer.com database)
4. **YouTube API search** (automatic, requires API key)

Community data is cached locally so it only fetches once per exercise per device.

## Finding a Good YouTube Video

- Prefer **short demonstration clips** (under 90 seconds) showing proper form
- Use the video **ID** only, e.g. for `https://youtube.com/watch?v=rT7DgCr-3pg` use `rT7DgCr-3pg`
- Shorts work too: `https://youtube.com/shorts/ABC123` → ID is `ABC123`

## Exercise Name Reference

Exercise names come from [free-exercise-db](https://github.com/yuhonas/free-exercise-db). Search the list to find the exact display name to slugify.
