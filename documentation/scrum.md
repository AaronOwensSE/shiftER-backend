# Scrum

## Product Backlog

| Feature | Priority |
|---|---|
| Database Setup | High |
| Deployment Setup | High |
| Account Creation | High |
| Login Authentication | High |
| Session Authentication | High |
| Logout | High |
| Basic User Functionality | High |
| Basic Group Functionality | High |
| Basic Draft and Schedule Functionality | High |
| Fine-Grained User Functionality | Medium |
| Fine-Grained Group Functionality | Medium |
| Fine-Grained Draft and Schedule Functionality | Medium |
| Password Recovery | Low |
| Rate Limiting | Low |
| Excel Integration | Low |
| Qgenda Integration | Low |

| To Do | Doing | Done |
|---|---|---|
| Basic Draft and Schedule Functionality | Basic Group Functionality | Database Setup |
| Fine-Grained User Functionality |  | Deployment Setup |
| Fine-Grained Group Functionality |  | Account Creation |
| Fine-Grained Draft and Schedule Functionality |  | Login Authentication |
| Password Recovery |  | Session Authentication |
| Rate Limiting |  | Logout |
| Excel Integration |  | Basic User Functionality |
| Qgenda Integration |  |  |

## Sprints

### Sprint 3: Basic Group Functionality

#### Velocity: 

#### Backlog

| Feature | Points | Rationale |
|---|---|---|
| Group Creation | 5 | (+) Schema Complexity |
| Membership Retrieval by User | 3 |  |
| Group Profile Retrieval | 8 | (+) Authorization, (+) Schema Complexity |
| Membership Retrieval by Group | 8 | (+) Authorization, (+) Schema Complexity |
| Group Invitation | 5 | (+) Authorization |
| Invitation Retrieval | 3 |  |
| Invitation Acceptance/Rejection | 3 |  |
| Group Departure | 5 | (+) Authorization |
| Group Removal | 5 | (+) Authorization |
| Group Profile Update | 5 | (+) Authorization |
| Group Admin Update | 8 | (+) Authorization, (+) Schema Complexity |
| Group Deletion | 8 | (+) Authorization, (+) Schema Complexity |

| To Do | Doing | Done | Failed |
|---|---|---|---|
|  | Group Creation |  |  |
|  | Membership Retrieval by User |  |  |
|  | Group Profile Retrieval |  |  |
|  | Membership Retrieval by Group |  |  |
| Group Invitation |  |  |  |
| Invitation Retrieval |  |  |  |
| Invitation Acceptance/Rejection |  |  |  |
| Group Departure |  |  |  |
| Group Removal |  |  |  |
| Group Profile Update |  |  |  |
| Group Admin Update |  |  |  |
| Group Deletion |  |  |  |

### Sprint 2: Refactoring, Demoing, and Basic User Functionality

#### Velocity: 40

#### Backlog

| Feature | Points | Rationale |
|---|---|---|
| Service Layer Architecture Adjustment | 3 |  |
| Service Layer Refactoring | 5 | (+) Volume |
| Service Layer Testing | 5 | (+) Volume |
| NODE_ENV Support | 2 | (-) Brief |
| Decouple Cryptography Libraries from Service Layer | 2 | (-) Brief |
| Layer-Based Error Handling | 5 | (+) Volume |
| Authentication Demo | 5 | (+) Editing |
| Render Link | 2 | (-) Brief |
| User Profile Retrieval | 3 |  |
| User Profile Retrieval Testing | 3 |  |
| User Profile Update | 3 |  |
| User Profile Update Testing | 3 |  |
| User Deletion | 3 |  |
| User Deletion Testing | 3 |  |
| User Profile Demo | 5 | (+) Editing |

| To Do | Doing | Done | Failed |
|---|---|---|---|
|  |  | NODE_ENV Support | Authentication Demo |
|  |  | Service Layer Architecture Adjustment | User Profile Demo |
|  |  | Service Layer Refactoring | Render Link |
|  |  | Service Layer Testing |  |
|  |  | User Profile Retrieval |  |
|  |  | Decouple Cryptography Libraries from Service Layer |  |
|  |  | User Deletion |  |
|  |  | Layer-Based Error Handling |  |
|  |  | User Profile Retrieval Testing |  |
|  |  | User Deletion Testing |  |
|  |  | User Profile Update |  |
|  |  | User Profile Update Testing |  |

### Sprint 1: Adapting to New Architecture

#### Velocity: 48

#### Backlog

| Feature | Points | Rationale |
|---|---|---|
| Repurpose Database Setup Scripts | 2 | (-) Familiar |
| Repurpose Database Seeding Scripts | 2 | (-) Familiar |
| Repurpose Database Teardown Scripts | 2 | (-) Familiar |
| Rewrite Account Creation | 5 | (+) New architecture, (+) Reestablish dependencies, (-) Familiar |
| Obstacle: Learn Postman | 3 |  |
| Account Creation Testing | 5 | (+) New architecture, (+) Reestablish dependencies, (-) Familiar |
| Rewrite Login Authentication | 3 | (+) New architecture, (-) Familiar |
| Login Authentication Testing | 3 | (+) New architecture, (-) Familiar |
| Rewrite Session Authentication | 3 | (+) New architecture, (-) Familiar |
| Session Authentication Testing | 3 | (+) New architecture, (-) Familiar |
| Rewrite Logout | 3 | (+) New architecture, (-) Familiar |
| Logout Testing | 3 | (+) New architecture, (-) Familiar |
| Obstacle: Learn Render | 3 |  |
| Deployment Setup | 5 | (+) Unfamiliar |
| Deployment Testing | 5 | (+) Unfamiliar |

| To Do | Doing | Done | Failed |
|---|---|---|---|
|  |  | Rewrite Account Creation | Repurpose Database Seeding Scripts |
|  |  | Obstacle: Learn Postman |  |
|  |  | Obstacle: Learn Render |  |
|  |  | Deployment Setup |  |
|  |  | Repurpose Database Setup Scripts |  |
|  |  | Repurpose Database Teardown Scripts |  |
|  |  | Rewrite Login Authentication |  |
|  |  | Rewrite Session Authentication |  |
|  |  | Rewrite Logout |  |
|  |  | Account Creation Testing |  |
|  |  | Login Authentication Testing |  |
|  |  | Session Authentication Testing |  |
|  |  | Logout Testing |  |
|  |  | Deployment Testing |  |

---

[Back to README](../README.md)
