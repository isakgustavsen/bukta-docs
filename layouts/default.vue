<template>
  <UDashboardLayout>
    <UDashboardPanel :width="250" :resizable="{ min: 200, max: 400 }" collapsible>
      <UDashboardNavbar />

      <UDashboardSidebar>
        <template #header>
          <!-- Place anything you like here -->
          <UDashboardSearchButton />
        </template>

        <UDashboardSidebarLinks :links="links" />

        <template #footer>
          <span v-if="$auth.loggedIn">
            <UButton to="/api/logout" external>
              Logout
            </UButton>
          </span>
          <ULink v-else to="/api/login" external>
            <UButton>Login</UButton>
          </ULink>
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>

    <UDashboardPage>
        <UDashboardPanel grow>
            <slot />
        </UDashboardPanel>
    </UDashboardPage>
  </UDashboardLayout>
</template>

<script setup lang="ts">
const client = useKindeClient()
const links = ref([])

async function fetchAdmin() {
  const query = groq`*[_type == 'homePage' && _id == '1932d52c-4e4c-4127-845e-26d7f13c2dfe'][0]{
    'label': title,
    'children': *[_type == 'contentPage' && references(^._id)]|order(title asc){
      'label': title,
      'to': "/docs/" + slug.current,
      'children': *[_type == 'contentPage' && references(^._id)]|order(title asc){
        'label': title,
        'to': "/docs/" + slug.current}
    }
  }`
  const { data } = await useSanityQuery(query)
  return data
}

async function fetchNavigation() {
  const query = groq`*[_type == 'homePage' && _id == '0b6bd09e-c564-49b1-bfe7-fd5701b11e24'][0]{
    'label': title,
    'children': *[_type == 'contentPage' && references(^._id)]|order(title asc){
      'label': title,
      'to': "/docs/" + slug.current,
      'children': *[_type == 'contentPage' && references(^._id)]|order(title asc){
        'label': title,
        'to': "/docs/" + slug.current}
    }
  }`
  const { data } = await useSanityQuery(query)

  return data
}

const {data: isUser} = await useAsyncData(async () => {
  return (await client?.getPermission('user')) ?? {}
})

const {data: isAdmin} = await useAsyncData(async () => {
  return (await client?.getPermission('admin')) ?? {}
})

// Fetch navigation if user has access
if(isUser?.value?.isGranted){
  const res = await fetchNavigation()
  for (let index = 0; index < res.value.children.length; index++) {
    const element = res.value.children[index];
    links.value.push(element)
  }
}
if(isAdmin?.value?.isGranted){
  const res = await fetchAdmin()
  for (let index = 0; index < res.value.children.length; index++) {
    const element = res.value.children[index];
    links.value.push(element)
  }
}
</script>