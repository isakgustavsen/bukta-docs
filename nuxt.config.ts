// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: ["@nuxt/ui-pro"],
  modules: [
    "@nuxtjs/sanity",
    "@nuxt/ui",
    "@nuxtjs/kinde",
    "@nuxt/image",
    "@nuxtjs/supabase",
  ],
  sanity: {
    projectId: "azn1k8lx",
  },
  kinde: {
    authDomain: process.env.NUXT_KINDE_AUTH_DOMAIN,
    clientId: process.env.NUXT_KINDE_CLIENT_ID,
    clientSecret: process.env.NUXT_KINDE_CLIENT_SECRET,
    redirectURL: process.env.NUXT_KINDE_REDIRECT_URL,
    logoutRedirecturl: process.env.NUXT_KINDE_LOGOUT_REDIRECT_URL,
    postLoginRedirecturl: process.env.NUXT_KINDE_POST_LOGIN_REDIRECT_URL,
  },
  supabase: {
    redirect: false,
  },
});
