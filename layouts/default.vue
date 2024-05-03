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
                    <div v-if="permissions?.includes('report_access')" >
                        <UDivider />
                        <UDashboardSidebarLinks  :links="adminLinks" />
                    </div>
                    <template #footer>
                        <div class="flex flex-col w-full space-y-2" >
                            <UButton
                                v-if="$auth.loggedIn"
                                block
                                label="Opprett ny HMS-rapport"
                                @click="isSlideoverOpen = true"
                            />
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
                        </div>
                    </template>
                </UDashboardSidebar>
            </UDashboardPanel>

            <UDashboardPanel grow>
                <UDashboardNavbar :title="title">
                    <UDashboardNavbarToggle />
                </UDashboardNavbar>
                <slot />
                <UNotifications />
            </UDashboardPanel>
            <UDashboardSlideover v-model="isSlideoverOpen" >
                <UForm :validate="validate" :state="formState" class="space-y-4" @submit="onSubmit">
                    
                    <UFormGroup label="Tittel" name="title">
                        <UInput v-model="formState.title" />
                    </UFormGroup>

                    <UFormGroup label="Når skjedde hendelsen?" name="date">
                        <UInput v-model="formState.date" type="datetime-local" />
                    </UFormGroup>

                    <UFormGroup label="Hvor skjedde hendelsen?" name="location">
                        <UInput v-model="formState.location" type="password" />
                    </UFormGroup>

                    <UFormGroup label="Beskrv arbeidet" name="description">
                        <UTextarea v-model="formState.description" />
                    </UFormGroup>

                    <UFormGroup label="Beskriv hendelsesforløpet" name="cause">
                        <UTextarea v-model="formState.cause" />
                    </UFormGroup>

                    <UFormGroup label="Utbedringer" name="improvment" description="Om relevant">
                        <UTextarea v-model="formState.improvement"/>
                    </UFormGroup>
                    <UDivider />
                    <UFormGroup label="Send inn anonymt" description="Ved å velge denne vil ingen personopplysninger bli tilknyttet rapporten">
                        <UCheckbox v-model="anonymous"  />
                    </UFormGroup>
                    <UDivider />
                    <UButton type="submit" label="Send inn" />
                </UForm>
            </UDashboardSlideover>
        </UDashboardPage>
    </UDashboardLayout>
</template>

<script setup lang="ts">
const client = useKindeClient();
const links = ref([{
    label: 'Hjem',
    to: '/'
}]);
const isSlideoverOpen = ref(false)
const toast = useToast()
const anonymous = ref(false)

const title = useState('title', () => 'Hjem') 

const {data: user} = await useAsyncData(async () => {
    return (await client?.getUserProfile()) ?? {};
});

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

//Fetch navigationtree for the user
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

import type { FormError, FormSubmitEvent } from '#ui/types'

const formState = ref({
  title: undefined,
  location: undefined,
  date: undefined,
  description: undefined,
  cause: undefined,
  improvement: undefined,
  status: 'Pending',
})

const validate = (formState: any): FormError[] => {
  const errors = []
  if (!state.title) errors.push({ path: 'title', message: 'Required' })
  if (!state.location) errors.push({ path: 'location', message: 'Required' })
  if (!state.date) errors.push({ path: 'date', message: 'Required' })
  if (!state.description) errors.push({ path: 'description', message: 'Required' })
  if (!state.cause) errors.push({ path: 'cause', message: 'Required' })
  return errors
}



async function onSubmit (event: FormSubmitEvent<any>) {

    if(!anonymous.value){
        event.data.user_id = user.value.id
        event.data.user_name = user.value.name
    }
    else{
        event.data.user_name = 'Anonym'
    }
    const {data, error} = useFetch('/api/report/createReport',{
        method: 'post',
        body: event.data
    }
    )
    if(data){
        isSlideoverOpen.value = false
        
        toast.add({
            id: data.value?.data.id,
            title: 'Rapport sendt',
            description: 'Rapporten er sendt inn med id: ' + data.value?.data.id
        })
    }
}

</script>
