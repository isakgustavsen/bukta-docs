<template>
    <UDashboardLayout>
        <UDashboardPage>
            <UDashboardPanel
                :width="250"
                :resizable="{ min: 200, max: 400 }"
                collapsible
            >
                <UDashboardSidebar>
                    <UDashboardNavbar />
                    <UDashboardSidebarLinks :links="links" />
                    <UDivider />
                    <UDashboardSidebarLinks v-if="permissions.includes('report_access')" :links="adminLinks" />
                    <template #footer>
                        <UButton
                            to="/api/logout"
                            external
                            block
                            label="Logout"
                            v-if="$auth.loggedIn"
                        />
                        <UButton
                            v-else
                            to="/api/login"
                            external
                            block
                            label="Login"
                        />
                    </template>
                </UDashboardSidebar>
            </UDashboardPanel>

            <UDashboardPanel grow>
                <UDashboardNavbar :title="title">
                    <UDashboardNavbarToggle />
                </UDashboardNavbar>
                <slot />
            </UDashboardPanel>
        </UDashboardPage>
    </UDashboardLayout>
</template>

<script setup lang="ts">
const client = useKindeClient();
const links = ref([]);

const title = useState('title', () => 'Hjem') 

const adminLinks = [
    {
        label: "Reports",
        to: "/admin/reports",
    },
];

const query = groq`*[permission.current == $permission][0]{
    'label': title,
    'children': *[_type == 'contentPage' && references(^._id)]|order(title asc){
        'label': title,
        'to': "/docs/" + slug.current,
        'children': *[_type == 'contentPage' && references(^._id)]|order(title asc){
        'label': title,
        'to': "/docs/" + slug.current}
    }
}`;

const {data: permissions} = await useAsyncData(async () => {
    const {permissions} = (await client?.getPermissions()) ?? {};
    return permissions;
});

if (permissions.value) {
    for (let i = 0; i < permissions.value.length; i++) {
        const permission = permissions.value[i];
        const { data, error } = await useSanityQuery(query, { permission: permission});
        if(data.value.children){
            for (let index = 0; index < data.value.children.length; index++) {
                const element = data.value.children[index];
                links.value.push(element);
            }
        }
    }
}
</script>
