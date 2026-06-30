# Visual assets

These images are used in the project `README.md`. You can replace any of them
with your own — keep the file names the same and the README will pick them up.

| File             | Used for          | Status                              |
| ---------------- | ----------------- | ----------------------------------- |
| `screenshot.png` | Hero screenshot   | ✅ Real screenshot of the running app |
| `banner.svg`     | Repo banner       | ✅ Editable vector                    |
| `icon.svg`       | App icon / logo   | ✅ Editable vector                    |
| `demo.gif`       | Animated demo     | ⬜ Placeholder — see below to record  |

## How to (re)generate each asset

### 1. Hero screenshot (`screenshot.png`)

The committed screenshot was captured from the running app. To make your own:

1. Start the app: `bash start.sh`
2. Open `http://localhost:8080` in your browser.
3. Send a few messages so the window looks alive.
4. Take a screenshot:
   - **Windows:** `Win + Shift + S`, select the window, paste into any editor, save as PNG.
   - **Linux:** use your screenshot tool, or Flameshot (`flameshot gui`).
5. Save it as `docs/assets/screenshot.png`.

> Tip: a window around **900×720** at 2× scale looks crisp on GitHub.

### 2. Animated demo (`demo.gif`)

A short GIF (5–10 seconds) showing two windows chatting in real time is the
single most convincing asset. To record one:

- **Linux:** [Peek](https://github.com/phw/peek) — pick a region, hit record,
  type a couple of messages in two browser windows, stop, save as `demo.gif`.
- **Windows:** [ScreenToGif](https://www.screentogif.com/) — record the browser
  window, trim, export as GIF.
- Keep it small (under ~3 MB) so it loads fast on the README. Crop tight and
  limit to ~10 fps.

Save it as `docs/assets/demo.gif`, then in `README.md` swap the screenshot image
line for the GIF (there is a commented hint there).

### 3. App icon (`icon.svg`)

`icon.svg` is a plain, editable SVG (a chat bubble with two dots = two devices).
Edit it in any text editor or in [Inkscape](https://inkscape.org/). To export a
PNG (for example a 512×512 favicon or social icon):

```bash
# with Inkscape installed
inkscape docs/assets/icon.svg --export-type=png --export-width=512 -o icon-512.png
```

Or open the SVG in a browser and screenshot it.

### 4. Banner image (`banner.svg`)

`banner.svg` (1280×320) is used as the README header and works well as the
GitHub social preview image. Export it to PNG the same way as the icon, then
upload the PNG under **Settings → General → Social preview** on GitHub.

```bash
inkscape docs/assets/banner.svg --export-type=png --export-width=1280 -o banner.png
```
