# Agent prompt — order receipts for the customer and project

New reusable prompt. Keep the execution mode explicit; its default is documentation only.

```text
Project: Italia Uno / Team Snapper
Mode: [DOCUMENT ONLY — default / IMPLEMENT UI / CONFIGURE EXISTING SERVICE / AUTHORISED TEST]
Goal: after checkout, allow a visitor to request a receipt directly from the
website, with a copy to the shop/project mailbox.

Follow workflows/order-email/README.md. Reuse the existing makeReceipt model,
order quantities and money arithmetic. Preserve the receipt's greeting-card
message, Google Maps link and clear virtual-order / £0 actually charged labels.
Keep Italian, English, Chinese and Japanese supported.

In DOCUMENT ONLY mode, produce or review the workflow, configuration placeholders,
email template and offline examples. Do not register an email account, connect a
provider, request credentials, change the game's UI or send any email.

If IMPLEMENT UI is explicitly selected, create a compact optional form after
checkout with customer email, disclosure that the project receives a copy,
consent and one send action. Missing configuration must remain unavailable;
never simulate a successful live send. Preserve SVG download and continuation.
Guard rapid repeat clicks and distinguish accepted, rejected and uncertain sends.
Do not automatically retry uncertain results. Use fixed trusted shop-recipient
configuration and keep private keys out of browser code.

If CONFIGURE EXISTING SERVICE is explicitly selected, first obtain the owner's
approved project recipient and service choice. Use owner-controlled setup for
account login, secrets, permissions and terms. Do not invent an address or register
an account just because this workflow exists. Public IDs are distinct from secrets.

An AUTHORISED TEST needs explicit recipient addresses and approval to send one
receipt. Verify both actual inbox copies; API acceptance alone is not proof of
delivery. Record testing limits honestly and keep customer data out of GitHub.

Finish with the mode, files/artifacts prepared, checks actually run and any future
configuration needed. Label proposed functionality separately from shipped work.
```
