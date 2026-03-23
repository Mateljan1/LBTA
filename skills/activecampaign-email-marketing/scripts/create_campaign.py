#!/usr/bin/env python3
"""
Create an email campaign in ActiveCampaign.

Usage:
    python create_campaign.py \
        --name "Winter 2026 Registration" \
        --subject "Winter Classes Start January 5th" \
        --template "path/to/template.html" \
        --list "All Contacts" \
        --send-now false

Environment Variables:
    ACTIVECAMPAIGN_API_KEY - Your ActiveCampaign API key
    ACTIVECAMPAIGN_URL - Your ActiveCampaign API URL (e.g., https://lbta.api-us1.com)
"""

import os
import sys
import argparse
import requests
from pathlib import Path

from ac_legacy_message import legacy_message_edit


def load_template(template_path):
    """Load HTML email template from file."""
    with open(template_path, 'r', encoding='utf-8') as f:
        return f.read()


def create_campaign(api_key, api_url, name, subject, html_content, list_name, send_now=False):
    """
    Create a campaign in ActiveCampaign.
    
    Args:
        api_key: ActiveCampaign API key
        api_url: ActiveCampaign API URL
        name: Campaign name (internal)
        subject: Email subject line
        html_content: HTML email content
        list_name: Name of contact list to send to
        send_now: Whether to send immediately (default: False, creates draft)
    
    Returns:
        dict: Campaign details including ID
    """
    
    # Get list ID by name
    lists_response = requests.get(
        f"{api_url}/api/3/lists",
        headers={"Api-Token": api_key}
    )
    lists_response.raise_for_status()
    lists_data = lists_response.json()
    
    list_id = None
    for lst in lists_data.get('lists', []):
        if lst['name'] == list_name:
            list_id = lst['id']
            break
    
    if not list_id:
        raise ValueError(f"List '{list_name}' not found. Available lists: {[l['name'] for l in lists_data.get('lists', [])]}")
    
    # Create campaign message
    message_data = {
        "message": {
            "type": "template",
            "name": name,
            "subject": subject,
            "fromname": "Laguna Beach Tennis Academy",
            "fromemail": "support@lagunabeachtennisacademy.com",
            "reply2": "support@lagunabeachtennisacademy.com",
            # v3 persists body only on `html`; `htmlcontent` stores nothing in the UI.
            "html": html_content,
            "textcontent": "",
        }
    }
    
    message_response = requests.post(
        f"{api_url}/api/3/messages",
        headers={"Api-Token": api_key, "Content-Type": "application/json"},
        json=message_data
    )
    message_response.raise_for_status()
    message_id = message_response.json()['message']['id']

    legacy_message_edit(
        api_key,
        api_url,
        message_id,
        html_content,
        subject,
        list_id,
    )

    # Create campaign via legacy admin API (v3 POST /api/3/campaigns returns 405;
    # v3 POST /api/3/campaign only accepts name+type and cannot attach list/message).
    # See: https://www.activecampaign.com/api/example.php?call=campaign_create
    legacy_url = f"{api_url.rstrip('/')}/admin/api.php?api_action=campaign_create&api_output=json"
    # m[message_id] value is split-test percentage (100 = full list for normal sends).
    post_fields = {
        "type": "single",
        "segmentid": 0,
        "name": name,
        "sdate": "2030-01-01 09:00:00",
        "status": 1 if send_now else 0,
        "public": 1,
        "tracklinks": "all",
        "trackreads": 1,
        "trackreplies": 0,
        "htmlunsub": 1,
        "textunsub": 1,
        f"p[{list_id}]": list_id,
        f"m[{message_id}]": 100,
    }
    campaign_response = requests.post(
        legacy_url,
        headers={"Api-Token": api_key, "Content-Type": "application/x-www-form-urlencoded"},
        data=post_fields,
    )
    campaign_response.raise_for_status()
    result = campaign_response.json()
    if int(result.get("result_code", 0)) != 1:
        raise RuntimeError(
            f"campaign_create failed: {result.get('result_message', result)}"
        )
    campaign_id = result["id"]
    
    print(f"✅ Campaign created successfully!")
    print(f"   Campaign ID: {campaign_id}")
    print(f"   Message ID: {message_id}")
    print(f"   Name: {name}")
    print(f"   Subject: {subject}")
    print(f"   List: {list_name} (ID: {list_id})")
    print(f"   Status: {'Scheduled' if send_now else 'Draft'}")
    print(f"   View in ActiveCampaign: {api_url.replace('api-us1', 'activehosted')}/app/campaigns/{campaign_id}")
    
    return result


def main():
    parser = argparse.ArgumentParser(description='Create ActiveCampaign email campaign')
    parser.add_argument('--name', required=True, help='Campaign name (internal)')
    parser.add_argument('--subject', required=True, help='Email subject line')
    parser.add_argument('--template', required=True, help='Path to HTML template file')
    parser.add_argument('--list', required=True, help='Contact list name')
    parser.add_argument('--send-now', action='store_true', help='Send immediately (default: create draft)')
    
    args = parser.parse_args()
    
    # Get API credentials from environment
    api_key = os.getenv('ACTIVECAMPAIGN_API_KEY')
    api_url = os.getenv('ACTIVECAMPAIGN_URL')
    
    if not api_key or not api_url:
        print("❌ Error: Missing environment variables")
        print("   Set ACTIVECAMPAIGN_API_KEY and ACTIVECAMPAIGN_URL")
        sys.exit(1)
    
    # Load template
    template_path = Path(args.template)
    if not template_path.exists():
        print(f"❌ Error: Template file not found: {args.template}")
        sys.exit(1)
    
    html_content = load_template(template_path)
    
    # Create campaign
    try:
        create_campaign(
            api_key=api_key,
            api_url=api_url,
            name=args.name,
            subject=args.subject,
            html_content=html_content,
            list_name=args.list,
            send_now=args.send_now
        )
    except Exception as e:
        print(f"❌ Error creating campaign: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()

