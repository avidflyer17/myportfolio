import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ClassicContactForm } from './classic-contact-form'
import { sendContactEmail } from '@/app/actions'

// Mock next-intl
vi.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key,
}))

// Mock server action
vi.mock('@/app/actions', () => ({
    sendContactEmail: vi.fn(),
}))

// Mock complex UI components to simplify testing
vi.mock('@/components/ui/glass-panel', () => ({
    GlassPanel: ({ children, className }: any) => <div className={className}>{children}</div>
}))
vi.mock('@/components/features/contact-submission-overlay', () => ({
    ContactSubmissionOverlay: () => <div data-testid="overlay" />
}))

describe('ClassicContactForm', () => {
    afterEach(() => {
        vi.clearAllMocks()
    })

    it('renders form fields correctly', () => {
        render(<ClassicContactForm />)
        expect(screen.getByPlaceholderText('form.namePlaceholder')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('form.emailPlaceholder')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('form.messagePlaceholder')).toBeInTheDocument()
    })

    it('shows validation error when submitting empty form', async () => {
        render(<ClassicContactForm />)

        const submitBtn = screen.getByText('form.submit')
        fireEvent.click(submitBtn)

        // Check for validation indicators (we look for the error class or text)
        // The component shows "//! REQUIRED" when error is present
        expect(screen.getAllByText('//! REQUIRED').length).toBeGreaterThan(0)

        // Ensure server action was NOT called
        expect(sendContactEmail).not.toHaveBeenCalled()
    })

    it('submits form when all required fields are filled', async () => {
        // Mock success response
        vi.mocked(sendContactEmail).mockResolvedValue({ success: true, data: 'Sent' })

        render(<ClassicContactForm />)

        // Fill inputs
        fireEvent.change(screen.getByPlaceholderText('form.namePlaceholder'), { target: { value: 'John Doe' } })
        fireEvent.change(screen.getByPlaceholderText('form.emailPlaceholder'), { target: { value: 'john@example.com' } })
        fireEvent.change(screen.getByPlaceholderText('form.messagePlaceholder'), { target: { value: 'Hello World' } })

        // Submit
        const submitBtn = screen.getByText('form.submit')
        fireEvent.click(submitBtn)

        // Verify submission
        // Note: The component has a 3s delay (minAnimationTime). We need to verify verify it was called.

        await waitFor(() => {
            expect(sendContactEmail).toHaveBeenCalled()
        })

        const formData = vi.mocked(sendContactEmail).mock.calls[0][0]
        expect(formData.get('name')).toBe('John Doe')
        expect(formData.get('email')).toBe('john@example.com')
        expect(formData.get('message')).toBe('Hello World')
    })
})
