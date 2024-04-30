import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const body = await readBody(event)
  
  const {data, error } = await client.from('reports').select('*').eq('id', body.id)
  return {data, error}
})
