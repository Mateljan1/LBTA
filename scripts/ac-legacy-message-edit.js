/**
 * ActiveCampaign legacy message_edit — registers HTML as editor content (not “fetch” mode)
 * so the campaign designer and previews can resolve correctly.
 *
 * v3 POST/PUT /messages alone often leaves htmlfetch as "now" and the Email Designer
 * opens empty; message_edit with htmlconstructor=editor fixes that.
 *
 * @see https://www.activecampaign.com/api/example.php?call=message_edit
 */

/**
 * @param {string} html
 * @returns {string}
 */
function htmlToPlainText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 12000)
}

/**
 * @param {{
 *   baseUrl: string,
 *   apiKey: string,
 *   messageId: string | number,
 *   html: string,
 *   subject: string,
 *   fromname: string,
 *   fromemail: string,
 *   reply2: string,
 *   listId: string | number,
 * }} opts
 */
async function legacyMessageEdit(opts) {
  const {
    baseUrl,
    apiKey,
    messageId,
    html,
    subject,
    fromname,
    fromemail,
    reply2,
    listId,
  } = opts
  const plain = htmlToPlainText(html)
  const body = new URLSearchParams()
  body.append('id', String(messageId))
  body.append('format', 'mime')
  body.append('subject', subject)
  body.append('fromemail', fromemail)
  body.append('fromname', fromname)
  body.append('reply2', reply2)
  body.append('priority', '3')
  body.append('charset', 'utf-8')
  body.append('encoding', 'quoted-printable')
  body.append('htmlconstructor', 'editor')
  body.append('html', html)
  body.append('htmlfetch', '')
  body.append('htmlfetchwhen', 'send')
  body.append('textconstructor', 'editor')
  body.append('text', plain)
  body.append('textfetch', '')
  body.append('textfetchwhen', 'send')
  body.append(`p[${listId}]`, String(listId))

  const url = `${baseUrl.replace(/\/$/, '')}/admin/api.php?api_action=message_edit&api_output=json`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Api-Token': apiKey,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`message_edit HTTP ${res.status}: ${text.slice(0, 800)}`)
  }
  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error(`message_edit non-JSON: ${text.slice(0, 500)}`)
  }
  if (Number(data.result_code) !== 1) {
    throw new Error(`message_edit: ${data.result_message || text.slice(0, 500)}`)
  }
  return data
}

module.exports = { legacyMessageEdit, htmlToPlainText }
