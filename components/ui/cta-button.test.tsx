import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CTAButton } from './cta-button'
import { analytics } from '@/lib/analytics'

// Mock analytics
vi.mock('@/lib/analytics', () => ({
    analytics: {
        trackCTAClick: vi.fn(),
    },
}))

describe('CTAButton', () => {
    afterEach(() => {
        vi.clearAllMocks()
    })

    it('renders children correctly', () => {
        render(<CTAButton>Click Me</CTAButton>)
        expect(screen.getByText('Click Me')).toBeInTheDocument()
    })

    it('calls onClick handler when clicked', () => {
        const handleClick = vi.fn()
        render(<CTAButton onClick={handleClick}>Action</CTAButton>)

        fireEvent.click(screen.getByText('Action'))
        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('tracks analytics when tracking props are provided', () => {
        render(
            <CTAButton
                trackingLabel="Test Button"
                trackingLocation="Unit Test"
            >
                Tracked
            </CTAButton>
        )

        fireEvent.click(screen.getByText('Tracked'))
        expect(analytics.trackCTAClick).toHaveBeenCalledWith('Test Button', 'Unit Test')
    })

    it('does not track analytics when props are missing', () => {
        render(<CTAButton>Untracked</CTAButton>)

        fireEvent.click(screen.getByText('Untracked'))
        expect(analytics.trackCTAClick).not.toHaveBeenCalled()
    })
})
