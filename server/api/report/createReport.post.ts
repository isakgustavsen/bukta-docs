import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/supabase'
import type { report } from '~/types'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
  const body:report = await readBody(event)
  console.log('Server side log:');
  console.log(body)
  
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
