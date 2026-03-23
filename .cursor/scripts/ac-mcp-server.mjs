#!/usr/bin/env node
/**
 * ActiveCampaign MCP server (stdio) — full capabilities.
 * Requires env: AC_API_URL (e.g. https://tennisbeast.api-us1.com), AC_API_TOKEN (API key).
 * Cursor passes these from mcp.json "env" when using command + args.
 */

const AC_API_URL = process.env.AC_API_URL || ''
const AC_API_TOKEN = process.env.AC_API_TOKEN || ''

function acFetch(path, options = {}) {
  const url = `${AC_API_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`
  return fetch(url, {
    ...options,
    headers: {
      'Api-Token': AC_API_TOKEN,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
}

async function acJson(path, options = {}) {
  const res = await acFetch(path, options)
  const text = await res.text()
  if (!res.ok) throw new Error(`AC API ${res.status}: ${text}`)
  return text ? JSON.parse(text) : {}
}

// ——— Contacts ———
async function listContacts(limit = 20, offset = 0, search) {
  let path = `/api/3/contacts?limit=${Math.min(Number(limit) || 20, 100)}&offset=${Number(offset) || 0}`
  if (search) path += `&search=${encodeURIComponent(search)}`
  const data = await acJson(path)
  return { contacts: data.contacts || [], meta: data.meta }
}

async function getContact(contactId) {
  const data = await acJson(`/api/3/contacts/${contactId}`)
  return data.contact
}

async function createContact(contact) {
  const data = await acJson('/api/3/contacts', {
    method: 'POST',
    body: JSON.stringify({ contact }),
  })
  return data.contact
}

async function updateContact(contactId, contact) {
  const data = await acJson(`/api/3/contacts/${contactId}`, {
    method: 'PUT',
    body: JSON.stringify({ contact }),
  })
  return data.contact
}

async function addContactToList(contactId, listId, status = 1) {
  await acJson('/api/3/contactLists', {
    method: 'POST',
    body: JSON.stringify({
      contactList: { list: Number(listId), contact: Number(contactId), status },
    }),
  })
  return { contactId, listId, status }
}

async function addTagToContact(contactId, tagId) {
  await acJson('/api/3/contactTags', {
    method: 'POST',
    body: JSON.stringify({
      contactTag: { contact: String(contactId), tag: String(tagId) },
    }),
  })
  return { contactId, tagId }
}

// ——— Lists ———
async function listLists() {
  const data = await acJson('/api/3/lists')
  return { lists: data.lists || [] }
}

async function getList(listId) {
  const data = await acJson(`/api/3/lists/${listId}`)
  return data.list
}

// ——— Tags ———
async function listTags(limit = 100, offset = 0) {
  const data = await acJson(`/api/3/tags?limit=${limit}&offset=${offset}`)
  return { tags: data.tags || [] }
}

// ——— Campaigns ———
async function listCampaigns(limit = 50, offset = 0) {
  const data = await acJson(`/api/3/campaigns?limit=${limit}&offset=${offset}`)
  return { campaigns: data.campaigns || [] }
}

async function getCampaign(campaignId) {
  const data = await acJson(`/api/3/campaigns/${campaignId}`)
  return data.campaign
}

/**
 * Create a campaign with list(s) and message via legacy admin API.
 * v3 POST /api/3/campaigns returns 405; POST /api/3/campaign only accepts name+type.
 * @see https://www.activecampaign.com/api/example.php?call=campaign_create
 */
async function createCampaignLegacy(fields) {
  const body = new URLSearchParams()
  for (const [k, v] of Object.entries(fields)) {
    body.append(k, String(v))
  }
  const url = `${AC_API_URL.replace(/\/$/, '')}/admin/api.php?api_action=campaign_create&api_output=json`
  const res = await acFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`Legacy campaign_create failed: ${res.status}: ${text}`)
  const data = text ? JSON.parse(text) : {}
  if (Number(data.result_code) !== 1) {
    throw new Error(`Legacy campaign_create: ${data.result_message || JSON.stringify(data)}`)
  }
  return { id: String(data.id), result: data }
}

async function editCampaign(campaignId, body) {
  const data = await acJson(`/api/3/campaigns/${campaignId}/edit`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
  return data.campaign
}

// ——— Messages (email content for campaigns) ———
async function listMessages(limit = 50, offset = 0) {
  const data = await acJson(`/api/3/messages?limit=${limit}&offset=${offset}`)
  return { messages: data.messages || [] }
}

async function getMessage(messageId) {
  const data = await acJson(`/api/3/messages/${messageId}`)
  return data.message
}

async function createMessage(message) {
  const data = await acJson('/api/3/messages', {
    method: 'POST',
    body: JSON.stringify({ message }),
  })
  return data.message
}

async function updateMessage(messageId, message) {
  const data = await acJson(`/api/3/messages/${messageId}`, {
    method: 'PUT',
    body: JSON.stringify({ message }),
  })
  return data.message
}

// ——— Automations ———
async function listAutomations(limit = 50, offset = 0) {
  const data = await acJson(`/api/3/automations?limit=${limit}&offset=${offset}`)
  return { automations: data.automations || [] }
}

async function getAutomation(automationId) {
  const data = await acJson(`/api/3/automations/${automationId}`)
  return data.automation
}

async function addContactToAutomation(contactId, automationId) {
  const data = await acJson('/api/3/contactAutomations', {
    method: 'POST',
    body: JSON.stringify({
      contactAutomation: { contact: String(contactId), automation: String(automationId) },
    }),
  })
  return data.contactAutomation || { contact: contactId, automation: automationId }
}

// ——— Tags (create) ———
async function createTag(tagName, tagType = 'contact', description = '') {
  const data = await acJson('/api/3/tags', {
    method: 'POST',
    body: JSON.stringify({
      tag: { tag: tagName, tagType, description },
    }),
  })
  return data.tag
}

// ——— Segments ———
async function listSegments(limit = 100, offset = 0) {
  const data = await acJson(`/api/3/segments?limit=${limit}&offset=${offset}`)
  return { segments: data.segments || [], meta: data.meta }
}

async function getSegment(segmentId) {
  const data = await acJson(`/api/3/segments/${segmentId}`)
  return data.segment
}

// ——— Custom fields ———
async function listFields() {
  const data = await acJson('/api/3/fields')
  return { fields: data.fields || [] }
}

// ——— Tool definitions ———
const TOOLS = [
  // Contacts
  {
    name: 'ac_list_contacts',
    description: 'List ActiveCampaign contacts with optional limit, offset, and search.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Max contacts (default 20, max 100)' },
        offset: { type: 'number', description: 'Pagination offset' },
        search: { type: 'string', description: 'Search filter' },
      },
    },
  },
  {
    name: 'ac_get_contact',
    description: 'Get a single contact by ID.',
    inputSchema: {
      type: 'object',
      properties: { contactId: { type: 'string', description: 'Contact ID' } },
      required: ['contactId'],
    },
  },
  {
    name: 'ac_create_contact',
    description: 'Create or upsert a contact. Pass email, firstName, lastName; optional phone, fieldValues.',
    inputSchema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        phone: { type: 'string' },
        fieldValues: { type: 'array', description: 'Array of { field: id, value: string }' },
      },
      required: ['email'],
    },
  },
  {
    name: 'ac_update_contact',
    description: 'Update a contact by ID. Pass contactId and any contact fields to update.',
    inputSchema: {
      type: 'object',
      properties: {
        contactId: { type: 'string' },
        email: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        phone: { type: 'string' },
      },
      required: ['contactId'],
    },
  },
  {
    name: 'ac_add_contact_to_list',
    description: 'Add a contact to a list. status: 1=subscribed, 2=unsubscribed, 3=non-subscribed.',
    inputSchema: {
      type: 'object',
      properties: {
        contactId: { type: 'string' },
        listId: { type: 'number' },
        status: { type: 'number', description: '1=subscribed (default)' },
      },
      required: ['contactId', 'listId'],
    },
  },
  {
    name: 'ac_add_tag_to_contact',
    description: 'Add a tag to a contact.',
    inputSchema: {
      type: 'object',
      properties: { contactId: { type: 'string' }, tagId: { type: 'number' } },
      required: ['contactId', 'tagId'],
    },
  },
  // Lists
  {
    name: 'ac_list_lists',
    description: 'List ActiveCampaign lists.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'ac_get_list',
    description: 'Get a single list by ID.',
    inputSchema: {
      type: 'object',
      properties: { listId: { type: 'number' } },
      required: ['listId'],
    },
  },
  // Tags
  {
    name: 'ac_list_tags',
    description: 'List ActiveCampaign tags.',
    inputSchema: {
      type: 'object',
      properties: { limit: { type: 'number' }, offset: { type: 'number' } },
    },
  },
  {
    name: 'ac_create_tag',
    description: 'Create a tag. Pass tag (name), optional tagType (contact/template), description.',
    inputSchema: {
      type: 'object',
      properties: {
        tag: { type: 'string', description: 'Tag name' },
        tagType: { type: 'string', description: 'contact (default) or template' },
        description: { type: 'string' },
      },
      required: ['tag'],
    },
  },
  // Segments
  {
    name: 'ac_list_segments',
    description: 'List ActiveCampaign segments.',
    inputSchema: {
      type: 'object',
      properties: { limit: { type: 'number' }, offset: { type: 'number' } },
    },
  },
  {
    name: 'ac_get_segment',
    description: 'Get a single segment by ID.',
    inputSchema: {
      type: 'object',
      properties: { segmentId: { type: 'string' } },
      required: ['segmentId'],
    },
  },
  // Campaigns
  {
    name: 'ac_list_campaigns',
    description: 'List all campaigns with optional limit and offset.',
    inputSchema: {
      type: 'object',
      properties: { limit: { type: 'number' }, offset: { type: 'number' } },
    },
  },
  {
    name: 'ac_get_campaign',
    description: 'Get a single campaign by ID.',
    inputSchema: {
      type: 'object',
      properties: { campaignId: { type: 'string' } },
      required: ['campaignId'],
    },
  },
  {
    name: 'ac_create_campaign',
    description:
      'Create a campaign via legacy campaign_create (v3 JSON create cannot attach list+message). Requires listIds + messageId, or pass campaign as JSON of form fields (p[listId], m[messageId]=percent). messagePercent defaults to 100.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        type: { type: 'string', description: 'single or recurring' },
        status: { type: 'number', description: '0=draft, 1=scheduled' },
        listIds: { type: 'array', items: { type: 'number' }, description: 'List IDs to send to' },
        messageId: { type: 'number', description: 'Message ID (template) from ac_create_message' },
        messagePercent: { type: 'number', description: 'Split %; use 100 for normal sends' },
        sdate: { type: 'string', description: 'Placeholder schedule datetime (required by API even for drafts)' },
        campaign: { type: 'string', description: 'Advanced: JSON string of legacy form fields' },
      },
      required: ['name'],
    },
  },
  {
    name: 'ac_edit_campaign',
    description: 'Edit an existing campaign. Pass campaignId and fields to update (name, type, status, listIds, segmentId, etc.). Or pass campaign as JSON string.',
    inputSchema: {
      type: 'object',
      properties: {
        campaignId: { type: 'string' },
        name: { type: 'string' },
        type: { type: 'string' },
        status: { type: 'number' },
        listIds: { type: 'array', items: { type: 'number' } },
        campaign: { type: 'string', description: 'Full campaign update JSON string' },
      },
      required: ['campaignId'],
    },
  },
  // Messages
  {
    name: 'ac_list_messages',
    description: 'List email messages (templates used in campaigns).',
    inputSchema: {
      type: 'object',
      properties: { limit: { type: 'number' }, offset: { type: 'number' } },
    },
  },
  {
    name: 'ac_get_message',
    description: 'Get a single message by ID.',
    inputSchema: {
      type: 'object',
      properties: { messageId: { type: 'string' } },
      required: ['messageId'],
    },
  },
  {
    name: 'ac_create_message',
    description:
      'Create an email message (template). Use `html` for body (required for preview); `htmlcontent` is ignored by AC. Pass name, subject, fromname, fromemail, reply2, optional textcontent.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        subject: { type: 'string' },
        fromname: { type: 'string' },
        fromemail: { type: 'string' },
        reply2: { type: 'string' },
        html: { type: 'string', description: 'Email HTML body (this field persists; use this)' },
        htmlcontent: { type: 'string', description: 'Deprecated alias; mapped to html if html omitted' },
        textcontent: { type: 'string' },
        type: { type: 'string', description: 'template (default)' },
        message: { type: 'string', description: 'Full message JSON string' },
      },
      required: ['name', 'subject', 'fromname', 'fromemail'],
    },
  },
  {
    name: 'ac_update_message',
    description: 'Update an email message by ID. Use `html` for body (not htmlcontent).',
    inputSchema: {
      type: 'object',
      properties: {
        messageId: { type: 'string' },
        subject: { type: 'string' },
        html: { type: 'string' },
        htmlcontent: { type: 'string', description: 'Deprecated alias for html' },
        message: { type: 'string', description: 'Full message update JSON' },
      },
      required: ['messageId'],
    },
  },
  // Automations
  {
    name: 'ac_list_automations',
    description: 'List all automations.',
    inputSchema: {
      type: 'object',
      properties: { limit: { type: 'number' }, offset: { type: 'number' } },
    },
  },
  {
    name: 'ac_get_automation',
    description: 'Get a single automation by ID.',
    inputSchema: {
      type: 'object',
      properties: { automationId: { type: 'string' } },
      required: ['automationId'],
    },
  },
  {
    name: 'ac_add_contact_to_automation',
    description: 'Add a contact to an automation (drip). Contact will enter the automation. Pass contactId and automationId.',
    inputSchema: {
      type: 'object',
      properties: {
        contactId: { type: 'string' },
        automationId: { type: 'string' },
      },
      required: ['contactId', 'automationId'],
    },
  },
  // Fields
  {
    name: 'ac_list_fields',
    description: 'List custom fields (contact fields).',
    inputSchema: { type: 'object', properties: {} },
  },
]

async function handleToolCall(name, args) {
  const a = args || {}

  // Contacts
  if (name === 'ac_list_contacts') {
    return JSON.stringify(await listContacts(a.limit, a.offset, a.search), null, 2)
  }
  if (name === 'ac_get_contact') {
    if (!a.contactId) return 'Error: contactId is required'
    return JSON.stringify(await getContact(a.contactId), null, 2)
  }
  if (name === 'ac_create_contact') {
    const contact = a.contact ? (typeof a.contact === 'string' ? JSON.parse(a.contact) : a.contact) : {
      email: a.email,
      firstName: a.firstName || '',
      lastName: a.lastName || '',
      phone: a.phone || '',
      fieldValues: a.fieldValues || [],
    }
    if (!contact.email) return 'Error: email is required'
    return JSON.stringify(await createContact(contact), null, 2)
  }
  if (name === 'ac_update_contact') {
    const contact = {}
    if (a.email != null) contact.email = a.email
    if (a.firstName != null) contact.firstName = a.firstName
    if (a.lastName != null) contact.lastName = a.lastName
    if (a.phone != null) contact.phone = a.phone
    return JSON.stringify(await updateContact(a.contactId, contact), null, 2)
  }
  if (name === 'ac_add_contact_to_list') {
    return JSON.stringify(await addContactToList(a.contactId, a.listId, a.status), null, 2)
  }
  if (name === 'ac_add_tag_to_contact') {
    return JSON.stringify(await addTagToContact(a.contactId, a.tagId), null, 2)
  }

  // Lists
  if (name === 'ac_list_lists') {
    return JSON.stringify(await listLists(), null, 2)
  }
  if (name === 'ac_get_list') {
    if (a.listId == null) return 'Error: listId is required'
    return JSON.stringify(await getList(a.listId), null, 2)
  }

  // Tags
  if (name === 'ac_list_tags') {
    return JSON.stringify(await listTags(a.limit, a.offset), null, 2)
  }
  if (name === 'ac_create_tag') {
    const tag = await createTag(a.tag || '', a.tagType || 'contact', a.description || '')
    return JSON.stringify(tag, null, 2)
  }

  // Segments
  if (name === 'ac_list_segments') {
    return JSON.stringify(await listSegments(a.limit, a.offset), null, 2)
  }
  if (name === 'ac_get_segment') {
    if (!a.segmentId) return 'Error: segmentId is required'
    return JSON.stringify(await getSegment(a.segmentId), null, 2)
  }

  // Campaigns
  if (name === 'ac_list_campaigns') {
    return JSON.stringify(await listCampaigns(a.limit, a.offset), null, 2)
  }
  if (name === 'ac_get_campaign') {
    if (!a.campaignId) return 'Error: campaignId is required'
    return JSON.stringify(await getCampaign(a.campaignId), null, 2)
  }
  if (name === 'ac_create_campaign') {
    if (a.campaign) {
      const parsed = typeof a.campaign === 'string' ? JSON.parse(a.campaign) : a.campaign
      const flat = parsed.campaign && typeof parsed.campaign === 'object' ? parsed.campaign : parsed
      return JSON.stringify(await createCampaignLegacy(flat), null, 2)
    }
    const listIds = a.listIds || []
    if (!listIds.length) return 'Error: listIds is required (or pass campaign as form-field object via campaign)'
    if (a.messageId == null) return 'Error: messageId is required'
    const messagePercent = a.messagePercent ?? 100
    const fields = {
      type: a.type || 'single',
      segmentid: a.segmentid ?? 0,
      name: a.name,
      sdate: a.sdate || '2030-01-01 09:00:00',
      status: a.status ?? 0,
      public: a.public ?? 1,
      tracklinks: a.tracklinks || 'all',
      trackreads: a.trackreads ?? 1,
      trackreplies: a.trackreplies ?? 0,
      htmlunsub: a.htmlunsub ?? 1,
      textunsub: a.textunsub ?? 1,
    }
    listIds.forEach((id) => {
      fields[`p[${id}]`] = id
    })
    fields[`m[${a.messageId}]`] = messagePercent
    return JSON.stringify(await createCampaignLegacy(fields), null, 2)
  }
  if (name === 'ac_edit_campaign') {
    let body
    if (a.campaign) {
      body = typeof a.campaign === 'string' ? JSON.parse(a.campaign) : a.campaign
    } else {
      body = { campaign: {} }
      if (a.name != null) body.campaign.name = a.name
      if (a.type != null) body.campaign.type = a.type
      if (a.status != null) body.campaign.status = a.status
      if (a.listIds != null) {
        a.listIds.forEach((id) => { body.campaign[`p[${id}]`] = id })
      }
    }
    return JSON.stringify(await editCampaign(a.campaignId, body), null, 2)
  }

  // Messages
  if (name === 'ac_list_messages') {
    return JSON.stringify(await listMessages(a.limit, a.offset), null, 2)
  }
  if (name === 'ac_get_message') {
    if (!a.messageId) return 'Error: messageId is required'
    return JSON.stringify(await getMessage(a.messageId), null, 2)
  }
  if (name === 'ac_create_message') {
    const message = a.message ? (typeof a.message === 'string' ? JSON.parse(a.message) : a.message) : {
      type: a.type || 'template',
      name: a.name,
      subject: a.subject,
      fromname: a.fromname,
      fromemail: a.fromemail,
      reply2: a.reply2 || a.fromemail,
      html: a.html ?? a.htmlcontent,
      textcontent: a.textcontent || '',
    }
    if (!message.html && !a.message) {
      return 'Error: html is required (ActiveCampaign ignores htmlcontent for persistence)'
    }
    return JSON.stringify(await createMessage(message), null, 2)
  }
  if (name === 'ac_update_message') {
    const message = a.message ? (typeof a.message === 'string' ? JSON.parse(a.message) : a.message) : {}
    if (a.subject != null) message.subject = a.subject
    const htmlBody = a.html ?? a.htmlcontent
    if (htmlBody != null) message.html = htmlBody
    return JSON.stringify(await updateMessage(a.messageId, message), null, 2)
  }

  // Automations
  if (name === 'ac_list_automations') {
    return JSON.stringify(await listAutomations(a.limit, a.offset), null, 2)
  }
  if (name === 'ac_get_automation') {
    if (!a.automationId) return 'Error: automationId is required'
    return JSON.stringify(await getAutomation(a.automationId), null, 2)
  }
  if (name === 'ac_add_contact_to_automation') {
    if (!a.contactId || !a.automationId) return 'Error: contactId and automationId are required'
    return JSON.stringify(await addContactToAutomation(a.contactId, a.automationId), null, 2)
  }

  // Fields
  if (name === 'ac_list_fields') {
    return JSON.stringify(await listFields(), null, 2)
  }

  return `Unknown tool: ${name}`
}

// MCP over stdio: newline-delimited JSON
const readline = (await import('readline')).default
const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity })

function send(msg) {
  process.stdout.write(JSON.stringify(msg) + '\n')
}

rl.on('line', async (line) => {
  if (!line.trim()) return
  let req
  try {
    req = JSON.parse(line)
  } catch {
    send({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } })
    return
  }
  const id = req.id
  const method = req.method
  const params = req.params || {}

  if (method === 'initialize') {
    send({
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'ac-mcp-local', version: '2.0.0' },
      },
    })
    return
  }

  if (method === 'tools/list') {
    send({
      jsonrpc: '2.0',
      id,
      result: { tools: TOOLS },
    })
    return
  }

  if (method === 'tools/call') {
    const name = params.name
    const args = params.arguments || {}
    try {
      if (!AC_API_URL || !AC_API_TOKEN) {
        throw new Error('AC_API_URL and AC_API_TOKEN must be set in env')
      }
      const text = await handleToolCall(name, args)
      send({
        jsonrpc: '2.0',
        id,
        result: {
          content: [{ type: 'text', text }],
          isError: false,
        },
      })
    } catch (err) {
      send({
        jsonrpc: '2.0',
        id,
        result: {
          content: [{ type: 'text', text: `Error: ${err.message}` }],
          isError: true,
        },
      })
    }
    return
  }

  send({ jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } })
})
