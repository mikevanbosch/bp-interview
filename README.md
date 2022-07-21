# Interview Project

## Notes
* There are readme's for the frontend and backend in their respective directories
* This backend was made with nestjs
  * Deployed using serverless and the aws-cdk

* The frontend was made with react
  * Deployed using the aws-cdk
* all cdk code is located in the `/infra` directories

## Reasoning behind technical choices
* I opted to use NestJS for the backend (for fun). I don't currently work in typescript and have limited exposure to nest.
  * The backend API is deployed using serverless for ease of use.
  * The backend database uses Dynamodb (deployed with cdk). I opted for a single-table design due to the limited requirements of this project.
* For the frontend, I opted to use React. I don't currently do any frontend development; however, I sometimes play with react with hobby projects.
  * The frontend is deployed using the aws-cdk to s3 + cloudfront.

## How would I make this production ready?
* How would ensure the application is highly available and performs well?
  * This app was made with 'serverless' infrastructure. It should be fairly scalable.
    * I could run into account limits on concurrent lambda invocations (aws limit request)
    * I setup Dynamo as pay per request so it should scale
    * The frontend is deployed using cloudfront and s3 for high availability.
* How would you secure it?
  * I would setup cognito to protect the api
  * I would use passportjs in my nest app
  * I would add aws WAF to protect from unwanted traffic
* What would you add to make it easier to troubleshoot problems while it is running live?
  * I would add cloudwatch alarms for lambda
  * I would use newrelic for the api
  * Cloudwatch logs already exist + statistics in Cloudfront and Api Gateway
* Wish-List
  * I would add additional environments for the cdk (dev,stg,prod)
  * I would add additional subdomains (dev,stg) and deploy to them respectively (secure dev/stg under a vpn)
  * I would store user responses and setup sort keys + GSI's in dynamo to allow for multiple data types in my single-table design
  * I would add tests for the frontend + add more components given more time
  * Possibly refactor the service layer for the post endpoint (Probably can be cleaner)
* Linkedin: https://www.linkedin.com/in/michael-v-3066a5a6/
* I had a lot of fun doing this!

## Link to hosted app
UI: [https://appsdirect.click](https://appsdirect.click/)

API: [https://api.appsdirect.click/blueprint](https://api.appsdirect.click/blueprint)

## Example API requests
### GET /blueprint/diagnostic-screener
```
curl --location --request GET 'https://api.appsdirect.click/blueprint/diagnostic-screener'
```
### POST /blueprint/score-answers
```
curl --location --request POST 'https://api.appsdirect.click/blueprint/score-answers' \
--header 'Content-Type: application/json' \
--data-raw '{
    "answers": [
        {
            "value": 2,
            "question_id": "question_a"
        }
    ]
}'
```
