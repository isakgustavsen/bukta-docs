<script lang="ts" setup>
import type { Database } from '@/types/supabase';
import { format } from "@formkit/tempo"

const route = useRoute();
const supabase = useSupabaseClient<Database>();
const pending = ref(false)
const measurePending = ref(false)
const userprofile = useState('profile')

const comments = ref()
const measure = ref('')

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
    measure.value = report.measure
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
    const { data: status } = await supabase.from('report_activity').insert({
            report_id: report.id,
            user_id: userprofile.value.id,
            user_name: userprofile.value.name,
            type: 'updated'
        })
    if(error){
        throw createError({
            statusCode: 404,
            statusMessage: error.message
        })
    }
    if(data){
        window.location.reload()
        }
}

async function updateMeasure() {
    measurePending.value = true
    if(!report?.id){
        throw createError({
            statusCode: 400,
            statusMessage: 'No document ID',
            fatal: true
        })
    }
    const { data, error } = await supabase.from('reports').update({measure: measure.value}).eq('id', report?.id).select()
    const { data: status } = await supabase.from('report_activity').insert({
            report_id: report.id,
            user_id: userprofile.value.id,
            user_name: userprofile.value.name,
            type: 'updated'
        })
    if(error){
        console.log(error)
        throw createError({
            statusCode: 404,
            statusMessage: error.message
        })
    }
    if(data){
        window.location.reload()
        }
}



useTitle(report?.title ?? 'Rapport')

</script>

<template>
    <UDashboardPanelContent>
        <UPageBody prose>
            <div class="flex flex-col">
                <div>
                    <h3>Informasjon</h3>
                    <UDivider />
                    <h4><UIcon name="i-heroicons-clock" /> {{ format(report?.created_at ?? 'Ikke angitt', "hh:mm - DD/MM/YYYY",) }}</h4>
                    <p><UIcon name="i-heroicons-map" /> {{ report?.location ?? 'Ikke angitt' }}</p>
                    <UButtonGroup>
                        <USelect :options="statusOptions" v-model="newStatus" :disabled="pending" :loading="pending" @change="updateStatus" />
                        <!-- <UButton label="Oppdater" v-if="newStatus != report?.status" :loading="pending" @@change="updateStatus" /> -->
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
                <div>
                    <h3>Tiltak</h3>
                    <UDivider />
                    <UForm @submit="updateMeasure()" class="space-y-3" >
                        <UFormGroup name="measure" >
                            <UTextarea v-model="measure" />
                        </UFormGroup>
                        <UButton type="submit" :loading="measurePending" label="Lagre" />
                    </UForm>
                </div>
            </div>
        </UPageBody>
        <UDivider label="Aktivitet"/>
        <LazyActivityMenu :id="report?.id" />
    </UDashboardPanelContent>
</template>

<style scoped></style>