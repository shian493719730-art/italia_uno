# Order receipt email — reusable workflow

**Team Snapper · added 8 November 2026.** Planned behaviour: after checkout, a customer can request a receipt directly from the website, with a copy for the shop/project mailbox.

**Current status:** workflow, email template, configuration example, agent prompt and an offline payload preview. This module is not connected to the game's UI or a live email service. No mailbox registration, email transmission or live delivery test is performed by installing or previewing it.

## Intended customer flow

```text
Finish ordering → checkout snapshot → enter customer email
→ confirm receipt sharing with the project → one send request
→ email service → customer inbox + fixed shop/project copy
```

1. Keep the existing checkout and downloadable receipt. Add an optional “Email my virtual receipt” section after checkout; continuing the game never depends on email.
2. Ask for the customer's email and show that the project receives a copy. Suggested consent: “Send this virtual order and my email address to me and the project mailbox via the configured email service. This does not place a real order.”
3. Freeze the completed order's existing ID, date, nickname, language, item quantities, prices and total. Use `makeReceipt` in [`lib/receipt.mjs`](../../lib/receipt.mjs) and the existing order arithmetic; do not reconstruct totals from formatted UI text.
4. Validate one email address and the customer's explicit send action. Keep the address out of the visit journal and public logs. Do not use receipt requests to subscribe anyone to marketing.
5. Submit once to the configured email service, disable repeat clicks while pending, and keep a clear status beside the action. Missing configuration means “Email is not configured”; never display a fake success.
6. An API success means **accepted by the email service**, not proof that both inboxes received the message. A network timeout is `needs_review`; inspect service history/inboxes before a deliberate retry. Do not automatically retry uncertain sends.
7. Keep saving the SVG and continuing the visit available if email fails or is skipped.

## Email content

Include the receipt number/date, customer nickname if supplied, complete ordered items, quantity, unit price, line totals, virtual total, greeting-card message and the existing Google Maps link. Make “VIRTUAL ORDER / NOT A REAL PURCHASE” and “ACTUALLY CHARGED £0.00” clear in both customer and project copies. Use the current game's language and brand, with readable type and a compact phone form.

The project is an independent game prototype. Sending its receipt does not submit an order to the real restaurant, guarantee fulfilment or accept payment. A future real-order system requires separate business authorisation and implementation.

## Static-site integration option: EmailJS

The present GitHub Pages site is static. EmailJS is one implementation option for direct browser-triggered template emails; a server-backed provider can be substituted later. **Choosing this workflow does not create an EmailJS account or authorise a paid plan.** Configure it only when an owner explicitly requests implementation.

When ready, an authorised owner connects their own sending service and creates a template using [`templates/receipt.html`](templates/receipt.html):

| Template field | Future configuration |
| --- | --- |
| To Email | `{{customer_email}}` |
| Bcc | The owner's approved shop/project address, fixed in the provider dashboard. Do not take this recipient from the browser. |
| From Email | The connected sending service's verified/default address. |
| From Name | A project name approved by the owner; do not impersonate the real restaurant. |
| Subject | `[Virtual receipt] Italia Uno — {{order_id}}` |
| Body | The supplied HTML with escaped `{{...}}` variables. |

This sends the same receipt to the customer and a hidden shop/project copy with one request. The customer must still be told the project receives a copy. Keep user values in double-brace escaped variables; do not insert untrusted HTML through triple-brace variables.

Use the provider's public browser key, service ID and template ID as configuration. Never put an SMTP password, private API key, mailbox password or session token into the static bundle. Origin restrictions and anti-abuse controls depend on the provider/account setup and must be checked when enabling live sending. Do not promise unlimited email or guaranteed delivery.

## Files and offline preview

- [`PROMPT.md`](PROMPT.md): implementation handoff; defaults to planning only.
- [`config.example.json`](config.example.json): disabled placeholder configuration, with no real addresses or credentials.
- [`templates/receipt.html`](templates/receipt.html): copyable provider template.
- [`demo.mjs`](demo.mjs): creates an example checkout using the game's existing reducers and prints email parameters. **It contains no network or mail-sending code.**

From the repository root:

```sh
node workflows/order-email/demo.mjs en
node workflows/order-email/demo.mjs it
node workflows/order-email/demo.mjs zh
node workflows/order-email/demo.mjs ja
```

The example customer is `guest@example.com`, with a fixed demonstration date. The sample order is one Italia panino and one single espresso, using the game's invented £6.70 total. It is not a current restaurant price. No address availability or mailbox ownership is implied.

For future local configuration, copy the example to `workflows/order-email/private/config.json`. The module's `.gitignore` excludes `private/`. Actual customer addresses, delivery records and screenshots belong in private storage, not source control. The preview reads only the disabled public example.

## Acceptance criteria for a future implementation

- Checkout contents and total exactly match the existing receipt in all four languages.
- An invalid address, absent consent, incomplete checkout or missing provider configuration makes no send request.
- A rapid double click produces one request; an accepted request is not resent silently when changing nickname or navigating back.
- Accepted, rejected and uncertain results have distinct visible messages; uncertainty never triggers an automatic retry. Client guards alone do not guarantee server-side exactly-once delivery.
- The shop recipient is fixed by trusted configuration; the customer's field cannot redirect it.
- Send failures leave the order, receipt download and continuation intact; phone controls do not cover the main scene.
- Only after explicit permission and real configuration: send one test receipt and verify the customer and shop copies separately. Until then, live delivery remains **not tested**.

## Sources

Official documentation reviewed 8 November 2026:

- [EmailJS REST send API](https://www.emailjs.com/docs/rest-api/send/): request structure and API response.
- [EmailJS template setup](https://www.emailjs.com/docs/tutorial/creating-email-template/): dynamic recipients and Cc/Bcc fields.
- [EmailJS dynamic variables](https://www.emailjs.com/docs/user-guide/dynamic-variables-templates/): default escaping and template syntax.
- [EmailJS public-key explanation](https://www.emailjs.com/docs/faq/is-it-okay-to-expose-my-public-key/): browser-facing public key and predefined templates.

## 中文说明

这是工作流里的“网页发送订单小票”模块，供以后配置和接入。目标是顾客和店铺／项目邮箱都收到一份；目前只提供流程、模板、示例配置、Agent Prompt 和离线预览。无需现在注册邮箱，也不会实际发信。它保留现有虚拟点单的性质，不向真实餐厅下单。
