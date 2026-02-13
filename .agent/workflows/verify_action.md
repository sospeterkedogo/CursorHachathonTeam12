---
description: How to verify an eco-friendy action and generate a voucher
---

# Verify Eco-Action Workflow

This workflow describes the system process for verifying an image, awarding points, and generating a reward voucher.

## 1. Client Submission
The client captures an image and sends a POST request to `/api/verify` with:
- `image`: Base64 encoded image string
- `userId`: Current user ID
- `username`: Current username (optional)
- `avatar`: Current avatar (optional)

## 2. Server-Side Verification (API Route)
 The `/api/verify` endpoint performs the following steps:

### A. Vision Analysis (MiniMax)
-   **Action**: Calls MiniMax Vision API with the image and prompts for eco-action verification.
-   **Output**: JSON with `verified` (boolean), `score` (number), `actionType` (string), `message` (string).
-   **Fallback**: If `score > 0`, the system **forces** `verified: true` even if the AI returns false, ensuring users are rewarded for effort.

### B. Audio Feedback (MiniMax T2A)
-   **Action**: Converts the verification message to speech.
-   **Output**: URL to the audio file.

### C. Voucher Generation (MiniMax)
-   **Condition**: If `verified: true` (or force-verified via score), a voucher is generated.
-   **Action**: Calls MiniMax API to generate a reward.
-   **Prompt Requirement**: The prompt **must** request a monetary value (e.g., "£5 off", "10% discount").
-   **Output**: JSON with `title`, `description`, `code`.

### D. Database Persistence
1.  **Save Scan**: Stores the scan attempt in the `scans` collection.
2.  **Update User**: Increments `totalScore` in the `users` collection if `score > 0`.
3.  **Save Voucher**: Stores the generated voucher in the `vouchers` collection with an expiry date.

## 3. Client Response
The API returns:
```json
{
  "verified": true,
  "score": 85,
  "message": "Great job recycling! You earned a £5 voucher.",
  "voucher": {
    "title": "£5 Off Eco-Store",
    "description": "You earned a £5 voucher for local sustainable shops.",
    "code": "ECO-1234"
  },
  "audioUrl": "..."
}
```

## 4. Client UI Update
-   **Success State**: Displays "Verified!" card with score.
-   **Voucher**: Displays "Reward Unlocked!" card with the voucher details.
-   **Confetti**: Triggers confetti animation.
-   **Leaderboard**: Refreshes the leaderboard data.
