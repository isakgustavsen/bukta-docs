<script lang="ts" setup>

interface Report {
  title: string;
  status: string;
}

const report: Report = {
  title: 'Title5',
  status: 'Pending'
}

const supabase = useSupabaseClient();
const activity = ref()

const { data, error } = await useFetch('/api/report/createReport',{
  method: 'post',
  body: report
})

console.log(data)
console.error(error)

// const { data: newReport, error } = await supabase.from('reports').insert(report).select().single()
// if(error){
//   console.error(error)
// }
// if(newReport){
//   const { data, error } = await supabase.from('report_activity').insert({
//     report_id: newReport.id,
//     type: 'created',
//     name: 'Isak Gustavsen'
//   }).select()
//   if(error){
//     console.error(error)
//   }
//   activity.value = data
// }

// console.log(activity)
// // console.error(error)

</script>

<template>
  <div>
    {{ data }}
    {{ error }}
  </div>
</template>

<style scoped></style>
