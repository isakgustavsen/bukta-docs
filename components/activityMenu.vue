<template>
  <ul role="list" class="space-y-6 mt-8">
    <li v-for="(activityItem, activityItemIdx) in report_activity" :key="activityItem.id" class="relative flex gap-x-4">
      <div :class="[activityItemIdx === report_activity.length - 1 ? 'h-6' : '-bottom-6', 'absolute left-0 top-0 flex w-6 justify-center']">
        <div class="w-px bg-gray-200 dark:bg-slate-700" />
      </div>
      <template v-if="activityItem.type === 'commented'">
        <div class="relative flex h-6 w-6 flex-none items-center justify-center bg-white dark:bg-slate-900">
          <UIcon name="i-heroicons-user-circle" class="h-6 w-6 text-slate-700 dark:text-slate-400 " aria-hidden="true" />
        </div>
        <div class="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200 dark:ring-slate-700">
          <div class="flex justify-between gap-x-4">
            <div class="py-0.5 text-xs leading-5 text-gray-500">
              <span class="font-medium text-gray-900 dark:text-slate-100">{{ activityItem.user_name }}</span> kommenterte
            </div>
            <time :datetime="activityItem.created_at" class="flex-none py-0.5 text-xs leading-5 text-gray-500">{{ format(activityItem.created_at, { date: "medium", time: "medium" }) }}</time>
          </div>
          <p class="text-sm leading-6 text-gray-500 dark:text-slate-400">{{ activityItem.comment }}</p>
        </div>
      </template>
      <template v-else>
        <div class="relative flex h-6 w-6 flex-none items-center justify-center bg-white dark:bg-slate-900">
          <div class="h-1.5 w-1.5 rounded-full bg-gray-100 dark:bg-slate-800 ring-1 ring-gray-300 dark:ring-slate-600" />
        </div>
        <p class="flex-auto py-0.5 text-xs leading-5 text-gray-500">
          <span class="font-medium text-gray-900 dark:text-slate-100">{{ activityItem.user_name }}</span> {{ activityItem.type }} the invoice.
        </p>
        <time :datetime="activityItem.created_at" class="flex-none py-0.5 text-xs leading-5 text-gray-500">{{ format(activityItem.created_at, { date: "medium", time: "medium" }) }}</time>
      </template>
    </li>
  </ul>
  <!-- New comment form -->
  <div class="mt-6 pl-9">
    <UForm @submit="onSubmit" :validate="validate" :state="state"  class="relative flex-auto space-y-2">
      <UFormGroup label="Kommentar" name="comment">
        <UTextarea v-model="state.comment" placeholder="Skriv inn en kommentar" />
      </UFormGroup>
      <UButton type="submit" label="Kommenter" class="flex flex-row justify-right" />
    </UForm>
  </div>
  
</template>

<script lang="ts" setup>
//Setup
import type { FormError, FormSubmitEvent } from '#ui/types'
import { format } from "@formkit/tempo"
import type { Database } from '~/types/supabase';
const supabase = useSupabaseClient<Database>()
const profile = useState('profile')

const props = defineProps({
  id: Number
})

//Fetch activity
let { data: report_activity } = await supabase.from('report_activity').select('*').eq('report_id', props.id)

//Formstuff
const state = reactive({
  type: 'commented',
  comment: '',
  user_id: profile.value.id,
  user_name: profile.value.name,
  report_id: props.id
})

const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.comment) errors.push({ path: 'comment', message: 'Påkrevd' })
  return errors
}

async function onSubmit (event: FormSubmitEvent<any>) {
  const { data, error } = await supabase.from('report_activity').insert(event.data)
  window.location.reload()
}


</script>