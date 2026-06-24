import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SignOutModal from './SignOutModal'

vi.mock('react-signature-pad-wrapper', async () => {
  const React = await import('react')
  return {
    default: React.forwardRef((props, ref) => {
      React.useImperativeHandle(ref, () => ({
        toDataURL: () => 'data:image/png;base64,OUT',
        clear: () => {},
      }))
      return React.createElement('canvas', { 'data-testid': 'sig-pad' })
    }),
  }
})

describe('SignOutModal', () => {
  it('calls handleSignOut with timeOut and signatureOut', () => {
    const handleSignOut = vi.fn()
    const student = { id: '7', name: 'Grace Hopper', timeIn: '9:00' }
    render(<SignOutModal open handleClose={() => {}} handleSignOut={handleSignOut} student={student} />)
    expect(screen.getByText(/Grace Hopper/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Sign Out' }))
    expect(handleSignOut).toHaveBeenCalledWith(
      expect.objectContaining({ id: '7', name: 'Grace Hopper', signatureOut: 'data:image/png;base64,OUT' })
    )
    expect(handleSignOut.mock.calls[0][0]).toHaveProperty('timeOut')
  })
})
