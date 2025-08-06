'use client'

import { useExample } from './hooks'
import { EXAMPLE_CONSTANTS } from './constants'

export function ExampleComponent() {
  const { greeting, isLoading, error } = useExample()

  if (isLoading) {
    return <div>{EXAMPLE_CONSTANTS.LOADING_MESSAGE}</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div>
      <h1>{greeting || EXAMPLE_CONSTANTS.DEFAULT_TEXT}</h1>
    </div>
  )
}