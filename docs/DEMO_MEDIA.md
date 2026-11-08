# Italia Uno — demonstration media

**Received 8 November 2026.** These user-supplied recordings accompany the [Gemini agent log](GEMINI_AGENT_LOG.md). The originals are preserved, without editing or transcoding, in the local submission ZIP under `demo-media/`. The public repository contains this index and a [checksum/metadata manifest](../workflows/gemini-creative-track/demo-media.json); it does not host the MP4 files.

## Viewing guide

| Recording in the ZIP | Length | Video dimensions | Visible sampled content |
| --- | --- | --- | --- |
| `01-desktop-visit.mp4` | 1:58.125 | 832 × 464 | Café interior, order invitation and personalised receipt. |
| `02-phone-day-night.mp4` | 0:11.963 | 432 × 848 | Phone-framed interior switches from day to night; lamps and compact controls. |
| `03-phone-exploration.mp4` | 3:02.242 | 432 × 848 | Location panel, menu/order dock and optional postcard conclusion. |
| `04-real-cafe-maps.mp4` | 0:08.402 | 848 × 464 | Farewell in a phone-preview tool, a loading transition, then the real café's Google Maps place result. |

Suggested order: **desktop visit → phone exploration → day/night detail → real café destination**. These are four separate originals, not an edited continuous film. Combined duration is about **5 minutes 21 seconds**; no claim is made that this is a submission-length cut. Do not use the displayed preview dimensions as proof of physical-device testing.

## Review scope and versions

Metadata was read using native AVFoundation. Frames at 12%, 50% and 88% of each recording were inspected. Each file contains one audio track, but audio content was not listened to or transcribed. The descriptions above report what appears in those sampled frames; they are not a complete review of every interaction, a historical fact-check of on-screen stories, or new game acceptance results.

The recordings show the navy/cream handcrafted Bistro presentation. A recording's exact source commit is not established from its image alone. Existing repository tests and implementation history remain separate evidence.

`demo-media/historical-ui/IMG_1609.PNG` and `IMG_1610.PNG` preserve the two supplied earlier phone screenshots. They show a previous interface, including emoji arrows and the central entrance callout. **They are historical design references, not evidence of the current UI passing review.** Their original filenames and SHA-256 hashes are in the manifest.

## Supplemental Gemini explanation

[Italia Uno AI Development Walkthrough](https://share.gemini.google/Hy46LuagOWu3) is the third genuine shared conversation supplied with these recordings. Its observed destination was `https://gemini.google.com/share/b1b13bdf81b8`.

It is a **text conversation**, not a hosted demo video. It gives a labelled hypothetical agent workflow, a system map and code excerpts concerning the postcard design. It does not demonstrate that Gemini implemented the earlier game, executed tests or generated these recordings. The locale-path correction in the [agent log](GEMINI_AGENT_LOG.md#corrections-made-while-assembling-this-log) also applies to this outline.

Keep the [principal walkthrough](https://share.gemini.google/6HcePfZERAVp), [feedback/toolkit dialogue](https://share.gemini.google/1ol6yl0YbhvM), and supplemental explanation as separate records. Media provenance and game authorship are not interchangeable.

## Reusing the media index

Preserve original files; give viewing copies descriptive names; store original filenames, dimensions, duration and SHA-256 in the manifest. Label source versions and review limits. When adding a publicly hosted video later, add its actual URL and access status; do not substitute a chat link for a playable recording. Third-party mapping UI and supplied media retain their respective rights; the code's MIT licence does not automatically license them.
