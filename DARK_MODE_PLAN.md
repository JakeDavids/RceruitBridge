# Dark Mode Implementation Plan

## Strategy
Use Tailwind CSS dark mode with `class` strategy + Context API for theme management

## Implementation Steps

### 1. Configure Tailwind for Dark Mode ✅
- Update `tailwind.config.js` with `darkMode: 'class'`
- Enable dark mode variants for all utilities

### 2. Create Theme Context ✅
- `src/contexts/ThemeContext.jsx`
- Provides `theme` and `toggleTheme` function
- Persists preference to localStorage
- Defaults to system preference

### 3. Add Theme Toggle Component ✅
- Sun/Moon icon button in sidebar header
- Smooth transition animations
- Accessible with ARIA labels

### 4. Apply Dark Mode Classes ✅
- Update all pages with dark: variants
- Color palette:
  - Background: `dark:bg-slate-900`
  - Cards: `dark:bg-slate-800`
  - Text: `dark:text-slate-100`
  - Borders: `dark:border-slate-700`
  - Hover: `dark:hover:bg-slate-700`

### 5. Update Components
- Sidebar: Dark background with gradient
- Cards: Subtle borders and shadows in dark mode
- Buttons: Maintain brand colors with dark variants
- Forms: Dark input backgrounds
- Tables: Alternating row colors for dark mode

## Color Scheme

### Light Mode (Current)
- Background: `from-slate-50 to-blue-50`
- Cards: `bg-white`
- Text: `text-slate-900`
- Borders: `border-slate-200`

### Dark Mode (New)
- Background: `from-slate-900 to-slate-800`
- Cards: `bg-slate-800`
- Text: `text-slate-100`
- Borders: `border-slate-700`
- Accents: Keep blue/purple gradients for brand consistency

## Testing Checklist
- [ ] All pages render correctly in dark mode
- [ ] Brand gradients still visible
- [ ] Forms are readable and accessible
- [ ] Toggle persists across page reloads
- [ ] Smooth transitions between modes
