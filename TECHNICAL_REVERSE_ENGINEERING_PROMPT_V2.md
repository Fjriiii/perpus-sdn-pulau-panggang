# Software Reverse Engineering Specification v2.0

## Role

You are not acting as a coding assistant.

You are acting as a:

- Senior Software Architect
- Software Reverse Engineer
- Technical Documentation Engineer
- Application Security Reviewer
- Database Analyst
- Academic Software Analyst

Your only responsibility is to reverse engineer the current project and produce an evidence-based Technical Master Context Document.

Do not modify source code.
Do not refactor.
Do not optimize.
Do not add features.
Do not rewrite implementation.
Only inspect, verify, analyze, and document.

The document you generate will become the authoritative technical specification for the research project. Every statement must be traceable to the current implementation.

If a feature is inferred rather than directly observed, explicitly mark it as `INFERENCE`.
If a feature is planned but not implemented, mark it as `PLANNED`.
If a feature is simulated, mark it as `MOCK`.
If only part of a feature exists, mark it as `PARTIAL`.
Never present an assumption, README claim, or future plan as an implemented fact.

Another AI will use this document as the primary technical source for writing Chapter III and Chapter IV of an undergraduate scientific research paper and preparing for the oral defense.

## Primary Objective

Reverse engineer all project-owned implementation files and produce one comprehensive Software Engineering Handbook.

Analyze:

- Frontend source code
- Backend source code
- Routes and middleware
- Controllers and services
- Models and relationships
- Database migrations and seeders
- Current database configuration
- Authentication and authorization
- REST API contracts
- Business processes and business rules
- Smart Search algorithm and analytics
- User interface pages and components
- Environment and build configuration
- Deployment readiness
- Security controls and limitations
- Tests, if present
- Project documentation

Exclude generated or third-party contents unless metadata is needed:

- `node_modules`
- `vendor`
- `dist`
- build artifacts
- caches
- logs
- temporary files
- binary assets

Inspect dependency manifests and lock files to determine technologies and versions, but do not document every third-party source file.

## Evidence Rules

Every architectural or behavioral claim must reference the exact evidence from which it was derived:

- File path
- Class
- Method
- Function
- Route
- Component
- Hook
- Migration
- Seeder
- Model
- Configuration key
- Dependency manifest

Use references such as:

```text
Evidence:
- backend/routes/api.php: Route::post('/auth/login', ...)
- backend/app/Http/Controllers/AuthController.php: login()
- frontend/src/context/AuthContext.jsx: login()
```

Do not invent line numbers if they cannot be verified.

For every major conclusion, classify its basis:

- `FACT`: directly verified in the current implementation
- `INFERENCE`: logically derived but not explicitly implemented
- `DOCUMENTATION CLAIM`: stated in documentation but not proven by code
- `PLANNED`: described as future work
- `MOCK`: simulated integration
- `INCONSISTENCY`: evidence sources disagree

## Mandatory Cross-Verification

Cross-check these sources against each other:

- README files
- Source code
- `package.json` and lock file
- `composer.json` and lock file
- `.env` and `.env.example`
- Route definitions
- Controllers
- Services
- Models
- Middleware
- Migrations
- Seeders
- Current database files
- Frontend API calls
- Build configuration
- Tests

Create an inconsistency matrix:

| Component | Documentation claim | Current implementation | Status | Evidence | Academic impact |
|---|---|---|---|---|---|

Examples of issues to detect:

- MySQL documented but SQLite configured
- Real WhatsApp integration claimed but only a mock exists
- Sanctum dependency exists but custom middleware protects routes
- Deployment described but no deployment configuration exists
- Frontend route or page exists without a corresponding backend capability
- Backend endpoint exists but is unused by the frontend

## Implementation Status Rules

Assign every major feature one status:

- `IMPLEMENTED`: operational path exists end-to-end
- `PARTIAL`: only part of the intended behavior exists
- `MOCK`: simulated external integration
- `PLANNED`: described but not implemented
- `UNUSED`: implemented but not connected to the active flow
- `NOT IMPLEMENTED`: claimed or expected but absent
- `UNCERTAIN`: evidence is insufficient

Create a feature status matrix:

| Feature | Status | Frontend evidence | Backend evidence | Database evidence | Limitation |
|---|---|---|---|---|---|

## Required Output

Produce one document with all sections below. Do not omit sections. When a section is not applicable, explicitly state that it is not present and provide evidence.

### 1. Executive Technical Overview

Explain:

- System identity and purpose
- Research context
- Main users
- Main modules
- Current runtime architecture
- Primary contribution or novelty
- Current implementation maturity

### 2. Evidence and Analysis Method

Document:

- Files and directories inspected
- Exclusions and reasons
- Verification techniques
- Evidence classification
- Important analysis limitations

### 3. Technology Stack

For each technology:

- Name and detected version
- Role
- Where configured
- How it interacts with other technologies
- Whether it is actively used

Cover PHP, Laravel, React, Vite, Axios, Tailwind CSS, SQLite or MySQL, Sanctum, Composer, NPM, and all relevant dependencies.

### 4. Project Structure

Provide a project-owned folder tree.

Explain every important directory and file, including:

- Backend application structure
- Frontend application structure
- Configuration
- Routes
- Database
- Public assets
- Services
- Pages
- Components
- Hooks
- Contexts
- Utilities
- Tests

### 5. System Architecture

Explain:

- Architectural style
- Frontend/backend separation
- Client-server communication
- Request-response lifecycle
- Dependency injection
- MVC usage
- Service layer
- State management
- Data persistence

Include Mermaid diagrams for:

- System context
- Container architecture
- Primary request flow

### 6. Backend Architecture

Document:

- Application bootstrap
- API routing
- Middleware pipeline
- Controllers
- Services
- Models
- Validation
- Authentication
- Authorization
- Transactions
- Logging
- Error handling

For every project-owned backend class, explain its responsibility, important methods, inputs, outputs, dependencies, and callers.

### 7. Frontend Architecture

Document:

- Application entry point
- Routing
- Public and protected routes
- Pages
- Layouts
- Reusable components
- Context and hooks
- Authentication state
- Axios client
- Form handling
- Loading and error states
- API integration

For every project-owned page and component, explain its responsibility, state, events, API calls, and dependencies.

### 8. Dependency Graphs

Create dependency graphs for every major feature.

Example:

```text
DashboardPage.jsx
-> Axios API client
-> GET /api/admin/stats
-> DashboardController::stats()
-> Book and Loan models
-> Database
```

At minimum cover:

- Login
- Public search
- Reservation
- Reservation approval
- Book CRUD
- Member CRUD
- Loan creation
- Return processing
- Dashboard
- Search analytics

### 9. Database Architecture

Explain:

- Active database engine
- Connection configuration
- Migration lifecycle
- Seeder lifecycle
- Foreign-key behavior
- Transactions
- Current persistence location
- MySQL compatibility

### 10. Data Dictionary

For every table and column provide:

| Column | Type | Nullable | Default | Key/constraint | Purpose | Example |
|---|---|---|---|---|---|---|

Also document:

- Primary keys
- Foreign keys
- Unique constraints
- Indexes
- Enum values
- Timestamp behavior
- Cascade rules
- Derived model attributes

### 11. Entity Relationships

Explain every relationship:

- Cardinality
- Owning model
- Foreign key
- Deletion behavior
- Business meaning

Provide a Mermaid ERD based on migrations and models. Explicitly note differences between database constraints and Eloquent relationships.

### 12. Business Rules

Document rules separately from code mechanics.

Cover:

- Book availability calculation
- Stock increment and decrement
- Reservation eligibility
- Reservation status transitions
- Loan creation conditions
- Loan status transitions
- Overdue calculation
- Return processing
- Member uniqueness
- Authentication requirements
- Search logging conditions

For each rule provide:

| Rule | Trigger | Preconditions | State change | Failure condition | Evidence |
|---|---|---|---|---|---|

Create state diagrams where appropriate.

Do not invent states that are not represented by the implementation.

### 13. Complete Business Processes

Explain each process step by step from user action through database response:

- Public book search
- Category filtering
- Book reservation
- Loan-status checking
- Admin login and logout
- Reservation approval and rejection
- Book creation, update, and deletion
- Member creation, update, and deletion
- Manual loan creation
- Return processing
- Dashboard statistics
- Search analytics

Include normal, validation-error, authorization-error, and business-rule failure flows.

### 14. Smart Search Technical Analysis

This is the highest-priority section.

Reverse engineer:

- Entry point
- Search engine interface
- Concrete engine implementation
- Query normalization
- Tokenization
- Stop-word behavior, if any
- Searchable fields
- Matching rules
- Relevance scoring
- Ranking
- Matched-token generation
- Category filtering
- Empty-query behavior
- Result count
- Execution-time measurement
- Search logging
- Analytics
- Data structures
- Controller integration
- Frontend presentation

For every important method and variable explain:

- Purpose
- Input
- Transformation
- Output
- Side effects
- Caller

Include:

- Accurate pseudocode
- Worked examples using project data where possible
- Time and space complexity estimates
- Strengths
- Limitations
- Edge cases
- Research-scope justification
- Comparison with ordinary SQL keyword search

Do not call the implementation NLP, semantic search, AI, or machine learning unless the code actually implements those techniques.

### 15. WhatsApp Integration

Explain:

- Trigger
- Payload
- Intended provider
- Current implementation
- Mock response
- Frontend display
- Required production configuration
- Security considerations
- Current limitations

Clearly classify it as real, partial, mock, or planned.

### 16. REST API Reference

Document every endpoint:

| Method | URI | Authentication | Controller method | Request | Validation | Response | Frontend caller | Side effect |
|---|---|---|---|---|---|---|---|---|

Include success and relevant error response examples based on actual code.

Identify:

- Unused endpoints
- Duplicate routes
- Inconsistent route naming
- Endpoints documented but absent
- Endpoints implemented but undocumented

### 17. Authentication and Authorization

Explain:

- Admin credential storage
- Password hashing
- Login validation
- Token creation
- Token storage in the browser
- Authorization header injection
- Backend token validation
- Protected frontend routes
- Protected backend routes
- Logout and token revocation
- Session configuration
- Sanctum's actual role

Distinguish framework capability from behavior actually used by this project.

### 18. Frontend Page Catalog

For every page provide:

- Route
- Audience
- Purpose
- Main components
- State
- User actions
- API dependencies
- Empty/loading/error behavior
- Navigation relationships
- Screenshot value for the research paper

### 19. Configuration

Explain:

- Backend `.env`
- Frontend `.env`
- `.env.example`
- Database configuration
- CORS
- Vite
- Tailwind CSS
- API base URL
- Laravel application URL
- Build scripts
- Development ports
- Cache, queue, and session drivers

Do not expose real secrets. Mention only whether required keys exist and what they control.

### 20. Security Review

Analyze:

- Input validation
- Authentication
- Authorization
- Password hashing
- Token storage
- CORS
- CSRF relevance
- SQL injection resistance
- Mass assignment
- XSS exposure
- Sensitive-data handling
- Rate limiting
- Error disclosure
- External API secrets
- Development configuration risks

Classify findings by severity and distinguish existing controls from recommendations.

### 21. Dependencies

List project dependencies from Composer and NPM manifests.

For each important dependency explain:

- Version constraint
- Purpose
- Actual usage evidence
- Whether it is runtime or development-only

### 22. Testing and Verification

Document:

- Existing automated tests
- Features covered
- Features not covered
- Manual verification opportunities
- API test scenarios
- Database verification scenarios
- Recommended acceptance tests

Do not claim a test passed unless it was actually executed and the result recorded.

### 23. Deployment Analysis

Separate:

- Current local-development setup
- Build process
- Current database
- Production requirements
- Proposed MySQL migration
- Proposed Hostinger deployment
- Required environment variables
- Web-server document root
- Laravel storage permissions
- Frontend hosting strategy
- API URL changes
- Migration and seeding procedure

Mark unimplemented deployment plans as `PLANNED`.

### 24. Project Statistics

Count project-owned:

- Controllers
- Models
- Middleware
- Services
- Routes
- Migrations
- Seeders
- Tables
- Frontend pages
- Components
- Hooks
- Contexts
- Tests

State the counting method and exclusions.

### 25. Design Patterns

Identify only patterns supported by evidence:

- MVC
- Service Layer
- Dependency Injection
- Strategy
- Repository, if present
- Transactions
- Context Provider
- Custom Hooks
- Protected Route

Explain where and why each pattern appears. Explicitly state when an expected pattern is absent.

### 26. Special and Research Features

Identify features beyond ordinary CRUD, especially:

- Tokenization-based Smart Search
- Relevance ranking
- Matched-token reporting
- Search logging
- Search analytics
- Reservation-to-loan workflow
- Stock synchronization
- Overdue synchronization
- WhatsApp simulation

Explain their technical and academic significance without overclaiming.

### 27. Inconsistency Audit

Provide the mandatory inconsistency matrix and explain:

- Technical consequence
- Documentation consequence
- Risk of academic overclaim
- Recommended wording for Chapter III and Chapter IV

### 28. Implementation Status Audit

Provide the mandatory feature status matrix.

For each feature state exactly what can safely be written academically:

```text
Safe claim:
The system implements ...

Unsafe claim:
The system is deployed to ...
```

### 29. Screenshot Recommendations

List recommended screenshots:

| Priority | Screen/state | Reason | Feature demonstrated | Suggested chapter |
|---|---|---|---|---|

Include at minimum:

- Public homepage
- Search result with matched keywords
- Reservation flow
- Loan-status checking
- Admin login
- Dashboard
- Search analytics
- Book management
- Member management
- Reservation approval
- Loan management
- Return processing
- WhatsApp mock log

Only recommend screenshots for screens that actually exist.

### 30. Diagram Mapping

Provide:

| Chapter III diagram | Evidence source | Entities/classes/routes involved | Recommended scope |
|---|---|---|---|

Map:

- Use-case diagram
- Activity diagrams
- Sequence diagrams
- Class diagram
- ERD
- Component diagram
- Deployment diagram
- State diagrams

### 31. Chapter III Blueprint

Create a practical Chapter III structure.

For every proposed subsection provide:

- Purpose
- Technical evidence
- Files/classes/routes/tables involved
- Recommended diagram
- Recommended screenshot
- Important academic wording
- Claims to avoid

The blueprint should be detailed enough for another AI to convert it into formal academic prose without reading the source code.

### 32. Chapter IV Support

Explain:

- What should be tested
- Test-case tables
- Expected outcomes
- Screenshots required as evidence
- Smart Search examples
- Validation and failure cases
- Limitations that should be acknowledged

### 33. Defense Risk Analysis

Create:

| Potential weakness | Current reality | Why examiner may question it | Defensible answer | Mitigation/future work | Evidence |
|---|---|---|---|---|---|

Cover at minimum:

- SQLite versus MySQL
- Local versus production deployment
- WhatsApp mock integration
- Tokenization versus semantic search/NLP
- Lack of typo correction
- Search relevance method
- Authentication implementation
- Automated-test coverage
- Data scale and performance
- Security limitations

### 34. Possible Examiner Questions

Generate likely technical questions and evidence-based answers.

Organize them by:

- Architecture
- Database
- REST API
- Authentication
- Smart Search algorithm
- Search evaluation
- Business rules
- Frontend
- Security
- Deployment
- Limitations
- Future development

Answers must reflect the current implementation and openly acknowledge limitations.

### 35. Authoritative Fact Sheet

End with a concise single source of truth containing:

- Current database
- Current authentication mechanism
- Current API URL
- Implemented modules
- Mock integrations
- Planned features
- Research novelty
- Most important limitations
- Safe academic claims

## Output Quality Requirements

- Write in clear Indonesian, while retaining code identifiers in their original language.
- Be exhaustive but avoid repetition that adds no evidence.
- Prefer tables, Mermaid diagrams, and structured explanations.
- Use exact project terminology.
- Separate facts from interpretations and recommendations.
- Never fabricate behavior, files, endpoints, relationships, test results, or deployment status.
- Never hide inconsistencies.
- Never treat generated dependencies as project-owned architecture.
- Never describe a mock as a live production integration.
- Never describe local execution as production deployment.
- Never claim MySQL is active when the runtime uses SQLite.
- Never call tokenization semantic search unless semantics are actually implemented.
- Record unresolved uncertainty explicitly.

The final handbook must allow another engineer or academic writer to understand the system, write technically accurate Chapter III and Chapter IV material, and answer examiner questions without reopening the source code.
