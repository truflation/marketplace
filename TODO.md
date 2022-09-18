* EXAMINE SECURITY ISSUES WITH delegateCall in tfiOperator
* this is being deployed with an unsafe call to delegateCall but it looks
  like you can make it secure by fixing the calling arguments to hard
  code a call to oracleRequest

* docker-compose has order server port open
