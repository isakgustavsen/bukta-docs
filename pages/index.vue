<script lang="ts" setup>
const supabase = useSupabaseClient();

const { data, error } = await supabase.from("reports").select("*");
</script>

<template>
    <UDashboardPanelContent>
        <UPageBody prose>
            <h1 v-if="$auth.loggedIn">
                Du har blitt logget inn {{ $auth.user.given_name }}!
            </h1>
            <h1 v-else>Logg inn for å se mer</h1>
        </UPageBody>
    </UDashboardPanelContent>
</template>

<style scoped></style>
