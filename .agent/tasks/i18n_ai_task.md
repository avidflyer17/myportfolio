# Internationalization of AI Interface

## Status
- [x] Create I18n Implementation Plan.
- [x] Update `messages/fr.json` with `neuralInterface`.
- [x] Update `messages/en.json` with `neuralInterface`.
- [x] Update `components/features/neural-interface.tsx` to use translations and pass locale.
- [x] Update `app/api/chat/route.ts` to switch System Prompts based on locale.

## Notes
The Neural Interface now fully supports both French and English.
- **Frontend**: The UI elements (title, init messages, placeholders, error messages) are translated using `next-intl`.
- **Backend**: The API receives the user's locale and selects the appropriate System Prompt (FR or EN), ensuring the AI Model responds in the correct language while maintaining its Cyberpunk persona.
