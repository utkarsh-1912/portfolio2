# Utkristi Exchange

An optional HFT × Kannada portfolio experience. Tap the header appearance button to cycle **Light → Dark → Exchange → Light**; the icon shows the current mode. The terminal's `theme exchange` also turns it on. The separate `utkristi-experience` preference never overwrites the existing `utkristi-portfolio-theme` light/dark setting. No database migration or new dependency is required.

## Research and direction

Reviewed the home, Work, and Journey pages at https://i-m-abbhay.netlify.app/. The useful reference is the consistency of the railway metaphor: bilingual labels, departures navigation, structured project listings, a continuous career line, and previous/next section links. No assets or code were copied.

The new interpretation uses an exchange workspace: persistent navigation, compact metadata, a project book, an execution log, and a bid/ask panel. The shared graphite surfaces, restrained amber accents, and Kannada lettering carry the identity across every public page.

Sources consulted:
- Karnataka Tourism, weaving traditions: https://karnatakatourism.org/en/experiences/weaving-traditions-of-karnataka/
- Government of Karnataka, Mysuru specialities: https://mysore.nic.in/en/mysuru-specialities/
- Nasdaq, matching engines and order books: https://www.nasdaq.com/products/fintech/eqlipse/about-matching-engines

## Implementation boundaries

- `src/components/exchange/` owns the alternate home, shell, preference, and illustrative market panel.
- `src/app/exchange.css` contains opt-in tokens and distinct component styles. Existing global styles and theme provider are unchanged.
- The original homepage remains rendered in its own wrapper, hidden only in Exchange. The existing contact form is shared.
- Existing routes, project detail modals, galleries, writing, search, footer links, and terminal retain their implementations. The alternate shell and palette carry across public routes.
- Admin/login routes explicitly use the original experience.
- The market panel offers Depth chart, Order book, and Event tape views of one deterministic synthetic feed. Play/Pause, Step, and Reset control the 700 ms replay. Reduced motion disables autoplay but retains manual playback. It is not live market data, trading functionality, or a performance claim.
- Content uses the existing cached public CMS queries; only published projects and articles appear.

## Verification checklist

1. Tap the appearance control through Light, Dark, and Exchange.
2. Reload Exchange and move through Opening Bell, The Engineer, Project Book, and Research Wire. Check the current desk and previous/next links.
3. From a detail page, choose Light or Dark. The URL and content stay in place, and the regular navigation returns.
4. At narrow widths, check navigation, the simulation, and the appearance menu.
5. Admin and login stay in the standard themes.
