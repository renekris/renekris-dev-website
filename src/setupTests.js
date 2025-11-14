// Setup Jest globals for browser environment
import "@testing-library/jest-dom";

// Define browser globals that Jest needs
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.Request = Request;
global.Response = Response;
global.fetch = fetch;
global.URL = URL;
global.URLSearchParams = URLSearchParams;
global.HTMLElement = HTMLElement;
global.DocumentFragment = DocumentFragment;
global.MutationObserver = MutationObserver;
global.IntersectionObserver = IntersectionObserver;
global.requestAnimationFrame = requestAnimationFrame;
global.cancelAnimationFrame = cancelAnimationFrame;
global.performance = performance;
global.queueMicrotask = queueMicrotask;
global.getComputedStyle = getComputedStyle;
global.AbortController = AbortController;
global.PointerEvent = PointerEvent;
global.EventTarget = EventTarget;
global.MessageChannel = MessageChannel;
