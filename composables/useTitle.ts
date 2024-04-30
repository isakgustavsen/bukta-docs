export const useTitle = (title:string) => {
  const headerTitle = useState('title')
  headerTitle.value = title
}
