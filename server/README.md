# 0x Protocol API Gateway

This service is responsible for exposing the 0x Protocol API endpoints.

## Endpoints

### Health Check

Endpoint: `/health`

Method: `GET`

Expected Response:

```json
{
  "success": true,
  "responseObject": null,
  "message": "Service is healthy",
  "statusCode": 200
}
```

### Levels

Endpoint: `/rfqt/v3/levels?chainId=1`

Method: `GET`

Expected Response:

```json
{
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": {
    "bids": [
      ["1600.21", "0.55"],
      ["1599.3", "1.02"],
      ["1598.9", "0.23"]
    ],
    "asks": [
      ["1601.25", "2.1"],
      ["1602.55", "1.5"]
    ]
  },
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/0xdac17f958d2ee523a2206206994597c13d831ec7": {
    "bids": [
      ["1600.25", "0.5"],
      ["1599.38", "1.21"],
      ["1598.29", "0.54"]
    ],
    "asks": []
  }
}
```

### Quote

Endpoint: `/rfqt/v3/quote`

Method: `POST`

Request Body:

```json
{
  "chainId": "1",
  "makerToken": "0x514910771af9ca656af840dff83e8264ecf986ca",
  "takerToken": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  "takerAmount": "1000000000",
  "taker": "0x003e1cb9314926ae6d32479e93541b0ddc8d5de8",
  "nonce": "40965050227042607011257170245709898174942929758885760071848663177298536562693",
  "partialFillAllowed": false,
  "spender": "0x7966af62034313d87ede39380bf60f1a84c62be7",
  "zid": "0xe893cb828f16fb056e404a65a0602185",
  "appId": "966fd37f-3618-4ccf-a255-1458eb17e255",
  "feeToken": "0x514910771af9ca656af840dff83e8264ecf986ca",
  "feeAmountBps": "3.14",
  "feeTokenConversionRate": "13.70"
}
```

Expected Response:

```json
{
  "order": {
    "permitted": {
      "token": "0x514910771af9ca656af840dff83e8264ecf986ca",
      "amount": "1100000006"
    },
    "spender": "0x7966af62034313d87ede39380bf60f1a84c62be7",
    "nonce": "40965050227042607011257170245709898174942929758885760071848663177298536562693",
    "deadline": "1711125773",
    "consideration": {
      "token": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      "amount": "1000000000",
      "counterparty": "0x003e1cb9314926ae6d32479e93541b0ddc8d5de8",
      "partialFillAllowed": false
    }
  },

```

### FM Orderbook

Get the raw VOB from Finery Markets

Endpoint: `/fm/book`

Method: `GET`

Expected Response:

```json
{
  "1": {
    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": {
      "bids": [
        ["1600.21", "0.55"],
        ["1599.3", "1.02"],
        ["1598.9", "0.23"]
      ],
      "asks": [
        ["1601.25", "2.1"],
        ["1602.55", "1.5"]
      ]
    }
  }
}
```
