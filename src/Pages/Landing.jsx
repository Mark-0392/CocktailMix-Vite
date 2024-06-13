import axios from 'axios'
import { useLoaderData } from 'react-router-dom'
import CocktailList from '../Components/CocktailList'
import SearchForm from '../Components/SearchForm'
import { QueryClient, useQuery } from '@tanstack/react-query'
const cocktailSearchUrl =
  'https://www.thecocktaildb.com/api/json/v1/1/search.php?s='

const searchCocktailsQuery = (searchTerm) => {
  return {
    queryKey: ['search', searchTerm || 'all'],
    queryFn: async () => {
      const response = await axios.get(`${cocktailSearchUrl}${searchTerm}`)
      console.log(response)
      return response.data.drinks
    },
  }
}

export const loader =
  (queryClient) =>
  async ({ request }) => {
    // console.log(request);
    const url = new URL(request.url)
    // console.log(url)

    const searchTerm = url.searchParams.get('search') || ''
    await queryClient.ensureQueryData(searchCocktailsQuery(searchTerm))
    // const response = await axios.get(`${cocktailSearchUrl}${searchTerm}`)
    // console.log(response)
    // return { drinks: response.data.drinks, searchTerm }
    return { searchTerm }
  }

const Landing = () => {
  const { searchTerm } = useLoaderData()
  const { data: drinks, isLoading } = useQuery(searchCocktailsQuery(searchTerm))
  if (isLoading) return <h4>loading...</h4>
  // console.log(drinks)
  return (
    <>
      <SearchForm searchTerm={searchTerm} />
      <CocktailList drinks={drinks} />
    </>
  )
}
export default Landing
