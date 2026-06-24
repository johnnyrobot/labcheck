import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('harness', () => {
  it('renders DOM with jest-dom matchers', () => {
    render(<button>hello</button>)
    expect(screen.getByRole('button', { name: 'hello' })).toBeInTheDocument()
  })
})
