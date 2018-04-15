# WonderQ API

## Running the server
run `node wq.js`
the server will start at http://localhost:3000/

## Configuring the queue
To change the amount of time the queue waits before re-assigning an uncomplete job, change `RETRY_INTERVAL` at the top of wq.js

## Producer Endpoints

### `POST /submit`
Use this method to submit a new job for the queue to track. This method expects a `msg` parameter in the post body and returns an integer `id` as part of the response. This `id` can be passed to `/check` to see the status of the job.

### `GET /check/:id`
Use this method to check on the status of a job that was previously submitted to WonderQ. This method expects an integer `id` as a url parameter. The response will be dictionary with the key `status` and one of three values: `completed`, `unassigned`, or `assigned`. If status is `assigned`, there will be a `ts` in the response as well that represents the time that this job was given to a consumer. Note that a status of `completed` simply indicates that this job ID is not present in the queue. It's possible that a job with this ID never was processed by the queue.

## Consumer Endpoints

### `POST /pull`
Queue consumers can use this method to get a list of jobs that need to be processed. This endpoint takes no parameters and returns a list of objects, each with two keys, `id` and `msg`. The consumer is expected to process the `msg` value, then call `/complete` and pass the `id`.

### `POST /complete`
Consumers call this method to report that a job has been completed. This expects an `id` parameter in the post body. The response will be dictionary with the key `status` which will be one of two values: `completed`, `not_found`. `not_found` indicates that the job was not present in the queue. It may have been completed by another consumer.

## Admin Endpoints

### `GET /inspect`
This endpoint is for administrative purposes, it simply returns all jobs currently in the queue in their raw format

