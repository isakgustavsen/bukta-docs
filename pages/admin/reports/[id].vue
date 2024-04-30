<script lang="ts" setup>
import type { Database } from '@/types/supabase';
import { format } from "@formkit/tempo"

const route = useRoute();
const supabase = useSupabaseClient<Database>();
const pending = ref(false)

const comments = ref()
const statusOptions = [
    {
        name: 'Pending',
        value: 'Pending'
    },{
        name: 'Completed',
        value: 'Completed'
    }
]

const { data: report, error } = await supabase
    .from("reports")
    .select("*")
    .eq("id", route.params.id)
    .single();

if(report){
    const { data, error } = await supabase.from('report_activity').select('*').eq('report_id', report?.id)
    comments.value = data
}

const newStatus = ref(report?.status)


async function updateStatus() {
    pending.value = true
    if(!report?.id){
        throw createError({
            statusCode: 400,
            statusMessage: 'No document ID',
            fatal: true
        })
    }
    const { data, error } = await supabase.from('reports').update({status: newStatus.value}).eq('id', report?.id).select()
    console.error(error)
    if(data){pending.value = false}
}



useTitle(report?.title ?? 'Rapport')

</script>

<template>
    <UDashboardPanelContent>
        <UPageBody prose>
            {{ $auth.user?.id }}
            <div class="flex flex-col">
                <div>
                    <h3>Informasjon</h3>
                    <UDivider />
                    <h4><UIcon name="i-heroicons-clock" /> {{ format(report?.created_at ?? 'Ikke angitt', "hh:mm - DD/MM/YYYY",) }}</h4>
                    <p><UIcon name="i-heroicons-map" /> {{ report?.place ?? 'Ikke angitt' }}</p>
                    <UButtonGroup>
                        <USelect :options="statusOptions" v-model="newStatus" :disabled="pending" />
                        <UButton label="Oppdater" v-if="newStatus != report?.status" :loading="pending" @click="updateStatus" />
                    </UButtonGroup>
                </div>
                <div>
                    <h3>Beskrivelse</h3>
                    <UDivider />
                    <p>{{ report?.description ?? 'Ikke angitt' }}</p>
                </div>
                <div>
                    <h3>Årsak</h3>
                    <UDivider />
                    <p>{{ report?.cause ?? 'Ikke angitt' }}</p>
                </div>
                <div>
                    <h3>Forbedring</h3>
                    <UDivider />
                    <p>{{ report?.improvement ?? 'Ikke Angitt' }}</p>
                </div>
            </div>
        </UPageBody>
        <UDivider label="Kommentarer"/>
        <LazyCommentSection :id="report?.id" />
    </UDashboardPanelContent>
</template>

<style scoped></style>


xl:max-w-3xl w-full mx-auto outline-2 shadow-2xl outline rounded-lg p-8 outline-slate-800