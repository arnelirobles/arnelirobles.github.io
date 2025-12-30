import "./chunk-BUSYA2B4.js";

// node_modules/resilient-fetcher/dist/index.js
function h(s2, t, i) {
  if (i === "exponential") {
    let n = t * Math.pow(2, s2 - 1), u = Math.random() * 0.3 * n;
    return n + u;
  }
  return t;
}
var E = (s2, t) => t ? t.status >= 500 : true;
async function O(s2, t = {}) {
  let { retries: i = 3, retryDelay: n = 1e3, timeout: u = 5e3, backoff: a = "fixed", retryOn: l2 = E, onRequest: c, onResponse: f, onError: p2, ...m2 } = t, r = 0, R = s2.toString(), w2 = m2;
  for (c && (w2 = await c(R, m2)); ; ) {
    let b = new AbortController(), d2 = setTimeout(() => b.abort(), u);
    try {
      let e = await fetch(R, { ...w2, signal: b.signal });
      if (clearTimeout(d2), !e.ok) {
        if (r < i && l2(null, e)) {
          r++;
          let y2 = h(r, n, a);
          await new Promise((o2) => setTimeout(o2, y2));
          continue;
        }
        throw new Error(`Request failed with status ${e.status}`);
      }
      return f ? await f(e) : e;
    } catch (e) {
      clearTimeout(d2), r++;
      let o2 = e.name === "AbortError" ? new Error("Request timed out") : e;
      if (p2 && p2(o2), r <= i && l2(o2, null)) {
        let q = h(r, n, a);
        await new Promise((x) => setTimeout(x, q));
        continue;
      }
      throw o2;
    }
  }
}

// node_modules/nano-safe-storage/dist/index.js
var s = {};
var g = { getItem: (t) => s[t] ?? null, setItem: (t, n) => {
  s[t] = n;
}, removeItem: (t) => {
  delete s[t];
}, clear: () => {
  for (let t in s) delete s[t];
} };
function m() {
  try {
    if (typeof window < "u" && window.localStorage) {
      let t = "__nano_safe_test__";
      return window.localStorage.setItem(t, t), window.localStorage.removeItem(t), window.localStorage;
    }
  } catch {
  }
  return g;
}
var l = m();
function d(t = {}) {
  let { prefix: n = "", ttl: f } = t, c = (e) => `${n}${e}`;
  return { set(e, r, a) {
    try {
      let i = (a == null ? void 0 : a.ttl) ?? f, u = { value: r, expiry: i ? Date.now() + i * 1e3 : void 0 };
      l.setItem(c(e), JSON.stringify(u));
    } catch (i) {
      console.warn(`nano-safe-storage: set failed for key "${e}"`, i);
    }
  }, get(e) {
    try {
      let r = l.getItem(c(e));
      if (r === null) return null;
      let a = JSON.parse(r);
      return a.expiry && Date.now() > a.expiry ? (this.remove(e), null) : a.value;
    } catch {
      return null;
    }
  }, remove(e) {
    try {
      l.removeItem(c(e));
    } catch (r) {
      console.warn(`nano-safe-storage: remove failed for key "${e}"`, r);
    }
  }, has(e) {
    return this.get(e) !== null;
  }, clear() {
    try {
      n && typeof window < "u" && window.localStorage ? Object.keys(localStorage).filter((r) => r.startsWith(n)).forEach((r) => localStorage.removeItem(r)) : l.clear();
    } catch (e) {
      console.warn("nano-safe-storage: clear failed", e);
    }
  }, isAvailable() {
    return l !== g;
  } };
}
var o = d();
var { set: y, get: S, remove: p, has: v, clear: w } = { set: o.set.bind(o), get: o.get.bind(o), remove: o.remove.bind(o), has: o.has.bind(o), clear: o.clear.bind(o) };

// node_modules/feed-slurp/dist/index.mjs
async function fetchFeedXml(url, options = {}) {
  const { proxy, timeout = 1e4, retries = 3 } = options;
  let requestUrl = url;
  if (proxy) {
    if (typeof proxy === "function") {
      requestUrl = proxy(url);
    } else {
      switch (proxy) {
        case "allorigins":
          requestUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
          break;
        case "corsproxy":
          requestUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
          break;
        default:
          requestUrl = `${proxy}${encodeURIComponent(url)}`;
      }
    }
  }
  const response = await O(requestUrl, {
    retries,
    timeout
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch feed: ${response.status} ${response.statusText}`);
  }
  return response.text();
}
function parseXml(xmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, "text/xml");
  const parseError = doc.getElementsByTagName("parsererror");
  if (parseError.length > 0) {
    throw new Error(`XML parsing failed: ${parseError[0].textContent}`);
  }
  return doc;
}
function getText(node, selector) {
  var _a;
  if (!node) return "";
  const el = node.querySelector(selector);
  return ((_a = el == null ? void 0 : el.textContent) == null ? void 0 : _a.trim()) || "";
}
function getCDataOrText(node, selectors) {
  var _a;
  if (!node) return "";
  for (const selector of selectors) {
    const el = node.querySelector(selector.replace(":", "\\:"));
    if (el) return ((_a = el.textContent) == null ? void 0 : _a.trim()) || "";
  }
  return "";
}
function parseRss(doc) {
  const channel = doc.querySelector("channel");
  if (!channel) throw new Error("Invalid RSS feed: Missing <channel>");
  const items = Array.from(doc.querySelectorAll("item")).map((item) => {
    const description = getText(item, "description");
    const content = getCDataOrText(item, ["content:encoded", "description"]);
    return {
      title: getText(item, "title"),
      link: getText(item, "link"),
      pubDate: new Date(getText(item, "pubDate")).toISOString(),
      description,
      content,
      author: getText(item, "dc\\:creator") || "Unknown",
      categories: Array.from(item.querySelectorAll("category")).map((c) => c.textContent || ""),
      guid: getText(item, "guid") || getText(item, "link"),
      thumbnail: extractThumbnail(item, content)
    };
  });
  return {
    title: getText(channel, "title"),
    description: getText(channel, "description"),
    link: getText(channel, "link"),
    lastBuildDate: getText(channel, "lastBuildDate") || (/* @__PURE__ */ new Date()).toISOString(),
    items
  };
}
function extractThumbnail(item, content) {
  const mediaTags = ["media\\:content", "media\\:thumbnail", "content", "thumbnail"];
  for (const tag of mediaTags) {
    const el = item.querySelector(tag);
    if (el) {
      const url = el.getAttribute("url") || el.getAttribute("src");
      if (url) return url;
    }
  }
  const enclosure = item.querySelector("enclosure[type^='image']");
  if (enclosure) {
    const url = enclosure.getAttribute("url");
    if (url) return url;
  }
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/i;
  const match = content.match(imgRegex);
  if (match && match[1]) return match[1];
  return null;
}
function parseAtom(doc) {
  var _a, _b;
  const feed = doc.querySelector("feed");
  if (!feed) throw new Error("Invalid Atom feed: Missing <feed>");
  const items = Array.from(doc.querySelectorAll("entry")).map((entry) => {
    var _a2, _b2;
    const content = getText(entry, "content") || getText(entry, "summary");
    return {
      title: getText(entry, "title"),
      link: ((_a2 = entry.querySelector("link[rel='alternate']")) == null ? void 0 : _a2.getAttribute("href")) || ((_b2 = entry.querySelector("link")) == null ? void 0 : _b2.getAttribute("href")) || "",
      pubDate: new Date(getText(entry, "updated") || getText(entry, "published")).toISOString(),
      description: getText(entry, "summary"),
      content,
      author: getText(entry, "author name") || "Unknown",
      categories: Array.from(entry.querySelectorAll("category")).map((c) => c.getAttribute("term") || ""),
      guid: getText(entry, "id"),
      thumbnail: extractThumbnail2(entry, content)
    };
  });
  return {
    title: getText(feed, "title"),
    description: getText(feed, "subtitle") || "",
    link: ((_a = feed.querySelector("link[rel='alternate']")) == null ? void 0 : _a.getAttribute("href")) || ((_b = feed.querySelector("link")) == null ? void 0 : _b.getAttribute("href")) || "",
    lastBuildDate: getText(feed, "updated"),
    items
  };
}
function extractThumbnail2(entry, content) {
  const enclosure = entry.querySelector("link[rel='enclosure'][type^='image']");
  if (enclosure) return enclosure.getAttribute("href");
  const match = content.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
}
var storage = d({
  prefix: "slurp_",
  ttl: 3600
  // Default 1 hour
});
function getCachedFeed(key) {
  return storage.get(key);
}
function setCachedFeed(key, feed, ttl) {
  storage.set(key, feed, ttl ? { ttl } : void 0);
}
function clearSlurpCache(key) {
  if (key) {
    storage.remove(key);
  } else {
    storage.clear();
  }
}
async function slurp(url, options = {}) {
  const { cache = true, cacheTTL, cacheKey = url } = options;
  if (cache) {
    const cached = getCachedFeed(cacheKey);
    if (cached) return cached;
  }
  const xml = await fetchFeedXml(url, options);
  const doc = parseXml(xml);
  const isAtom = doc.querySelector("feed") !== null;
  const feed = isAtom ? parseAtom(doc) : parseRss(doc);
  if (cache) {
    setCachedFeed(cacheKey, feed, cacheTTL);
  }
  return feed;
}
function createSlurper(defaultOptions = {}) {
  return {
    slurp: (url, options = {}) => slurp(url, { ...defaultOptions, ...options }),
    clearCache: (key) => clearSlurpCache(key)
  };
}
export {
  clearSlurpCache,
  createSlurper,
  slurp
};
//# sourceMappingURL=feed-slurp.js.map
