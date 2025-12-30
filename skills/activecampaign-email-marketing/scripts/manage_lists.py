#!/usr/bin/env python3
"""
Manage ActiveCampaign contact lists and segments.

Usage:
    # List all lists
    python manage_lists.py --action list
    
    # Create a new list
    python manage_lists.py --action create --name "Winter 2026 Leads"
    
    # Add contact to list
    python manage_lists.py --action add-contact --list "All Contacts" --email "parent@example.com" --first-name "John" --last-name "Doe"
"""

import os
import sys
import argparse
import requests
import json


def list_all_lists(api_key, api_url):
    """List all contact lists."""
    response = requests.get(
        f"{api_url}/api/3/lists",
        headers={"Api-Token": api_key}
    )
    response.raise_for_status()
    lists = response.json().get('lists', [])
    
    print(f"📋 Contact Lists ({len(lists)} total):\n")
    for lst in lists:
        print(f"   ID: {lst['id']}")
        print(f"   Name: {lst['name']}")
        print(f"   Subscribers: {lst.get('subscriber_count', 'N/A')}")
        print(f"   Created: {lst.get('cdate', 'N/A')}")
        print()


def create_list(api_key, api_url, name, description=""):
    """Create a new contact list."""
    data = {
        "list": {
            "name": name,
            "stringid": name.lower().replace(' ', '-'),
            "sender_url": "https://lagunabeachtennisacademy.com",
            "sender_reminder": description or f"You're receiving this because you signed up for {name}",
            "send_last_broadcast": 0,
            "carboncopy": "",
            "subscription_notify": "",
            "unsubscription_notify": "",
            "to_name": "Laguna Beach Tennis Academy",
            "private": 0,
            "analytics_domains": "",
            "analytics_source": "",
            "analytics_ua": ""
        }
    }
    
    response = requests.post(
        f"{api_url}/api/3/lists",
        headers={"Api-Token": api_key, "Content-Type": "application/json"},
        json=data
    )
    response.raise_for_status()
    result = response.json()
    
    print(f"✅ List created successfully!")
    print(f"   ID: {result['list']['id']}")
    print(f"   Name: {result['list']['name']}")


def add_contact_to_list(api_key, api_url, list_name, email, first_name="", last_name="", phone="", custom_fields=None):
    """Add or update a contact and subscribe them to a list."""
    
    # Get list ID
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
        raise ValueError(f"List '{list_name}' not found")
    
    # Create or update contact
    contact_data = {
        "contact": {
            "email": email,
            "firstName": first_name,
            "lastName": last_name,
            "phone": phone
        }
    }
    
    if custom_fields:
        contact_data["contact"]["fieldValues"] = custom_fields
    
    # Check if contact exists
    search_response = requests.get(
        f"{api_url}/api/3/contacts",
        headers={"Api-Token": api_key},
        params={"email": email}
    )
    search_response.raise_for_status()
    existing_contacts = search_response.json().get('contacts', [])
    
    if existing_contacts:
        # Update existing contact
        contact_id = existing_contacts[0]['id']
        contact_response = requests.put(
            f"{api_url}/api/3/contacts/{contact_id}",
            headers={"Api-Token": api_key, "Content-Type": "application/json"},
            json=contact_data
        )
        print(f"📝 Updated existing contact: {email}")
    else:
        # Create new contact
        contact_response = requests.post(
            f"{api_url}/api/3/contacts",
            headers={"Api-Token": api_key, "Content-Type": "application/json"},
            json=contact_data
        )
        print(f"✨ Created new contact: {email}")
    
    contact_response.raise_for_status()
    contact_id = contact_response.json()['contact']['id']
    
    # Subscribe to list
    list_data = {
        "contactList": {
            "list": list_id,
            "contact": contact_id,
            "status": 1  # 1=active, 2=unsubscribed
        }
    }
    
    list_response = requests.post(
        f"{api_url}/api/3/contactLists",
        headers={"Api-Token": api_key, "Content-Type": "application/json"},
        json=list_data
    )
    list_response.raise_for_status()
    
    print(f"✅ Subscribed to list: {list_name}")


def main():
    parser = argparse.ArgumentParser(description='Manage ActiveCampaign lists')
    parser.add_argument('--action', required=True, choices=['list', 'create', 'add-contact'], 
                       help='Action to perform')
    parser.add_argument('--name', help='List name (for create action)')
    parser.add_argument('--list', help='List name (for add-contact action)')
    parser.add_argument('--email', help='Contact email (for add-contact action)')
    parser.add_argument('--first-name', help='Contact first name')
    parser.add_argument('--last-name', help='Contact last name')
    parser.add_argument('--phone', help='Contact phone number')
    
    args = parser.parse_args()
    
    # Get API credentials
    api_key = os.getenv('ACTIVECAMPAIGN_API_KEY')
    api_url = os.getenv('ACTIVECAMPAIGN_URL')
    
    if not api_key or not api_url:
        print("❌ Error: Missing environment variables")
        print("   Set ACTIVECAMPAIGN_API_KEY and ACTIVECAMPAIGN_URL")
        sys.exit(1)
    
    try:
        if args.action == 'list':
            list_all_lists(api_key, api_url)
        elif args.action == 'create':
            if not args.name:
                print("❌ Error: --name required for create action")
                sys.exit(1)
            create_list(api_key, api_url, args.name)
        elif args.action == 'add-contact':
            if not args.list or not args.email:
                print("❌ Error: --list and --email required for add-contact action")
                sys.exit(1)
            add_contact_to_list(
                api_key, api_url, args.list, args.email,
                args.first_name or "", args.last_name or "", args.phone or ""
            )
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()

