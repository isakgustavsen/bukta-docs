import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/supabase'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
  const body = await readBody(event)
  
  const {data, error } = await client
    .from('reports')
    .insert(body)
    .select()
    .single()

  if(error){
    console.log(error)
    return {error}
  }
  const {data: activity, error: activityError} = await client.from('report_activity').insert({
    report_id: data.id,
    type: 'created',
    user_name: body.user_name,
    user_id: body.user_id
  }).select().single()

  if(activityError){
    console.log(activityError)
  }

  return {data}
})
