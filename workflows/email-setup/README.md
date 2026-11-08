# Project email setup — assisted workflow

Help a project owner create **one new mailbox** before setting up project services. This is an optional preparation step for the [creative workflow](../gemini-creative-track/README.md) and [Instagram workflow](../instagram-publishing/README.md).

**Status:** documented procedure and reusable agent prompt, added 8 November 2026. No account has been created or live signup tested by adding this module. Start an actual registration only when the owner explicitly requests it.

## What to prepare

Ask for the preferred provider, project purpose, display name and two or three preferred address names. If the owner already has a suitable mailbox, offer to use it instead. Examples such as `yourproject.contact` are naming suggestions, not checked or reserved addresses.

Confirm who will own and maintain the mailbox. A real business account needs its authorised representative; an independent prototype must not claim to be the real restaurant's official account. The mailbox stays under the owner's control.

## Official entry points

| Provider | Start here | Important distinction |
| --- | --- | --- |
| Gmail | [Google's Gmail account-creation guide](https://support.google.com/mail/answer/56256?hl=en-GB), then its official Create account link | Follow the current Gmail setup flow and verify a newly created Gmail address. Using an existing address to create a Google Account does not establish a new Gmail mailbox. |
| Outlook.com | [Microsoft's account-creation guide](https://support.microsoft.com/en-us/accounts-billing/manage/how-to-create-a-new-microsoft-account), then Outlook.com → Create free account | Choose the new Outlook.com address route. Creating a Microsoft account with an existing address is different from creating a new Outlook mailbox. |

These official guides were reviewed on 8 November 2026. Providers change their forms and verification requirements; read the actual page rather than relying on fixed button positions. Paid business/domain plans are a separate decision requiring the owner's budget and approval.

## Run the workflow

1. **Confirm the task.** The owner requests one account with the chosen provider and approves the proposed identity and purpose. Check the browser's signed-in identity. Preserve unrelated sessions; use an appropriate separate browser profile or let the owner sign out if needed.
2. **Choose a name.** Enter only approved, non-secret signup details using the normal official form. If the provider rejects an address, show the reason and ask the owner to choose an alternative; do not claim availability before checking.
3. **Hand over private steps.** Let the owner enter a new password, verification codes and any requested personal/recovery details directly on the provider's page. The owner completes challenges and reviews/accepts the account terms. Do not collect these values in chat, source files or logs. Follow the execution environment's confirmation requirements.
4. **Resume after the handoff.** Inspect the actual result. If verification or review is pending, record `owner_action_required` or `needs_review` and explain the remaining step. Do not repeatedly submit signup or create replacement accounts after an uncertain result.
5. **Verify the mailbox.** Confirm that the provider opens the mailbox and displays the intended new address. Ask the owner to confirm control. This verifies mailbox access, not outbound deliverability; do not send a test message without a separately authorised recipient and purpose.
6. **Record completion privately.** Save only the provider, progress state and confirmation booleans in the ignored local record. Keep secrets in the owner's own password manager. Record an address privately only if needed and authorised; do not publish it in GitHub by default.
7. **Continue the project.** The owner can use the new address for the desired project services. Creating Instagram, GitHub or Canva accounts, changing their ownership, authorising apps or enabling publishing are separate actions; this step grants none of them automatically.

## Progress and completion

`not_started → provider_selected → signup_in_progress → owner_action_required → mailbox_verified`

`needs_review` is available whenever the result is unclear. After an interruption, inspect whether the intended account/mailbox already exists before restarting. A form submission, a proposed username or a shared workflow is not completion. Finish at `mailbox_verified` only when the intended new mailbox is accessible and the owner confirms control.

To keep a minimal local progress record:

```sh
mkdir -p workflows/email-setup/private
cp workflows/email-setup/setup-record.example.json workflows/email-setup/private/setup-record.json
```

The module's `.gitignore` excludes `private/`. Do not add passwords, codes, recovery contacts, session exports or account screenshots to the example or public repository. Private files are ignored; do not force-add them.

## Reusable agent prompt

Copy and fill in [PROMPT.md](PROMPT.md) when the owner actually wants to begin. The prompt is a new workflow template, not a transcript of a completed Gemini session.

## 中文说明

这是一个“协助创建项目邮箱”的可选流程：确认负责人和用途 → 选择 Gmail／Outlook → 协助命名及填写普通资料 → 本人完成密码、验证码及条款确认 → 核对新邮箱 → 记录进度。

邮箱由本人或店铺负责人持有。密码、验证码及恢复资料不进入对话或 GitHub。创建邮箱不会自动注册其他平台，也不会启动 Instagram 发布。这里只新增操作流程，尚未创建任何真实邮箱。

## Optional next workflow

For a later checkout receipt delivered to the customer and project, use the [order-email module](../order-email/README.md). It can be documented and previewed without creating a mailbox. Account registration and live delivery remain separate future actions.
