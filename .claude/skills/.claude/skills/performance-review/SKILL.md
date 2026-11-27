---
name: performance-review
description: Step 0 of every new video. Pull the real stats of the last published Shorts/Reels/TikToks (Instagram, TikTok, YouTube via the Windsor.ai connector), score what worked and what failed, update the living playbook `insights/playbook.md`, and write a "Performance brief" with the concrete rules the next episode must follow. Use automatically before "give me ideas", "write the script" or any new episode, and when the user says "revisa estadísticas", "cómo van los vídeos", "analiza el rendimiento", "check performance", "qué ha funcionado".
---

# Performance review (Step 0 — runs before every new episode)

Goal: every new video is built on what the audience actually did with the previous ones, not on guesses.
Output: an updated `insights/playbook.md`, one line appended to `insights/log.md`, and a `## Performance brief` section at the top of the new `episodes/epN/story.md`.

## 1. Pull the data (Windsor.ai for Social Media connector)

Tools are `mcp__Windsor_ai_for_Social_Media__*` (load them with ToolSearch `+windsor` if they are deferred). If the connector is not available, say so, use the existing `insights/playbook.md` as it is, and continue the workflow; never invent numbers.

1. `get_connectors` → account ids for `instagram`, `tiktok_organic`, `youtube`.
2. Date range: `date_preset: "last_29dT"` (the free Windsor trial only allows the last 30 days; if a call fails with a history-limit error, shorten the range; if the plan allows more, use `last_90dT`).
3. Always call `get_fields` once per connector per session before `get_data`. Use these fields:
   - **instagram:** `date, media_id, media_type, media_caption, media_permalink, media_views, media_reach, media_like_count, media_comments_count, media_shares, media_saved, media_reel_avg_watch_time` (ms), `media_reel_skip_rate` (share that skipped in the first 3 s), `followers_count`.
   - **tiktok_organic:** `date, video_id, video_caption, video_duration` (s), `video_views_count, video_likes, video_comments, video_shares, video_favorites, video_average_time_watched` (s), `video_full_watched_rate, video_new_followers`.
   - **youtube:** `account_name, video, video_title, published_at, creator_content_type, views, engaged_views, average_view_duration` (s), `average_view_percentage, likes, comments, shares, subscribers_gained`. Keep only `creator_content_type == "shorts"` for the Shorts analysis, and flag any recent upload that came out as `videoOnDemand` (it was meant to be a Short: too long or not vertical).
4. Pass a short `reasoning` (no personal data), e.g. "pre-production review for next animated short".

## 2. Match videos across platforms and episodes

The same video is published on the three platforms with the same title/caption. Group rows by the first line of the caption / the title. Match each group to its episode folder by comparing with `episodes/*/upload.md` titles; a published video with no folder is still analysed (label it `externo`).

## 3. Score each video

Do not judge a video younger than **48 h** (list it as "pendiente"). For the rest, per platform:

| Platform | Primary signal (what the algorithm pushes) | Secondary |
|---|---|---|
| Instagram | `media_reel_skip_rate` (lower is better) and `media_views` | saves + shares + comments per 1,000 views |
| TikTok | `video_full_watched_rate` and `video_average_time_watched / video_duration` | shares, new followers. If every video sits in the same narrow view band (e.g. 600–750), the account is stuck in the test pool: retention is the problem, not the topic |
| YouTube Shorts | `average_view_percentage` and `engaged_views / views` | subscribers_gained, likes |

Tag each video **top / medio / flojo** within its platform (top third / middle / bottom third). A video that is top on one platform and flojo on another points to a platform-specific problem (cover, first frame, caption), not to the topic.

## 4. Find the patterns

For each video record these attributes (from the caption, `story.md`, `timing.json` or `video_duration`):
- **duration** (s), **hook type** (pregunta "¿Por qué…?", objeto cotidiano vs. jerga técnica, número/fecha, doble sentido), **topic family** (vehículos, electrónica, fábricas/comida, estructuras, materiales/baterías…), **CTA** (etiqueta a un amigo, pregunta a comentarios, sígueme, ninguno), **first words of the hook**.
Compare top vs. flojo groups. A pattern becomes a **rule** only if it holds in ≥3 videos and on ≥2 platforms; otherwise it is a **hipótesis**. Correlation over ~10 videos is weak: say so, never present it as certain.

## 5. Update the playbook

Rewrite `insights/playbook.md` keeping its sections:
1. `Última revisión` (date, range, number of videos, follower counts).
2. `Reglas activas` — each with the evidence (video names + numbers) and a confidence (`alta` / `media` / `baja`). Promote, demote or delete rules according to the new data; a rule contradicted twice is removed.
3. `Hipótesis en prueba` — what the next episodes should test, **one variable per episode**.
4. `Tabla de rendimiento` — the scored videos (keep the last ~20).
5. `Acciones pendientes` — fixes on already-published videos (re-upload as Short, new cover, unanswered comments). Never publish, edit or reply on a platform without the user's explicit OK; propose the text instead.

Append to `insights/log.md`: `- YYYY-MM-DD · N vídeos · regla nueva/cambiada · experimento elegido para epN`.

## 6. Write the Performance brief for the new episode

At the top of `episodes/epN/story.md` (and `_en` / `_es` variants) add:

```md
## Performance brief (de insights/playbook.md, YYYY-MM-DD)
- Duración objetivo: … s (máx. …)
- Gancho: … (patrón que ganó: …; evitar: …)
- Tema: … (familia que mejor rinde: …)
- CTA final: …
- Experimento de este episodio (1 variable): …
- Por qué: <2–3 datos concretos de la revisión>
```

Then continue the normal workflow (`animated-shorts` Step 4 or 5). Every later step must respect the brief: the idea list (Step 4) is ranked against the active rules, the script (Step 5) must land on the target duration in `timing.json`, and the thumbnails (Step 10) must fix any cover/first-frame problem flagged in the review.

## 7. Report to the user

Five lines max in chat: what worked, what failed, the rules applied to this episode, the experiment, and the pending actions that need their OK.
