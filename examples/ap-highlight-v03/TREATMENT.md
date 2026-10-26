# AI Accounts Payable Assistant — Highlight v03 (light, no mascot)

> **Final structure: see 故事线.md (v3, approved 2026-10-23).** One invoice (INV-2026-5211); opens on the desktop; the lid closes and the night shift runs on a cloud stage wired to Gmail, Google Sheets and Xero; morning confirm → Xero draft + ledger "Draft created". 49 s. The sections below are the earlier working treatment and are kept for reference.

Style: based on Living Screencast (redrawn real UI, recording-software camera), **without the mascot** (user note: too cartoonish for B2B) · 1920×1080 · 30 fps · 60 s · English on screen · music + foley, **no voice-over** · 16:9 only.
Brief: Highlight video for the 10/26 launch (LinkedIn / X / YouTube). Core line: *Your 24/7 AI employee for accounts payable.*
Changes from v02 (user notes, 2026-10-23): light theme as in the new recording; Gmail / Google Sheets / Xero are drawn as interfaces (simplified, never the raw recording); setup comes first and is shown as a one-time, ready-to-use step, so nobody reads "every email needs manual setup"; storyboard skipped.

## Facts the film may show (source: 新增素材/20261023115347_rec_.mp4, AP Ledger20261023.xlsx, 邮件附件/*.pdf)

- Laiye Worker, light theme. Marketplace modal: tab *Worker*, featured dark card "AI Accounts Payable Assistant — Receive supplier invoices, link purchase orders and delivery notes, check duplicates, reconcile the three…", yellow *+ Add*, *Details →*.
- Greeting: "I'm your accounts payable colleague: I receive supplier invoices, reconcile them with POs and delivery notes, maintain the AP ledger, and prepare accounting drafts."
- Setup cards (real wording): *How will you provide documents?* → B Fetch from Gmail · *Where should the AP ledger be kept?* → A Use Google Sheets · *Should I create a new AP ledger, or use an existing spreadsheet?* → A Create a new AP ledger spreadsheet · *Where should accounting drafts be prepared?* → B Xero Accounting ("Xero is connected and I confirmed the organization: LAIYE PTE, base currency SGD.") · *How should invoice variances be handled?* → A Default: up to 1% price gap passes ("Saved: unit-price gaps up to 1% pass automatically when quantities match.").
- Run: "I found the accounting mailbox: one email … carrying six PDFs — two invoices (INV-2026-5211, INV-2026-5212), two purchase orders (PO-2026-0518, PO-2026-0519) and two delivery orders (DO-2026-3302, DO-2026-3303)."
- Six-step checklist (real): Retrieve the six PDF attachments from the Gmail message · Read and classify each PDF (invoice / PO / delivery note) and extract facts · Duplicate control for INV-2026-5211 and INV-2026-5212 · Create AP cases in the ledger and link invoices to PO/delivery notes · Three-way audit against 1% tolerance · Prepare draft previews (no Xero write without confirmation). End state: "Checklist has open items · 5/6 marked complete".
- Results: AP-2026-0001 / INV-2026-5211 agrees line for line, zero variance, 258.33 SGD, ready for a draft. AP-2026-0002 / INV-2026-5212: Iceberg Lettuce invoiced at 2.57 per kg against 2.50 on PO and DO — a 2.80% gap, above the 1% tolerance, total 262.96 instead of 258.33; no draft, waiting on the user's decision.
- Options (real): A Create the Xero draft for INV-2026-5211 (Recommended) · B Hold both cases for now · C Only decide INV-2026-5212 variance first. The user picked A.
- Reply (real, condensed): "The Xero draft for INV-2026-5211 is created and verified. … I read it back from Xero and every field matches the preview. It is a draft only — nothing has been approved, posted or paid."
- Xero *Edit Bill INV-2026-5211*: Draft · From FreshFarm Produce Pte Ltd · 24 Aug 2026 · due 23 Sep 2026 · Tax Exclusive · PM-001 Fresh Pak Choi kg 50 × 1.80, VG-204 Iceberg Lettuce kg 30 × 2.50, VG-118 Tomatoes (Cherry) kg 20 × 3.60 · 300 - Purchase · Standard-Rated Purchases (9%) · Subtotal 237.00 · Total Tax 9.00% 21.33 · TOTAL 258.33 · Save / Approve / Cancel.
- AP Ledger (Google Sheets, worksheet AP Cases): rows AP-2026-0001 and AP-2026-0002 with supplier, invoice, date, SGD, amount 258.33 / 262.96, PO, delivery note.

**Dramatised, not in the recording:** the clock (17:40 setup → 02:14 email → 09:03 review). In the recording the run was started by hand right after setup; the overnight trigger carries the product's stated 24/7 cloud operation (user's product information). The Sheets rows are shown appearing during step 4 (the recording opens the sheet afterwards). The cursor rests on Xero's *Approve* but never clicks.
Simplified: ADP prompts, Google/Xero authorisation pages, the internal "New Worker" session and the second Marketplace card (drawn as a blank placeholder) are left out. Personal data replaced: account `ap.team@yourco.com`; the sender is not named.

## 1. Three candidate structures

1. **The proof reel.** Start on the finished Xero draft and the ledger, rewind to how it got there. Strong credibility, but the hook is a spreadsheet and the "24/7" promise stays a caption.
2. **Two invoices, two fates.** Split screen from the start: 5211 runs green on the left, 5212 runs into the variance on the right. Clear about exceptions, but halves the UI size and steals the Before/After piece (11/10).
3. **Set it once, then the night shift.** Afternoon: you hire it from the Marketplace and set it up in one conversation, once. You leave. 02:14 an email with six PDFs lands; the assistant works alone, writes the ledger and catches a 2.80% overcharge. 09:03 you come back to one recommendation and one exception; you pick, and a real Xero draft waits for your approval.

**Chosen: 3.** It answers the user's note directly: setup is a one-time step at the start, and everything after it happens without anyone. The clock and wallpaper make "24/7" visible (native move *the film changes state*). The new recording gives the turn its real teeth: a true exception (5212) instead of v02's typed account code.

## 2. Logline and arc

You set up an AP assistant once at 17:40; at 02:14 it collects six documents, books two cases and stops a 2.80% overcharge; at 09:03 it hands you the one call only you should make, and a draft bill waits in Xero for your approval.

- Setup: hire and configure, once (day).
- Turn: night, the email arrives and the assistant works alone; one invoice doesn't add up.
- Ending: morning, you decide; a Xero draft, approval left to you. Echo: night again on the end card, still on duty.

## 3. Benchmark

- **Screen Studio product recordings** — learn: auto-zoom to the cursor, eased paths, window on wallpaper, crisp light UI. Don't take: their UI, wallpapers, music.
- **Linear / Raycast launch films (light mode)** — learn: one feature per beat, calm confidence, white space as rhythm. Don't take: shots, type, score.

## 4. No mascot: motion graphics carry the meaning

User note (2026-10-23): no cartoon character; regular MG and camera moves, and the film must read **without captions**. The software's work is shown by MG layers drawn over the redrawn UI, all in one clean B2B language (white cards, 1px hairlines, one accent per state: blue = working, green = passed, red = exception):
- **Connected stack**: each setup answer sends a chip to a panel (Gmail · Google Sheets / AP Ledger · Xero / LAIYE PTE · 1% tolerance), so setup reads at a glance.
- **Document cards**: the six PDFs fly out of the message as mini documents; a scan line reads each one and a type tag lands (Invoice / PO / Delivery order); link lines pair each trio.
- **Audit card**: unit prices side by side (Invoice | PO | DO) for both invoices; 5211 all green, 5212 VG-204 Iceberg Lettuce 2.57 | 2.50 | 2.50 turns red, "+2.80% · over 1%".
- **Focus rings and marker**: a drawn ring on Xero's *Draft*, a red underline on the 2.80% sentence, a soft ring on *Approve* under the cursor.
The cursor remains the only actor (the user).

## 5. Shot list (one continuous screen, zoom ≥ 1)

| # | t (s) | Framing / move | What happens | Why |
|---|---|---|---|---|
| 1 | 0.0–3.5 | Close on the featured Marketplace card, push-in to *+ Add* | Click; the button turns Added, a ring pulses | Hook: the hire is one click |
| 2 | 3.5–7.4 | Whip to session, medium | Modal closes, session opens; greeting; slogan caption | Diegetic intro |
| 3 | 7.4–12.9 | Follow the chat, ▶▶ 6× tag | Five setup cards answer themselves: Gmail · Google Sheets · new AP ledger · Xero (LAIYE PTE) · 1%; each answer sends a chip to the Connected stack; "Setup is done" | One-time, ready-to-use setup |
| 4 | 12.9–17.0 | Pull back to the desktop, push to the clock | Clock spins 17:46 → 02:14, wallpaper to night, music low-passes; cursor leaves | The hours pass; nobody is there |
| 5 | 17.0–19.0 | Push to the toast | "Gmail · 1 new email · 6 PDF attachments"; it flies into the chat | Cause at night |
| 6 | 19.0–25.4 | Follow the checklist; six document cards fly out | Steps 1–3 tick; scan line reads each card, type tags land; invoices marked unique | The work, shown |
| 7 | 25.4–27.9 | Whip-pan to the AP Ledger window, back | Two rows write themselves, cells flash green | Ledger updated in a real system |
| 8 | 27.9–31.6 | Push into the audit card | 5211 lines ✓ 0% variance; 5212 VG-204 2.57 vs 2.50 turns red, +2.80% | The exception |
| 9 | 31.6–35.6 | Pull back; clock 02:31 → 09:03; morning wallpaper | Result posted; "5/6 marked complete" | Morning |
| 10 | 35.6–39.8 | Push-in + vignette on the 5212 paragraph, after a silence | "a 2.80% gap … waiting on your decision" | The promise: you keep the judgement |
| 11 | 39.8–43.8 | Push to options | Cursor picks *A Create the Xero draft for INV-2026-5211*, Submit | Human decision as an action |
| 12 | 43.8–45.4 | Follow | "The Xero draft … is created and verified. Draft only." | Result in words |
| 13 | 45.4–50.6 | Whip-pan to Xero window; push to *Approve* + spotlight | Edit Bill INV-2026-5211, Draft, 300 - Purchase, TOTAL 258.33; ring draws around Draft; cursor rests on Approve | Proof; approval stays human |
| 14 | 50.6–60.0 | Pull back, night falls again, end card | Laiye Worker icon, name, slogan, Download Laiye Worker, URL, Laiye logo;  | Echo: still on duty |

Moves: push-in, pull-back, whip-pan (×3), follow, spotlight freeze, slow drift, time-lapse tag (7 kinds). Signature shot: #4–#5, clock spin to night and the toast.

## 6. Beat sheet / cue map

120 BPM (beat 0.5 s, bar 2 s), 4/4, F major.

| Section | t | Music | Hits |
|---|---|---|---|
| Hire | 0–4 | vibes arpeggio, hats on the click; glock sparkle on Added | Add 1.0; land 2.5 (crash) |
| Greeting | 4–7.5 | groove | slogan 4.0 |
| Setup ×6 | 7.5–13 | groove + shaker; chip blip per ✓ | ✓ 8.1, 8.9, 9.7, 10.5, 11.3; summary 11.9 |
| Night falls | 13–16.6 | drums out, low-pass sweep | clock 14.0–16.4 |
| Near-silence | 16.6–17.0 | room only | chime 17.0 |
| Night work | 17–31.6 | low-passed band, chip voice leads | steps 21.0, 24.0, 25.2, 27.6, 31.0; ledger rows 26.3, 26.8; "!" 30.0 |
| Morning | 31.6–36.4 | sweep up, crash 34.6 | clock 32.2–34.2 |
| Silence | 36.4–37.2 | room tone | spotlight 37.2 |
| Decide | 37.2–46 | bowed vibes + bass | pick A 41.6; Submit 42.6 (snare roll to 46.0) |
| Draft | 46–50.6 | crash, glock run | Draft stamp 46.2 |
| End | 50.6–60 | night outro, final Fmaj9 | end card 52.0; title lands 52.5 |

## 7. Sound design

| Section | Ambience | Foley | Music |
|---|---|---|---|
| Hire / setup | office room tone | trackpad clicks, card pops, chip pops and ✓ ticks | groove |
| Night falls | room tone thins to night air | clock ticks, swish | low-pass, drums out |
| Night work | night air | notification chime, scan sweeps, link snaps, list ticks, pencil scratch on the ledger, alert tone on the red row | night band, chip melody |
| Morning | room tone back | soft pop on the result | band + crash |
| Decide / draft | room | click, Submit, stamp, low boom | bowed vibes → crash |
| End | night air | final blink | outro |

Two silences: before the toast (16.6–17.0) and before the 5212 spotlight (36.4–37.2). Sound transitions: the chime J-cuts over the push to the toast; the morning crash L-cuts over the clock pull-back.

## 8. Type and captions

- UI: Inter (licence-free stand-in for the product's sans); Xero and Sheets drawn in the same Inter, simplified.
- Overlays: chapter pill top-left (01 Set up once · 02 Overnight · 03 Morning), frosted caption pill bottom-centre, ▶▶ 6× tag.
- Captions (English, no voice; `.srt` exported):
  1. Your 24/7 AI employee for accounts payable.
  2. Set it up once, in one conversation.
  3. Then it works in the cloud, around the clock.
  4. Reads every invoice, PO and delivery note.
  5. Checks duplicates. Logs each case in your ledger.
  6. Matches all three, line by line.
  7. Flags what doesn't add up. You make the call.
  8. A draft bill in Xero. Approval stays with you.
