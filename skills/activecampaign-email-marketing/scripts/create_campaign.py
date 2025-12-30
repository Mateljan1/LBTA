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
            "htmlcontent": html_content,
            "textcontent": "",  # Auto-generated from HTML
        }
    }
    
    message_response = requests.post(
        f"{api_url}/api/3/messages",
        headers={"Api-Token": api_key, "Content-Type": "application/json"},
        json=message_data
    )
    message_response.raise_for_status()
    message_id = message_response.json()['message']['id']
    
    # Create campaign
    campaign_data = {
        "campaign": {
            "type": "single",
            "name": name,
            "sdate": None,  # Send date (None = draft)
            "status": 1 if send_now else 0,  # 0=draft, 1=scheduled, 2=sending, 3=paused, 4=stopped, 5=completed
            "public": 1,
            "tracklinks": "all",
            "trackreads": "1",
            "trackreadsanalytics": "1",
            "segmentid": 0,
            "bounceid": -1,
            "realcid": 0,
            "waitid": 0,
            "m_dealid": 0,
            "m_groupid": 0,
            "m_link": 0,
            "p[{list_id}]": list_id,
            "m[{message_id}]": message_id,
        }
    }
    
    campaign_response = requests.post(
        f"{api_url}/api/3/campaigns",
        headers={"Api-Token": api_key, "Content-Type": "application/json"},
        json=campaign_data
    )
    campaign_response.raise_for_status()
    
    result = campaign_response.json()
    campaign_id = result['campaign']['id']
    
    print(f"✅ Campaign created successfully!")
    print(f"   Campaign ID: {campaign_id}")
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

