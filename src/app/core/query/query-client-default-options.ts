export const QUERY_CLIENT_DEFAULT_OPTIONS = {
  defaultOptions: {
    queries: {
      // Prevents queries from automatically refetching when the browser window regains focus
      // This avoids unnecessary network requests when users switch between tabs/windows
      refetchOnWindowFocus: false,
      
      // Sets the stale time to 5 minutes (1000ms * 60s * 5min)
      // Data is considered fresh for 5 minutes before being marked as stale
      // Stale data will not trigger a refetch unless explicitly requested
      staleTime: 1000 * 60 * 5
    }
  }
}