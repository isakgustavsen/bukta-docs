export default defineNuxtRouteMiddleware(async (to, from) => {
  const client = useKindeClient();
  const { data: hasAccess } = await useAsyncData(async () => {
    return (await client?.getPermission("report_access")) ?? {};
  });
  console.log("Middleware has run");
  if (hasAccess.value.isGranted === false) {
    console.log("Middleware has aborted navigation");
    return abortNavigation();
  }
});
