const AUTH_REDIRECT_STORAGE_KEY = "assignment-explainer.auth.redirect";

const isSafeRedirectPath = (value: string | null | undefined): value is string =>
  Boolean(value && value.startsWith("/") && !value.startsWith("//"));

const getStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage;
};

export const buildRouteTarget = (pathname: string, search = "", hash = "") =>
  `${pathname}${search}${hash}`;

export const readRedirectTarget = () => {
  const storage = getStorage();

  if (!storage) {
    return null;
  }

  const value = storage.getItem(AUTH_REDIRECT_STORAGE_KEY);
  return isSafeRedirectPath(value) ? value : null;
};

export const writeRedirectTarget = (value: string | null | undefined) => {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  if (!isSafeRedirectPath(value)) {
    storage.removeItem(AUTH_REDIRECT_STORAGE_KEY);
    return;
  }

  storage.setItem(AUTH_REDIRECT_STORAGE_KEY, value);
};

export const clearRedirectTarget = () => {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.removeItem(AUTH_REDIRECT_STORAGE_KEY);
};

export const resolveRedirectTarget = (search: string, fallback = "/dashboard") => {
  const params = new URLSearchParams(search);
  const next = params.get("next");

  if (isSafeRedirectPath(next)) {
    return next;
  }

  return readRedirectTarget() ?? fallback;
};
