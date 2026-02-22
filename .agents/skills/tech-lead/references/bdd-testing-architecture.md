# BDD Testing Architecture (Playwright E2E)

## The Philosophy of True E2E testing

As the Tech Lead, you must treat End-to-End BDD tests strictly as a black-box observation of the system.
If a `Given` scenario requires an initial state (e.g., "Given a registered user exists"), you **CANNOT use network mocking (`page.route`, `page.intercept`) to fake the backend response.**

Instead, you must ensure the system's actual Database is seeded with the exact data required to make the test truthful.

## The "Isolated Fixtures" Strategy

To retain Playwright's maximum capability (parallel test workers) and prevent race conditions or flaky tests, we DO NOT wipe the database `beforeEach`.

Instead, every single test scenario MUST run with completely **Unique and Isolated Data** (Dynamic Fixtures).

### Rules for Playwright BDD Steps (`features/*.steps.ts`):

1. **Dynamic Identifier Generation:**
   Never use hardcoded identifiers like `user@example.com` directly in your test state if it interacts with the database.
   Instead, append randomness or timestamps:
   ```typescript
   const dynamicEmail = `test_${Date.now()}_${Math.random().toString(36).slice(2, 7)}@example.com`;
   ```

2. **Real Backend Seeding (API or Direct DB):**
   To fulfill `Given a registered user exists with email "user@example.com"`, you must use Playwright's `request` context (API Testing) or a secure backdoor fixture API to physically register the user in the database before proceeding to the `When` UI steps.
   ```typescript
   Given('a registered user exists with email {string} and password {string}', async ({ request }, email, password) => {
       // 1. Generate an isolated identity based on the scenario's requested email base if needed.
       // 2. Call the real registration API or a dedicated E2E Seed API.
       const res = await request.post('/api/auth/register', { 
           data: { email: dynamicEmail, password } 
       });
       expect(res.ok()).toBeTruthy();
       
       // Note: You must map the scenario's generic {string} to your isolated dynamic identity 
       // so the subsequent `When` steps know exactly what to type into the UI.
   });
   ```

3. **Passing Context Between Steps:**
   Playwright BDD allows you to pass state between `Given` and `When` steps using a custom World object, or you can temporarily store the dynamically generated email/username so the next step types the *dynamic* identifier instead of the literal `user@example.com`.
   *(Consider overriding the Playwright BDD fixtures to inject a custom `sharedState` object).*

## Rejection Protocol

If the backend does NOT have an API (like `/api/auth/register`) or a Database Fixture endpoint that allows you to seed the requested data, **DO NOT proceed with the E2E implementation.**

1. Stop writing the step definitions.
2. Abort the task.
3. Notify the Product Lead / User that an architectural dependency (Registration Feature or Seed API) is blocked and must be implemented first.
