import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const body = await readBody(event)
  
  console.log(body)
  const {data, error } = await client.from('reports').insert(body).select().single()
  if(error){
      throw createError({
        statusCode: 404,
        statusMessage: error.message
      })
  }
  const {data: activity, error: activityError} = await client.from('report_activity').insert({
    report_id: data.id,
    type: 'created',
    name: 'Isak Gustavsen',
    user_id: 'kp_5079c58b511149e69837b89dbe8515a4'
  })

  if(activityError){
    console.error(activityError)
    throw createError({
      statusCode: 404,
      statusMessage: activityError.message
    })
  }
  return {data, error}
})
