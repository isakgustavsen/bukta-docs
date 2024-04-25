// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: ['@nuxt/ui-pro'],
  modules: ["@nuxtjs/sanity", "@nuxt/ui", "@nuxtjs/kinde"],
  sanity: {
    projectId: 'azn1k8lx'
  },
})