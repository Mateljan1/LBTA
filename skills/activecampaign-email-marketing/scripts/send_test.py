#!/usr/bin/env python3
"""
Send a test email for an ActiveCampaign campaign.

Usage:
    python send_test.py --campaign-id 123 --email andrew@lagunabeachtennisacademy.com
"""

import os
import sys
import argparse
import requests


def send_test_email(api_key, api_url, campaign_id, test_email):
    """
    Send a test email for a campaign.
    
    Args:
        api_key: ActiveCampaign API key
        api_url: ActiveCampaign API URL
        campaign_id: Campaign ID to test
        test_email: Email address to send test to
    """
    
    # Get campaign details
    campaign_response = requests.get(
        f"{api_url}/api/3/campaigns/{campaign_id}",
        headers={"Api-Token": api_key}
    )
    campaign_response.raise_for_status()
    campaign = campaign_response.json()['campaign']
    
    print(f"📧 Sending test email...")
    print(f"   Campaign: {campaign['name']}")
    print(f"   To: {test_email}")
    
    # Send test
    test_data = {
        "campaignMessage": {
            "campaignId": campaign_id,
            "email": test_email
        }
    }
    
    test_response = requests.post(
        f"{api_url}/api/3/campaigns/{campaign_id}/test",
        headers={"Api-Token": api_key, "Content-Type": "application/json"},
        json=test_data
    )
    test_response.raise_for_status()
    
    print(f"✅ Test email sent successfully to {test_email}")


def main():
    parser = argparse.ArgumentParser(description='Send test email for ActiveCampaign campaign')
    parser.add_argument('--campaign-id', required=True, type=int, help='Campaign ID')
    parser.add_argument('--email', required=True, help='Test email address')
    
    args = parser.parse_args()
    
    # Get API credentials
    api_key = os.getenv('ACTIVECAMPAIGN_API_KEY')
    api_url = os.getenv('ACTIVECAMPAIGN_URL')
    
    if not api_key or not api_url:
        print("❌ Error: Missing environment variables")
        print("   Set ACTIVECAMPAIGN_API_KEY and ACTIVECAMPAIGN_URL")
        sys.exit(1)
    
    try:
        send_test_email(api_key, api_url, args.campaign_id, args.email)
    except Exception as e:
        print(f"❌ Error sending test: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()

