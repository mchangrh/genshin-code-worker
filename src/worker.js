const codeRegex = new RegExp(/\n\t-->\|(.+)\|(?:A|G|NA)<!--/)
const detailsRegex = new RegExp(/\n\t-->\|(.+?)<!--/)
const dateRegex = new RegExp(/\n\t-->\|([\d-]+)(?:\|([\d-]+))?<!--/)
const codeURL = "https://genshin-impact.fandom.com/wiki/Promotional_Code?action=raw"

const getCodes = async () => {
  const body = await fetch(codeURL, {
    cf: {
      cacheTtl: 86400,
      cacheEverything: true
    }
  }).then(response => response.text())
  const comboRegex = new RegExp(codeRegex.source + detailsRegex.source + dateRegex.source, "g")
  const now = new Date()
  const codeArray = []
  const allMatches = body.matchAll(comboRegex)
  for (const match of allMatches) {
    const code = {
      code: match[1],
      description: match[2],
      discovery: match[3],
      expiry: match[4]
    }
    if (!code?.expiry) codeArray.push(code)
    else {
      const expiry = new Date(code.expiry)
      if (expiry > now) codeArray.push(code)
    }
  }
  return JSON.stringify(codeArray, null, 2)
}

export default {
  async fetch(request, env, ctx) {
    const codes = await getCodes()
    return new Response(codes, {
      headers: { 'content-type': 'application/json' }
    });
  },
};