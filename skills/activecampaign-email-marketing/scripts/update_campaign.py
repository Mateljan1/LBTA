#!/usr/bin/env python3
"""
Update an existing ActiveCampaign campaign message content.

Usage:
    python update_campaign.py \
        --campaign-name "Spring 2026 – Full Schedule (Updated)" \
        --template "path/to/template.html"

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

# Try to load .env files if python-dotenv is available
try:
    from dotenv import load_dotenv
    # Try .env.local first (like the Node.js scripts), then .env
    load_dotenv('.env.local')
    load_dotenv('.env')
except ImportError:
    pass  # Continue without dotenv if not installed


def load_template(template_path):
    """Load HTML email template from file."""
    with open(template_path, 'r', encoding='utf-8') as f:
        return f.read()


def find_campaign_by_name(api_key, api_url, campaign_name):
    """Find a campaign by name and return its details."""
    campaigns_response = requests.get(
        f"{api_url}/api/3/campaigns",
        headers={"Api-Token": api_key},
        params={"limit": 100}  # Adjust if you have more campaigns
    )
    campaigns_response.raise_for_status()
    campaigns_data = campaigns_response.json()
    meta_total = campaigns_data.get('meta', {}).get('total', 0)
    try:
        meta_total = int(meta_total)
    except (TypeError, ValueError):
        meta_total = 0

    for campaign in campaigns_data.get('campaigns', []):
        if campaign['name'] == campaign_name:
            return campaign

    # If not found in first page, try searching more
    all_campaigns = list(campaigns_data.get('campaigns', []))
    offset = 100
    while meta_total and len(all_campaigns) < meta_total:
        more_response = requests.get(
            f"{api_url}/api/3/campaigns",
            headers={"Api-Token": api_key},
            params={"limit": 100, "offset": offset}
        )
        more_response.raise_for_status()
        more_data = more_response.json()
        all_campaigns.extend(more_data.get('campaigns', []))
        
        for campaign in more_data.get('campaigns', []):
            if campaign['name'] == campaign_name:
                return campaign
        
        if len(more_data.get('campaigns', [])) == 0:
            break
        offset += 100
    
    raise ValueError(f"Campaign '{campaign_name}' not found. Available campaigns: {[c['name'] for c in all_campaigns[:10]]}")


def get_campaign_message(api_key, api_url, campaign_id):
    """Get the message associated with a campaign."""
    campaign_response = requests.get(
        f"{api_url}/api/3/campaigns/{campaign_id}",
        headers={"Api-Token": api_key}
    )
    campaign_response.raise_for_status()
    campaign = campaign_response.json()['campaign']

    # Email designer campaigns use message_id; API-created may use messageid
    message_id = (
        campaign.get('message_id')
        or campaign.get('messageid')
        or campaign.get('messageId')
    )
    if not message_id or str(message_id) == '0':
        raise ValueError(
            f"Campaign {campaign_id} has no associated message "
            f"(expected message_id / messageid on campaign)"
        )
    
    # Get message details
    message_response = requests.get(
        f"{api_url}/api/3/messages/{message_id}",
        headers={"Api-Token": api_key}
    )
    message_response.raise_for_status()
    return message_response.json()['message']


def update_campaign_message(api_key, api_url, message_id, html_content):
    """Update an existing campaign message with new HTML content.
    
    NOTE: Email Designer campaigns (ed_instanceid present) cannot be updated via API.
    The HTML is stored in ActiveCampaign's proprietary designer format.
    For Email Designer campaigns, use manual copy-paste in the ActiveCampaign UI.
    """
    # Check if this is an Email Designer message
    check_response = requests.get(
        f"{api_url}/api/3/messages/{message_id}",
        headers={"Api-Token": api_key}
    )
    check_response.raise_for_status()
    message = check_response.json()['message']
    
    ed = message.get("ed_instanceid")
    if ed is not None and str(ed) not in ("0", ""):
        raise ValueError(
            f"Message {message_id} is an Email Designer campaign and cannot be updated via API.\n"
            f"   Email Designer stores HTML in a proprietary format.\n"
            f"   Solution: Copy HTML manually in ActiveCampaign UI:\n"
            f"   1. Open the campaign in ActiveCampaign\n"
            f"   2. Click 'Edit' or 'Continue'\n"
            f"   3. Switch to HTML/code view (</> icon)\n"
            f"   4. Paste your HTML content\n"
            f"   5. Save\n"
            f"   Or use: ./scripts/copy-email-html.sh <template-file>"
        )
    
    message_data = {
        "message": {
            "html": html_content,
        }
    }
    
    update_response = requests.put(
        f"{api_url}/api/3/messages/{message_id}",
        headers={"Api-Token": api_key, "Content-Type": "application/json"},
        json=message_data
    )
    update_response.raise_for_status()

    # Legacy message_edit so the designer treats HTML as editor content (see ac_legacy_message.py).
    legacy_message_edit(
        api_key,
        api_url,
        message_id,
        html_content,
        message.get("subject") or "LBTA",
        4,
        fromname=message.get("fromname") or "Laguna Beach Tennis Academy",
        fromemail=message.get("fromemail") or "support@lagunabeachtennisacademy.com",
        reply2=message.get("reply2") or message.get("fromemail") or "support@lagunabeachtennisacademy.com",
    )
    return update_response.json()['message']


def main():
    parser = argparse.ArgumentParser(description='Update ActiveCampaign campaign message content')
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--campaign-name', help='Campaign name (exact match; watch en-dash vs em-dash)')
    group.add_argument('--campaign-id', type=int, help='Campaign ID (from AC URL or API)')
    parser.add_argument('--template', required=True, help='Path to HTML template file')
    
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
    
    try:
        if args.campaign_id is not None:
            print(f"🔍 Loading campaign ID: {args.campaign_id}")
            campaign_response = requests.get(
                f"{api_url}/api/3/campaigns/{args.campaign_id}",
                headers={"Api-Token": api_key},
            )
            campaign_response.raise_for_status()
            campaign = campaign_response.json()['campaign']
            campaign_id = campaign['id']
            print(f"✅ Campaign: {campaign['name']} (ID: {campaign_id})")
        else:
            print(f"🔍 Searching for campaign: {args.campaign_name}")
            campaign = find_campaign_by_name(api_key, api_url, args.campaign_name)
            campaign_id = campaign['id']
            print(f"✅ Found campaign ID: {campaign_id}")
        
        # Get message
        print(f"📧 Getting campaign message...")
        message = get_campaign_message(api_key, api_url, campaign_id)
        message_id = message['id']
        print(f"✅ Found message ID: {message_id}")
        
        # Update message
        print(f"🔄 Updating message content...")
        updated_message = update_campaign_message(api_key, api_url, message_id, html_content)
        
        print(f"\n✅ Campaign message updated successfully!")
        print(f"   Campaign: {campaign['name']} (ID: {campaign_id})")
        print(f"   Message: {updated_message['name']} (ID: {message_id})")
        print(f"   Subject: {updated_message['subject']}")
        print(f"   View in ActiveCampaign: {api_url.replace('api-us1', 'activehosted').replace('api-', '')}/app/campaigns/{campaign_id}")
        
    except Exception as e:
        print(f"❌ Error updating campaign: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
