# sk-scorecard-api
This api was created to support the sk-scorecard-react project by providing a backend that can keep track of active games. It supports CRUD operations for the scorecards and utilizes Socket.IO for pushing updates to the players in realtime.

## Supported Operations

### Get All Scorecards
Endpoint: GET /api/v1/scorecards
Response: JSON body with all scorecards

### Get Scorecard by id
Endpoint: GET /api/v1/scorecards/:id
Response: JSON body with scorecard that matches id

### Add a Scorecard
Endpoint: POST /api/v1/scorecards
Body: JSON - see example
Response: JSON body with the newly added scorecard

<details><summary>Sample Post Body</summary>
<p>
  
```js
{
    "name": "new_scorecard",
    "scorecard": [
        {
            "playerName": "Foo",
            "roundNumber": 1,
            "bid": 1,
            "tricks": 1,
            "bonus": 0,
            "roundTotal": 20
        },
        {
            "playerName": "Bar",
            "roundNumber": 1,
            "bid": 1,
            "tricks": 0,
            "bonus": 0,
            "roundTotal": -10
        },
        {
            "playerName": "FooBar",
            "roundNumber": 1,
            "bid": 0,
            "tricks": 0,
            "bonus": 0,
            "roundTotal": 10
        },
        {
            "playerName": "bar",
            "roundNumber": 1,
            "bid": 0,
            "tricks": 0,
            "bonus": 10,
            "roundTotal": 20
        }
    ],
    "playerTotals": [
        {
            "playerName": "FooBar",
            "total": 20
        },
        {
            "playerName": "Bar",
            "total": -10
        },
        {
            "playerName": "FooBar",
            "total": 10
        },
        {
            "playerName": "Bar",
            "total": 20
        }
    ]
}

```

</p>
</details>


### Update a Scorecard
Endpoint: PUT /api/v1/scorecards/:id
Body: JSON - see example
Response: JSON body with the updated scorecard

<details><summary>Sample Put Body</summary>
<p>
  
```js
{
    "scorecard": [
        {
            "playerName": "Foo",
            "roundNumber": 1,
            "bid": 1,
            "tricks": 1,
            "bonus": 0,
            "roundTotal": 20
        },
        {
            "playerName": "Bar",
            "roundNumber": 1,
            "bid": 1,
            "tricks": 0,
            "bonus": 0,
            "roundTotal": -10
        },
        {
            "playerName": "FooBar",
            "roundNumber": 1,
            "bid": 0,
            "tricks": 0,
            "bonus": 0,
            "roundTotal": 10
        },
        {
            "playerName": "Baz",
            "roundNumber": 1,
            "bid": 0,
            "tricks": 0,
            "bonus": 10,
            "roundTotal": 20
        },
        {
            "playerName": "Foo",
            "roundNumber": 2,
            "bid": 1,
            "tricks": 1,
            "bonus": 0,
            "roundTotal": 20
        },
        {
            "playerName": "Bar",
            "roundNumber": 2,
            "bid": 1,
            "tricks": 1,
            "bonus": 0,
            "roundTotal": 20
        },
        {
            "playerName": "FooBar",
            "roundNumber": 2,
            "bid": 1,
            "tricks": 1,
            "bonus": 0,
            "roundTotal": 20
        },
        {
            "playerName": "Baz",
            "roundNumber": 2,
            "bid": 1,
            "tricks": 1,
            "bonus": 0,
            "roundTotal": 20
        },

    ],
    "playerTotals": [
        {
            "playerName": "Foo",
            "total": 40
        },
        {
            "playerName": "Bar",
            "total": 0
        },
        {
            "playerName": "FooBar",
            "total": 20
        },
        {
            "playerName": "Baz",
            "total": 10
        }
    ]
}

```

</p>
</details>


### Delete a Scorecard
Endpoint: DELETE /api/v1/scorecards/:id
Response: 204 No Content on successful deletion
