# Hero scroll-video frames

These are the frames the pinned `ScrollVideo` hero scrubs through as you scroll.
The current files (`frame-000.jpg` … `frame-089.jpg`) are **placeholders** — a
generated animation so you can see the effect working. Replace them with your
real footage.

## How to replace with your own video

1. Export your clip to a numbered frame sequence. With ffmpeg, from an MP4:

   ```bash
   # ~24–30 frames of scroll per second of video is plenty.
   ffmpeg -i hero.mp4 -vf "fps=30,scale=1600:-1" -q:v 4 frame-%03d.jpg
   ```

   (ffmpeg is 1-indexed, this component is 0-indexed — either rename, or start
   the pattern at `-start_number 0`.)

2. Drop the resulting `frame-000.jpg …` files into this folder, replacing the
   placeholders. Keep the same naming (`frame-` + zero-padded index + `.jpg`).

3. Update the frame count in `src/data/home.ts` (`scrollVideo.frameCount`) to
   match how many frames you exported. That's the only code change needed.

## Tuning

- **Speed of the scrub:** `scrollVideo.scrollHeight` in `src/data/home.ts`
  (e.g. `"300vh"`). Taller = slower, more scroll per frame.
- **Smoothness / weight:** the spring in `ScrollVideo.tsx` (`stiffness`,
  `damping`).
- **Frame size vs. performance:** more frames and larger images = smoother but
  heavier to preload. 1400–1800px wide JPEGs at quality 4 is a good balance.
