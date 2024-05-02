export default defineNuxtRouteMiddleware(async (to, from) => {
  const client = useKindeClient();
  const { data: hasAccess } = await useAsyncData(async () => {
    return (await client?.getPermission("report_access")) ?? {};
  });
  if (hasAccess.value.isGranted === false) {
    return abortNavigation();
  }
});
