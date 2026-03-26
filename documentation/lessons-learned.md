# Lessons Learned

## Sprint 1 Retrospective: Adapting to New Architecture

### What went right?

- Using the previous version of the project as a reference to bring existing features to a new architecture worked well.
- Starting fresh allowed me to wash my hands of a lot of dormant, overengineered code and write only what is needed.
- The new approach to error handling no longer leaves advantages on the table and has improved readability of code.
- Dependencies have been simplified.
- New lessons about HTTP and REST have been incorporated.
- Deployment to Render worked well.

### What went wrong?

The architecture still has one noticeable flaw. The service layer needs better separation between app-level services (user stories) and the domain-level services they coordinate.

---

Sacrilege though it may be to say it, Scrum is going wrong.

I've read the Scrum book. I've seen the importance of its principles in every job I've ever worked. Small, cross-functional, self-organizing teams intelligently estimating their own work, prioritizing rapid delivery of high-value, working features, and carrying products from end to end entirely within the team are undeniably valuable. Maximizing internal communication, minimizing departmental black holes, avoiding waste, working directly with the customer, and being capable of constant improvement and change are principles that all successful companies tend to realize, whether they call it Scrum or not. Capturing all of this in a relatively simple system that anyone can follow is what makes Scrum great.

But I am not a company. I am one person. I work a full-time job unrelated to software engineering. I work out three days a week. Sometimes I have to go to the doctor. Sometimes I get stuck at work late. My free time is almost entirely devoted to software projects and the study of software engineering, but my work doesn't fit well into a structure that assumes I can move tasks from *To Do* to *Doing* to *Done* at the same pace every week. I am at my most productive when my whiteboard is free for me to write on, not cluttered with sticky notes; when I am free to follow an idea to its conclusion, even if it means stopping to learn a new skill; and when my excitement over seeing new code come to life far exceeds my stress over maintaining velocity.

Scrum is not free. Scrum is work of its own, and the value of that work increases as it enables communication and focus within a *group.* For an individual working on an unpredictable schedule, Scrum's overhead can become a drain on productivity. Its pressure can stifle creativity. Its team rituals can feel empty.

I don't intend to abandon Scrum, but I need to make it work for me instead of the other way around.

### What changes are needed?

- Now that the project is deployed, I need to begin demoing it from the README.
- Architecture needs to acknowledge separation between app-level and domain-level services. Some additional refactoring will be needed to support this.
- Sprints need to be lengthened to account for unpredictable distribution of free time.
- Scrum rituals designed for teams and customers need to be minimized in the absence of those stakeholders.

## REST

I've been circling REST for a while now, wondering whether I should confidently state that my APIs are RESTful. After some research and discussion with a working software engineer, I believe I am now following this style correctly in my backend work.

REST stands for Representational State Transfer. It is an architectural style that facilitates the *transfer* of information about the *state* of resources through some form of *representation,* like JSON or XML. But that doesn't really explain it.

The big idea from a development perspective is uniformity. To achieve a uniform interface, we categorize the problem domain in terms of resources (or nouns), much as we do in object-oriented programming or database schema design. For this project, the resources would be things like users, groups, schedules, or group memberships. This enables the client to use HTTP URIs to specify which resources it wants to act upon.

The services we provide to the client in relation to these resources map closely to the familiar CRUD functions (create, read, update, and delete). These, in turn, map onto the HTTP methods POST, GET, PUT/PATCH, and DELETE, respectively. As a result, the client can use HTTP methods to specify which CRUD actions it wants to take.

With method and URI combined, the client has a uniform way to request actions to be performed on resources over HTTP. Headers and body payloads also play a supporting role.

So, for instance, an HTTP POST request to URI users would almost certainly be a request to create a new user. The API would unpack the body of this request and expect to find user credentials and other information. It would perform validation, determine if the request could be fulfilled, create the resource if possible, and return a response status code indicating success or failure, along with the unique identifier of the new resource if successful.

URIs get more complex as more specificity is required. For instance, an HTTP GET request to URI users/123/groups could be interpreted as a request to read all groups to which user 123 belongs. Authentication could also enter into this. For example, the HTTP request might need a bearer token in its header for the server to authenticate before fulfilling the request.

Statelessness is another major REST constraint. In a RESTful API, neither client nor server should have to maintain information about the other between requests. All of the information required to fulfill a request must be contained within the request itself. Strict implementation of REST constraints, therefore, is challenged by things like cookies and session IDs. However, there do appear to be practical allowances for minimal violations such as these in the world of API development.

REST also addresses things like caching, where responses to requests communicate whether they can be cached by the client, and layering, where the client does not know or care if it's interacting with the server directly.

## Common HTTP Response Status Codes

- 200 OK
- 400 Bad Request
- 401 Unauthorized - Better understood as unauthenticated (identity unknown).
- 403 Forbidden - Better understood as unauthorized (identity known but access restricted).
- 404 Not Found
- 409 Conflict
- 500 Internal Server Error

## Error Handling Revisited

My embrace of the Result pattern in previous versions of this project was a mistake. It turned almost every function into a ritual of unpacking one Result only to pack up and return another. Readability of code suffered, and functions became unnecessarily bogged down in this process.

I chose to use Results because I didn't want to have to put try/catch blocks in every layer of code. But that was misguided. If you're handling exceptions needlessly at every layer, you're doing it wrong. Exceptions are useful because you *don't* have to handle them in every function. They will happily jump all the way up the call stack without the programmer having to do anything. You handle them when the code you're writing actually *can* handle them. And you design your architecture with an awareness of where that will be.

Meanwhile, most of your code reads like a simple, happy path.

---

[Back to README](../README.md)
