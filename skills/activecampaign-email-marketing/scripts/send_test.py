#!/usr/bin/env python3
"""
Send a test email for an ActiveCampaign campaign.

Usage:
    python send_test.py --campaign-id 123 --email you@example.com
    python send_test.py --campaign-id 85 --message-id 256 --email you@example.com
"""

import os
import sys
import argparse
import requests
from urllib.parse import urlencode


def send_test_email(api_key, api_url, campaign_id, test_email, message_id_override=None):
    """
    Send a test email for a campaign.

    Uses legacy **campaign_send** with action=test. The v3 endpoint
    POST /api/3/campaigns/{id}/test returns 405 on many accounts; the
    documented flow is GET /admin/api.php?api_action=campaign_send
    (see ActiveCampaign API examples for campaign_send).

    Args:
        api_key: ActiveCampaign API key
        api_url: ActiveCampaign API URL
        campaign_id: Campaign ID to test
        test_email: Email address to send test to
    """
    base = api_url.rstrip("/")
    headers = {"Api-Token": api_key}

    campaign_response = requests.get(
        f"{base}/api/3/campaigns/{campaign_id}",
        headers=headers,
    )
    campaign_response.raise_for_status()
    campaign = campaign_response.json()["campaign"]

    if message_id_override is not None:
        message_id = str(message_id_override)
    else:
        cm_response = requests.get(
            f"{base}/api/3/campaigns/{campaign_id}/campaignMessages",
            headers=headers,
        )
        cm_response.raise_for_status()
        rows = cm_response.json().get("campaignMessages") or []
        if not rows:
            raise RuntimeError(
                f"No campaignMessages for campaign {campaign_id}; cannot resolve messageid."
            )
        message_id = rows[0].get("messageid")
        if message_id is None:
            raise RuntimeError("campaignMessages row missing messageid")
        message_id = str(message_id)

    print(f"📧 Sending test email...")
    print(f"   Campaign: {campaign['name']}")
    print(f"   Message ID: {message_id}")
    print(f"   To: {test_email}")

    params = {
        "api_action": "campaign_send",
        "api_output": "json",
        "email": test_email,
        "campaignid": str(campaign_id),
        "messageid": message_id,
        "type": "mime",
        "action": "test",
    }
    url = f"{base}/admin/api.php?{urlencode(params)}"
    test_response = requests.get(url, headers=headers)
    test_response.raise_for_status()
    data = test_response.json()
    if int(data.get("result_code", 0)) != 1:
        raise RuntimeError(
            data.get("result_message") or f"campaign_send failed: {data}"
        )

    print(f"✅ Test email sent successfully to {test_email}")


def main():
    parser = argparse.ArgumentParser(description='Send test email for ActiveCampaign campaign')
    parser.add_argument('--campaign-id', required=True, type=int, help='Campaign ID')
    parser.add_argument('--email', required=True, help='Test email address')
    parser.add_argument(
        '--message-id',
        type=int,
        default=None,
        help='Campaign message ID (default: first message from campaignMessages)',
    )
    
    args = parser.parse_args()
    
    # Get API credentials (match .cursor/mcp.json: AC_API_TOKEN / AC_API_URL)
    api_key = os.getenv('ACTIVECAMPAIGN_API_KEY') or os.getenv('AC_API_TOKEN')
    api_url = os.getenv('ACTIVECAMPAIGN_URL') or os.getenv('AC_API_URL')

    if not api_key or not api_url:
        print("❌ Error: Missing environment variables")
        print("   Set ACTIVECAMPAIGN_API_KEY and ACTIVECAMPAIGN_URL")
        print("   (or AC_API_TOKEN and AC_API_URL)")
        sys.exit(1)
    
    try:
        send_test_email(
            api_key,
            api_url,
            args.campaign_id,
            args.email,
            message_id_override=args.message_id,
        )
    except Exception as e:
        print(f"❌ Error sending test: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()

