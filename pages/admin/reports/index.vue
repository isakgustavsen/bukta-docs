<script lang="ts" setup>
definePageMeta({
    title: "foo",
    middleware: "has-report-access",
});

useTitle('Rapporter')

import type { Database } from '~/types/supabase';
import { format } from "@formkit/tempo"

const supabase = useSupabaseClient<Database>();

const columns = [
    {
        label: "Opprettet",
        key: "created_at",
    },
    {
        label: "Tittel",
        key: "title",
    },
    {
        label: "Status",
        key: "status",
    },
    {
        label: "Handling",
        key: "actions",
    },
];

const { data } = await supabase.from("reports").select("*");

</script>

<template>
    <UDashboardPanelContent>
        <UTable :rows="data" :columns="columns">
            <template #created_at-data="{ row }">
                {{ format(row.created_at, { date: "medium", time: "medium" }) }}
            </template>
            <template #title-data="{ row }">
                {{ row.title }}
            </template>
            <template #status-data="{ row }">
                <UBadge v-if="row.status == 'Completed'" color="green" :label="row.status" />
                <UBadge v-else-if="row.status == 'Pending'" color="yellow" :label="row.status" />
                <UBadge v-else color="red" label="Unknown" />
            </template>
            <template #actions-data="{ row }">
                <UButton block :to="'/admin/reports/' + row.id"
                    >Se rapport</UButton
                >
            </template>
        </UTable>
    </UDashboardPanelContent>
</template>

<style scoped></style>
