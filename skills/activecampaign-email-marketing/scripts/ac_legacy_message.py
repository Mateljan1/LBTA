"""ActiveCampaign legacy message_edit — editor HTML + list assignment."""

import re
import requests


def html_to_plain_text(html: str) -> str:
    t = re.sub(r"<script[\s\S]*?</script>", " ", html, flags=re.I)
    t = re.sub(r"<style[\s\S]*?</style>", " ", t, flags=re.I)
    t = re.sub(r"<[^>]+>", " ", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t[:12000]


def legacy_message_edit(
    api_key: str,
    api_url: str,
    message_id,
    html: str,
    subject: str,
    list_id,
    fromname: str = "Laguna Beach Tennis Academy",
    fromemail: str = "support@lagunabeachtennisacademy.com",
    reply2: str = "support@lagunabeachtennisacademy.com",
) -> None:
    """
    Register HTML as editor content + assign list. Pairs with v3 POST/PUT messages.
    See: https://www.activecampaign.com/api/example.php?call=message_edit
    """
    plain = html_to_plain_text(html)
    edit_url = f"{api_url.rstrip('/')}/admin/api.php?api_action=message_edit&api_output=json"
    post_fields = {
        "id": message_id,
        "format": "mime",
        "subject": subject,
        "fromemail": fromemail,
        "fromname": fromname,
        "reply2": reply2,
        "priority": "3",
        "charset": "utf-8",
        "encoding": "quoted-printable",
        "htmlconstructor": "editor",
        "html": html,
        "htmlfetch": "",
        "htmlfetchwhen": "send",
        "textconstructor": "editor",
        "text": plain,
        "textfetch": "",
        "textfetchwhen": "send",
        f"p[{list_id}]": list_id,
    }
    r = requests.post(
        edit_url,
        headers={"Api-Token": api_key, "Content-Type": "application/x-www-form-urlencoded"},
        data=post_fields,
    )
    r.raise_for_status()
    data = r.json()
    if int(data.get("result_code", 0)) != 1:
        raise RuntimeError(
            f"message_edit failed: {data.get('result_message', data)}"
        )
