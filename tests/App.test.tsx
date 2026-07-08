import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../src/App'

describe('App', () => {
  it('renders the app title', () => {
    render(<App />)
    expect(screen.getByText('Starz Cosmic Oracle')).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    render(<App />)
    expect(screen.getByText('Celestial insights await...')).toBeInTheDocument()
  })

  it('renders the welcome message', () => {
    render(<App />)
    expect(screen.getByText('Welcome to your cosmic journey.')).toBeInTheDocument()
  })

  it('has a clickable button', () => {
    render(<App />)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Stars aligned: 0')
  })
})
