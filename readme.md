# Runtime showdown

## Overview

The goal is to create a service which resonds to the followning http requests, with correct responses. They are intended to represent slightly different types of request wich a service may receive.

I intend to do some some performance testing. But in my experience, as long as some baseline is met, clearity of logic and readability by others are more important features. Therefore I hope we can get some discussion about that aswell.


## Goal API
All the API endpoints respond with JSON over HTTP, like many of the recent microservices we have made.

### `/api/hello`
Hello world!

### `/api/availability`
HTTP proxy.

### `/api/price`
SQL "proxy".

### `/api/item`
Source joining.

### `/api/itemset`
Larger responses.


## Datasources

All datasources uses UUIDs as ids, and all sources contains data for the same ids.

### Postgres SQL
Prices

### HTTP API
Availability

### Flat file
ItemSets
