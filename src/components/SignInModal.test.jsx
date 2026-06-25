import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignInModal from './SignInModal'

let signatureIsEmpty = false
vi.mock('react-signature-pad-wrapper', async () => {
  const React = await import('react')
  return {
    default: React.forwardRef((props, ref) => {
      React.useImperativeHandle(ref, () => ({
        toDataURL: () => 'data:image/png;base64,SIG',
        clear: () => {},
        isEmpty: () => signatureIsEmpty,
      }))
      return React.createElement('canvas', { 'data-testid': 'sig-pad' })
    }),
  }
})

vi.mock('localforage', () => ({
  default: {
    getItem: vi.fn().mockResolvedValue([]),
    setItem: vi.fn().mockResolvedValue(undefined),
  },
}))

describe('SignInModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    signatureIsEmpty = false
  })

  it('calls handleSignIn with the entered student and signature', async () => {
    const handleSignIn = vi.fn()
    render(<SignInModal open handleClose={() => {}} handleSignIn={handleSignIn} />)
    fireEvent.change(screen.getByLabelText('Student Name'), { target: { value: 'Ada Lovelace' } })
    fireEvent.change(screen.getByLabelText('Student ID'), { target: { value: '42' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))
    await waitFor(() => expect(handleSignIn).toHaveBeenCalledTimes(1))
    expect(handleSignIn).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Ada Lovelace', id: '42', signatureIn: 'data:image/png;base64,SIG' })
    )
  })

  it('blocks a duplicate student ID', async () => {
    const localforage = (await import('localforage')).default
    localforage.getItem.mockResolvedValueOnce([{ id: '42', name: 'Existing' }])
    const handleSignIn = vi.fn()
    render(<SignInModal open handleClose={() => {}} handleSignIn={handleSignIn} />)
    fireEvent.change(screen.getByLabelText('Student Name'), { target: { value: 'Dup' } })
    fireEvent.change(screen.getByLabelText('Student ID'), { target: { value: '42' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))
    await screen.findByText('A student with this ID has already signed in.')
    expect(handleSignIn).not.toHaveBeenCalled()
  })

  it('requires both name and student ID before signing in', async () => {
    const handleSignIn = vi.fn()
    render(<SignInModal open handleClose={() => {}} handleSignIn={handleSignIn} />)
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))
    await screen.findByText('Please enter both name and student ID.')
    expect(handleSignIn).not.toHaveBeenCalled()
  })

  it('requires a signature before signing in', async () => {
    signatureIsEmpty = true
    const handleSignIn = vi.fn()
    render(<SignInModal open handleClose={() => {}} handleSignIn={handleSignIn} />)
    fireEvent.change(screen.getByLabelText('Student Name'), { target: { value: 'Ada Lovelace' } })
    fireEvent.change(screen.getByLabelText('Student ID'), { target: { value: '42' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))
    await screen.findByText('Please provide a signature before signing in.')
    expect(handleSignIn).not.toHaveBeenCalled()
  })
})
