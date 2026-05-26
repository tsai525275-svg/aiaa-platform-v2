"use client";

import { useEffect } from "react";

const BRAND_TERM = "AIAA";
const WRAPPED_ATTRIBUTE = "data-aiaa-no-translate";

function shouldSkipNode(node: Node) {
  const parent = node.parentElement;
  if (!parent) return true;

  const tag = parent.tagName.toLowerCase();
  if (["script", "style", "noscript", "textarea", "input", "select", "option"].includes(tag)) {
    return true;
  }

  return Boolean(parent.closest(`[${WRAPPED_ATTRIBUTE}], .notranslate, [translate="no"]`));
}

function wrapBrandTerms(root: ParentNode) {
  if (typeof document === "undefined") return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (shouldSkipNode(node)) return NodeFilter.FILTER_REJECT;
      return node.textContent?.includes(BRAND_TERM) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });

  const textNodes: Text[] = [];
  let current = walker.nextNode();

  while (current) {
    textNodes.push(current as Text);
    current = walker.nextNode();
  }

  for (const textNode of textNodes) {
    const text = textNode.textContent ?? "";
    if (!text.includes(BRAND_TERM)) continue;

    const fragment = document.createDocumentFragment();
    const parts = text.split(BRAND_TERM);

    parts.forEach((part, index) => {
      if (part) fragment.appendChild(document.createTextNode(part));
      if (index < parts.length - 1) {
        const span = document.createElement("span");
        span.className = "notranslate";
        span.setAttribute("translate", "no");
        span.setAttribute(WRAPPED_ATTRIBUTE, "true");
        span.textContent = BRAND_TERM;
        fragment.appendChild(span);
      }
    });

    textNode.parentNode?.replaceChild(fragment, textNode);
  }
}

export function AIAANoTranslate() {
  useEffect(() => {
    const root = document.body;

    wrapBrandTerms(root);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (node.nodeType === Node.TEXT_NODE) {
            wrapBrandTerms(node.parentElement ?? root);
          }

          if (node.nodeType === Node.ELEMENT_NODE) {
            wrapBrandTerms(node as Element);
          }
        }
      }
    });

    observer.observe(root, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
